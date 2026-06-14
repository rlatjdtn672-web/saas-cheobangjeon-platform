create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.gh_requests(
  request_id bigint primary key,
  saas_id text,
  repo text,
  created_at timestamptz default now()
);

-- 1) GitHub API 요청 발사 (비동기)
create or replace function public.gh_fire_requests() returns void
language plpgsql security definer as $fn$
declare r record; rid bigint;
begin
  delete from public.gh_requests where created_at < now() - interval '2 hours';
  for r in select id, github_repo from public.saas where github_repo is not null loop
    select net.http_get(
      url := 'https://api.github.com/repos/'||r.github_repo,
      headers := jsonb_build_object('User-Agent','saas-cheobangjeon','Accept','application/vnd.github+json')
    ) into rid;
    insert into public.gh_requests(request_id, saas_id, repo) values (rid, r.id, r.github_repo)
      on conflict (request_id) do nothing;
  end loop;
end$fn$;

-- 2) 응답 수거 → github_stats 적재
create or replace function public.gh_collect_responses() returns void
language plpgsql security definer as $fn$
declare q record; body jsonb;
begin
  for q in
    select gr.request_id, gr.saas_id, gr.repo, resp.status_code, resp.content
    from public.gh_requests gr
    join net._http_response resp on resp.id = gr.request_id
    where gr.created_at > now() - interval '2 hours'
  loop
    if q.status_code = 200 and q.content is not null then
      body := q.content::jsonb;
      insert into public.github_stats(saas_id, repo, stars, forks, open_issues)
      values (q.saas_id, q.repo,
        (body->>'stargazers_count')::int,
        (body->>'forks_count')::int,
        (body->>'open_issues_count')::int);
    end if;
    delete from public.gh_requests where request_id = q.request_id;
  end loop;
end$fn$;

-- 스케줄 (UTC): 매일 00:00 발사, 00:05 수거  → KST 09:00 / 09:05
select cron.unschedule('gh-fire') where exists (select 1 from cron.job where jobname='gh-fire');
select cron.unschedule('gh-collect') where exists (select 1 from cron.job where jobname='gh-collect');
select cron.schedule('gh-fire','0 0 * * *', $$select public.gh_fire_requests();$$);
select cron.schedule('gh-collect','5 0 * * *', $$select public.gh_collect_responses();$$);
