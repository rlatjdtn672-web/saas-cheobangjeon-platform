-- ── saas: 상세 허브용 필드 추가 ──
alter table public.saas add column if not exists github_repo text;     -- "owner/repo"
alter table public.saas add column if not exists github_url text;
alter table public.saas add column if not exists body text;            -- 상세 설명(본문)
alter table public.saas add column if not exists links jsonb default '[]'::jsonb; -- [{label,url}]

-- ── events: 유입 출처(source) + github_click 타입 ──
alter table public.events add column if not exists source text;
alter table public.events drop constraint if exists events_type_check;
alter table public.events add constraint events_type_check
  check (type in ('page_view','saas_view','website_click','review_click','github_click'));

-- ── GitHub 스타 히스토리 ──
create table if not exists public.github_stats (
  id bigint generated always as identity primary key,
  saas_id text references public.saas(id) on delete cascade,
  repo text,
  stars int, forks int, open_issues int,
  captured_at timestamptz default now()
);
create index if not exists ghstats_saas_idx on public.github_stats(saas_id, captured_at);
alter table public.github_stats enable row level security;
drop policy if exists "ghstats public read" on public.github_stats;
create policy "ghstats public read" on public.github_stats for select using (true);
-- insert는 service_role(크론)만

-- 기존 뷰 제거(컬럼 변경 위해)
drop view if exists public.impact_summary;
drop view if exists public.saas_stats;
drop view if exists public.daily_inflow;
drop view if exists public.daily_github;
drop view if exists public.github_latest;

-- ── 시계열 뷰 (KST 기준 일자별) ──
create or replace view public.daily_inflow as
  select (created_at at time zone 'Asia/Seoul')::date as day,
         coalesce(nullif(source,''),'direct') as source,
         count(*) as visits
  from public.events
  where type in ('page_view','saas_view')
  group by 1,2;

create or replace view public.daily_github as
  select (created_at at time zone 'Asia/Seoul')::date as day,
         count(*) as github_clicks
  from public.events
  where type = 'github_click'
  group by 1;

create or replace view public.github_latest as
  select distinct on (saas_id) saas_id, repo, stars, forks, open_issues, captured_at
  from public.github_stats
  order by saas_id, captured_at desc;

-- 확장 집계: github 전환 포함
create or replace view public.impact_summary as
  select
    (select count(*) from public.saas) as total_reviews,
    count(*) filter (where type='website_click') as total_website_clicks,
    count(*) filter (where type='review_click')  as total_review_clicks,
    count(*) filter (where type='github_click')  as total_github_clicks,
    count(*) filter (where type in ('page_view','saas_view')) as total_visits,
    count(*) filter (where type in ('page_view','saas_view') and source='linkedin') as total_linkedin_visits
  from public.events;

create or replace view public.saas_stats as
  select s.id as saas_id,
    count(*) filter (where e.type='website_click') as website_clicks,
    count(*) filter (where e.type='review_click')  as review_clicks,
    count(*) filter (where e.type='github_click')  as github_clicks,
    count(*) filter (where e.type in ('page_view','saas_view')) as views
  from public.saas s left join public.events e on e.saas_id = s.id
  group by s.id;

grant select on public.daily_inflow, public.daily_github, public.github_latest,
  public.github_stats, public.impact_summary, public.saas_stats to anon, authenticated;

-- ── 두 SaaS에 GitHub 레포 + 본문 + 관련 링크 채우기 ──
update public.saas set
  github_repo='TauricResearch/TradingAgents',
  github_url='https://github.com/TauricResearch/TradingAgents',
  body='TradingAgents는 LLM 멀티 에이전트로 구성된 금융 트레이딩 프레임워크다. 펀더멘털·센티먼트·뉴스·기술적 분석가 에이전트가 각자 리서치를 내고, 불/베어 리서처가 토론하며, 트레이더 에이전트가 최종 의사결정을, 리스크 매니저가 검증한다. "AI가 알아서 내 돈으로 주식거래를?"이라는 자극적 기대와 달리, 실제로는 백테스트·페이퍼 트레이딩 단계에서 검증 도구로 보는 게 맞다. 실거래 연결 전 반드시 리스크 한도와 휴먼 인 더 루프를 둘 것을 처방한다.',
  links='[{"label":"GitHub 레포","url":"https://github.com/TauricResearch/TradingAgents"},{"label":"논문/문서","url":"https://github.com/TauricResearch/TradingAgents#readme"}]'::jsonb
where id='tradingagents';

update public.saas set
  github_repo='n8n-io/n8n',
  github_url='https://github.com/n8n-io/n8n',
  body='n8n은 노드 기반의 워크플로 자동화 툴로, Zapier/Make의 셀프호스팅 가능한 오픈소스 대안이다. 400+ 통합과 코드 노드로 유연하지만, 폐쇄망 대기업에서는 이야기가 다르다. 라이선스(엔터프라이즈) 자체보다 외부 SaaS 노드의 아웃바운드 통신, npm 패키지 설치, OAuth 콜백 같은 부분이 망분리 정책에 막힌다. 결국 "되긴 되는데 우리 환경에선 반쪽"이 되는 지점을 미리 짚어주는 처방.',
  links='[{"label":"공식 사이트","url":"https://n8n.io"},{"label":"GitHub 레포","url":"https://github.com/n8n-io/n8n"},{"label":"문서","url":"https://docs.n8n.io"}]'::jsonb
where id='n8n';
