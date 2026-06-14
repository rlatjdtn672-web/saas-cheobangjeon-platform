-- ───────────────────────────────────────────────────────────────
--  실전 SaaS 처방전 플랫폼 - Supabase 스키마
--  Supabase 대시보드 > SQL Editor 에 이 파일 전체를 붙여넣고 RUN 하세요.
-- ───────────────────────────────────────────────────────────────

-- 1) 리뷰한 SaaS 목록
create table if not exists public.saas (
  id            text primary key,
  slug          text unique not null,
  name          text not null,
  tagline       text,
  description   text,
  category      text,
  pricing       text,
  website_url   text,
  logo_url      text,
  review_title  text,
  review_url    text,
  published_at  date,
  issue_no      text,
  featured      boolean default false,
  created_at    timestamptz default now()
);

-- 2) 트래픽 이벤트 (임팩트 측정의 핵심)
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  type       text not null check (type in ('page_view','saas_view','website_click','review_click')),
  saas_id    text references public.saas(id) on delete set null,
  referrer   text,
  created_at timestamptz default now()
);

create index if not exists events_type_idx on public.events(type);
create index if not exists events_saas_idx on public.events(saas_id);
create index if not exists events_created_idx on public.events(created_at);

-- 3) RLS: saas는 누구나 읽기 가능, events는 서버(service_role)만 기록
alter table public.saas enable row level security;
alter table public.events enable row level security;

drop policy if exists "saas public read" on public.saas;
create policy "saas public read" on public.saas
  for select using (true);

-- events 는 service_role 키로만 insert (애플리케이션 서버에서만).
-- 익명 클라이언트는 읽기/쓰기 불가 → 지표 위변조 방지.

-- ───────────────────────────────────────────────────────────────
-- 4) 시드 데이터 (뉴스레터 실제 발행 내역)
-- ───────────────────────────────────────────────────────────────
insert into public.saas
  (id, slug, name, tagline, description, category, pricing, website_url, logo_url, review_title, review_url, published_at, issue_no, featured)
values
  (
    'n8n', 'n8n', 'n8n',
    '노드 기반 워크플로 자동화. 셀프호스팅 가능한 오픈소스 자동화 툴.',
    'Zapier/Make의 대안으로 많이 거론되지만, 폐쇄망 대기업 환경에서는 enterprise 라이선스조차 결국 막히는 지점이 있다. 어디까지 되고 어디서 막히는지 실제 도입 관점에서 처방.',
    '워크플로 자동화', '오픈소스 / 셀프호스팅 / Enterprise',
    'https://n8n.io', 'https://n8n.io/favicon.ico',
    'n8n enterprise, 폐쇄망 대기업에선 결국 막힌다.',
    'https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/',
    '2026-06-03', '2호', true
  ),
  (
    'tradingagents', 'tradingagents', 'TradingAgents',
    '멀티 에이전트 LLM 금융 트레이딩 프레임워크.',
    'AI 에이전트들이 애널리스트/리서처/트레이더 역할을 나눠 맡아 의사결정을 시뮬레이션한다. 실제로 어디까지 믿을 수 있는지, 무엇을 조심해야 하는지 처방.',
    'AI 에이전트 / 핀테크', '오픈소스',
    'https://github.com/TauricResearch/TradingAgents', 'https://github.com/favicon.ico',
    'AI가 알아서 내돈으로 주식거래를? - TradingAgents',
    'https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/',
    '2026-05-26', '1호', true
  )
on conflict (id) do nothing;
