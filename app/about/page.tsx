import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import { NEWSLETTER } from "@/data/seed";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "소개 — 김성수 (Sungsu Kim)",
  description:
    "삼성전자 AI 인프라 엔지니어. 폐쇄망(air-gapped) 환경의 LLM 플랫폼·GPU 인프라·RAG를 만듭니다.",
  alternates: { canonical: "/about" },
};

const EMAIL = "rlatjdtn672@gmail.com";

type Role = { title: string; org: string; period: string; points: string[] };

const EXPERIENCE: Role[] = [
  {
    title: "AI Infrastructure Engineer",
    org: "삼성전자 DS부문 · S.LSI",
    period: "2025.02 – 현재",
    points: [
      "완전 폐쇄망(air-gapped) 반도체 환경에서 사내 LLM 플랫폼용 프로덕션 GPU 인프라(96 GPU: 8×H200 + 4×H100) 설계. vLLM + LMCache를 Kubernetes에 배포, Keycloak SSO·Prometheus/Grafana 연동 → 9,000+ 엔지니어, 일 30만 쿼리·6,000 MAU 규모. (DS Vision Award, 팀)",
      "LiteLLM 프록시로 Anthropic 호환 엔드포인트를 구성해 망분리 환경에서 Claude Code를 사용 가능하게 함(ANTHROPIC_BASE_URL 리다이렉션). 6주 만에 3,000명으로 확장, $7.5M 투자 C-level 승인 견인. (President's Award, 개인)",
      "Dify 기반 프로덕션 RAG 에이전트 구축 — Confluence 야간 동기화로 기밀문서 1만+ 페이지를 Milvus(BGE 임베딩)에 색인. 실제 질문 300개 벤치마크에서 90% 정확도.",
    ],
  },
  {
    title: "Infra Task Force",
    org: "삼성전자 DS부문 · S.LSI",
    period: "2024.02 – 2025.01",
    points: [
      "유럽 자동차 OEM ↔ 한국 간 데이터 전송 병목(10GB에 20시간) 진단. 사이트별 네트워크 경로 프로파일링 대시보드(Streamlit + FastAPI/pandas) 구축, UK-Israel 스위치 버퍼 오버플로우를 찾아 전송시간 20배 단축(20h→1h).",
      "$750M EDA 라이선스 포트폴리오(6,000 엔지니어/200 프로젝트)에 대한 bottom-up 비용 귀속 시스템 설계(Python·pandas·MongoDB). 임원 정기 지표로 채택. (DS Vision Award, 팀)",
    ],
  },
  {
    title: "DevOps Engineer",
    org: "삼성전자 DS부문 · AI Center",
    period: "2023.01 – 2024.01",
    points: [
      "5개 사이트(한국·UK·이스라엘·US-Austin·인도)에 Perforce 글로벌 복제 토폴로지 배포 → 9,000+ 엔지니어의 칩 설계 데이터 지연 6배 개선(1h→10min).",
      "디스크 장애로 라이브·백업 동시 손실을 겪은 뒤, 수십억 달러 설계 IP를 위한 5계층 백업 아키텍처(복제·스냅샷·오프사이트 테이프) 설계.",
    ],
  },
  {
    title: "MES Engineer",
    org: "삼성전자 · 삼성디스플레이 MES팀",
    period: "2020.02 – 2022.12",
    points: [
      "실시간 3-시그마 이상치 탐지(Vue.js→Java→Oracle PL/SQL) 구현, 인덱스 최적화로 응답속도 6배 개선(60s→10s) — 수천만 달러 웨이퍼 폐기 예방.",
    ],
  },
];

const SPEAKING = [
  "Claude Bloom (2026.06) · 연세대 MBA 초청 강연 — 엔터프라이즈 AI 도입 & LLMOps",
  "JobKorea VibeThon (2026.07, 예정) · 초청 심사위원 — AI/바이브 코딩 해커톤",
  "vLLM Korea Meetup (2026) · 200명(네이버·카카오·현대) — 사내 LLM 서빙 스케일링",
  "Arize AI & Dify Korea Meetup @ AWS Korea (2026) · 폐쇄망 Claude Code·RAG 사례",
  "LinkedIn 콘텐츠 크리에이터 · 팔로워 4,500+, 최고 게시글 9만 뷰",
];

const AWARDS = [
  "삼성 DS President's Award (DS Vision Award) — 3회 수상: 개인 2026.04(폐쇄망 Claude Code), 팀 2025.04(GPU LLM 인프라), 팀 2024.08($750M EDA 비용 시스템)",
  "B.S. 소프트웨어공학, 한국항공대학교 (2020.02)",
];

const SKILLS: { k: string; v: string }[] = [
  { k: "LLM & AI", v: "vLLM, LMCache, LiteLLM, Ollama, Dify, RAG, BGE Embeddings, MCP" },
  { k: "Infra", v: "Kubernetes, Docker, GPU 클러스터(H200/H100/A100), Perforce, Linux, Networking" },
  { k: "DevOps & Data", v: "CI/CD, Prometheus, Grafana, Keycloak(SSO), Python, FastAPI, Pandas, Java, PL/SQL, Oracle, MongoDB, Milvus" },
];

export default function AboutPage() {
  return (
    <main className="relative">
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[260px]" />
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-12">
        {/* 헤더 */}
        <h1 className="text-3xl font-bold tracking-tight text-white">김성수 · Sungsu Kim</h1>
        <p className="mt-2 text-[15px] text-zinc-200">
          삼성전자 DS부문 <span className="text-accent">AI Infrastructure Engineer</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          폐쇄망(air-gapped) 환경에서 사내 LLM 플랫폼·GPU 인프라·RAG를 설계·운영합니다. 9,000+ 엔지니어가 쓰는
          AI 인프라를 만들고, SaaS 100개를 직접 결제해보며 리뷰합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`mailto:${EMAIL}`} className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white">
            ✉ {EMAIL}
          </a>
          <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white">
            in · LinkedIn
          </a>
          <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white">
            ✉ 뉴스레터
          </a>
        </div>

        {/* 경력 */}
        <Section title="경력">
          <div className="space-y-5">
            {EXPERIENCE.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-white">{r.title}</h3>
                  <span className="text-xs text-muted">{r.period}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-accent">{r.org}</p>
                <ul className="mt-3 space-y-2">
                  {r.points.map((p, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-300">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* 강연/커뮤니티 */}
        <Section title="강연 · 커뮤니티">
          <ul className="space-y-2">
            {SPEAKING.map((s, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-300">
                <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent2" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 창업 */}
        <Section title="창업 경험">
          <div className="rounded-2xl border border-border bg-card p-5 text-[13px] leading-relaxed text-zinc-300">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-white">공동창업·운영 · 수학/영어 학원</h3>
              <span className="text-xs text-muted">2024 – 2026</span>
            </div>
            <p className="mt-3">
              삼성 풀타임 근무와 병행해 $4K로 부트스트랩 → 18개월 만에 정원(40명) 달성, ARR $120K·순이익률 85%+.
              프리미엄 가격 전략(지역 최고가)으로 95%+ 리텐션 — 0에서 서비스를 만들고·가격 책정하고·키운 경험.
            </p>
          </div>
        </Section>

        {/* 학력/수상 */}
        <Section title="학력 · 수상">
          <ul className="space-y-2">
            {AWARDS.map((a, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-300">
                <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 스킬 */}
        <Section title="스킬">
          <div className="space-y-2.5">
            {SKILLS.map((s) => (
              <div key={s.k} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-accent">{s.k}</p>
                <p className="mt-1 text-[13px] text-zinc-300">{s.v}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
