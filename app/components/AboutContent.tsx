"use client";

import { useState } from "react";
import Link from "next/link";
import { NEWSLETTER } from "@/data/seed";

const EMAIL = "rlatjdtn672@gmail.com";

type Role = { title: string; org: string; period: string; points: string[] };
type Lang = "ko" | "en";

const DATA: Record<
  Lang,
  {
    name: string;
    role: string;
    intro: string;
    labels: { experience: string; speaking: string; entre: string; edu: string; skills: string };
    experience: Role[];
    speaking: string[];
    entre: { title: string; period: string; body: string };
    awards: string[];
    skills: { k: string; v: string }[];
  }
> = {
  ko: {
    name: "김성수 · Sungsu Kim",
    role: "삼성전자 DS부문 AI Infrastructure Engineer",
    intro:
      "폐쇄망(air-gapped) 환경에서 사내 LLM 플랫폼·GPU 인프라·RAG를 설계·운영합니다. 9,000+ 엔지니어가 쓰는 AI 인프라를 만들고, SaaS 100개를 직접 결제해보며 리뷰합니다.",
    labels: { experience: "경력", speaking: "강연 · 커뮤니티", entre: "창업 경험", edu: "학력 · 수상", skills: "스킬" },
    experience: [
      {
        title: "AI Infrastructure Engineer",
        org: "삼성전자 DS부문 · S.LSI",
        period: "2025.02 – 현재",
        points: [
          "완전 폐쇄망 반도체 환경에서 사내 LLM 플랫폼용 프로덕션 GPU 인프라(96 GPU: 8×H200 + 4×H100) 설계. vLLM + LMCache를 Kubernetes에 배포, Keycloak SSO·Prometheus/Grafana 연동 → 9,000+ 엔지니어, 일 30만 쿼리·6,000 MAU. (DS Vision Award, 팀)",
          "LiteLLM 프록시로 Anthropic 호환 엔드포인트를 구성해 망분리 환경에서 Claude Code 사용 가능하게 함. 6주 만에 3,000명 확장, $7.5M 투자 C-level 승인 견인. (President's Award, 개인)",
          "Dify 기반 프로덕션 RAG 에이전트 구축 — Confluence 야간 동기화로 기밀문서 1만+ 페이지를 Milvus(BGE 임베딩)에 색인. 300개 벤치마크 90% 정확도.",
        ],
      },
      {
        title: "Infra Task Force",
        org: "삼성전자 DS부문 · S.LSI",
        period: "2024.02 – 2025.01",
        points: [
          "유럽 자동차 OEM↔한국 데이터 전송 병목(10GB 20시간) 진단. 네트워크 경로 프로파일링 대시보드(Streamlit + FastAPI/pandas) 구축, UK-Israel 스위치 버퍼 오버플로우 발견 → 전송시간 20배 단축(20h→1h).",
          "$750M EDA 라이선스 포트폴리오(6,000 엔지니어/200 프로젝트) bottom-up 비용 귀속 시스템 설계(Python·pandas·MongoDB). 임원 정기 지표 채택. (DS Vision Award, 팀)",
        ],
      },
      {
        title: "DevOps Engineer",
        org: "삼성전자 DS부문 · AI Center",
        period: "2023.01 – 2024.01",
        points: [
          "5개 사이트(한국·UK·이스라엘·US-Austin·인도) Perforce 글로벌 복제 토폴로지 배포 → 9,000+ 엔지니어 칩 설계 데이터 지연 6배 개선(1h→10min).",
          "디스크 장애로 라이브·백업 동시 손실 후, 수십억 달러 설계 IP용 5계층 백업 아키텍처 설계.",
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
    ],
    speaking: [
      "Claude Bloom (2026.06) · 연세대 MBA 초청 강연 — 엔터프라이즈 AI 도입 & LLMOps",
      "JobKorea VibeThon (2026.07, 예정) · 초청 심사위원 — AI/바이브 코딩 해커톤",
      "vLLM Korea Meetup (2026) · 200명(네이버·카카오·현대) — 사내 LLM 서빙 스케일링",
      "Arize AI & Dify Korea Meetup @ AWS Korea (2026) · 폐쇄망 Claude Code·RAG 사례",
      "LinkedIn 콘텐츠 크리에이터 · 팔로워 5,000+, 최고 게시글 9만 뷰",
    ],
    entre: {
      title: "리아영어 · 영어 학원 직접 운영",
      period: "2024 – 현재",
      body: "",
    },
    awards: [
      "삼성 DS President's Award (DS Vision Award) — 3회 수상: 개인 2026.04(폐쇄망 Claude Code), 팀 2025.04(GPU LLM 인프라), 팀 2024.08($750M EDA 비용 시스템)",
      "B.S. 소프트웨어공학, 한국항공대학교 (2020.02)",
    ],
    skills: [
      { k: "LLM & AI", v: "vLLM, LMCache, LiteLLM, Ollama, Dify, RAG, BGE Embeddings, MCP" },
      { k: "Infra", v: "Kubernetes, Docker, GPU 클러스터(H200/H100/A100), Perforce, Linux, Networking" },
      { k: "DevOps & Data", v: "CI/CD, Prometheus, Grafana, Keycloak(SSO), Python, FastAPI, Pandas, Java, PL/SQL, Oracle, MongoDB, Milvus" },
    ],
  },
  en: {
    name: "Sungsu Kim",
    role: "AI Infrastructure Engineer · Samsung Electronics (DS · S.LSI)",
    intro:
      "I design and operate in-house LLM platforms, GPU infrastructure, and RAG systems in fully air-gapped environments — building AI infra used by 9,000+ engineers. I also personally pay for 100+ SaaS tools and review them honestly.",
    labels: { experience: "Experience", speaking: "Speaking & Community", entre: "Entrepreneurship", edu: "Education & Awards", skills: "Skills" },
    experience: [
      {
        title: "AI Infrastructure Engineer",
        org: "Samsung Electronics, DS Division – S.LSI",
        period: "Feb 2025 – Present",
        points: [
          "Architected production GPU infrastructure (96 GPUs: 8×H200 + 4×H100) for an internal LLM platform in a fully air-gapped semiconductor environment; deployed vLLM + LMCache on Kubernetes with Keycloak SSO and Prometheus/Grafana — scaling to 300K daily queries and 6,000 MAU across 9,000+ engineers. (DS Vision Award, Team)",
          "Designed a LiteLLM proxy exposing an Anthropic-compatible endpoint backed by internal vLLM clusters, enabling Claude Code in a network-isolated environment via ANTHROPIC_BASE_URL redirection. Scaled to 3,000 users in 6 weeks, driving C-level approval of a $7.5M investment. (President's Award, Individual)",
          "Built a production RAG agent on Dify with a nightly Confluence sync pipeline indexing 10,000+ pages of classified docs into Milvus (BGE embeddings). Achieved 90% accuracy on a 300-question benchmark.",
        ],
      },
      {
        title: "Infra Task Force",
        org: "Samsung Electronics, DS Division – S.LSI",
        period: "Feb 2024 – Jan 2025",
        points: [
          "Diagnosed a critical data-transfer bottleneck (20 hrs for 10GB) from a European automotive OEM to Korea. Built a network-path profiling dashboard (Streamlit + FastAPI/pandas) and pinpointed a UK-Israel switch buffer overflow — cutting transfer time 20x (20 hrs → 1 hr).",
          "Designed a bottom-up cost-attribution system for a $750M EDA license portfolio across 6,000 engineers / 200 projects (Python, pandas, MongoDB). Became a recurring executive metric. (DS Vision Award, Team)",
        ],
      },
      {
        title: "DevOps Engineer",
        org: "Samsung Electronics, DS Division – AI Center",
        period: "Jan 2023 – Jan 2024",
        points: [
          "Deployed a globally distributed Perforce replication topology across 5 sites (Korea, UK, Israel, US-Austin, India) for 9,000+ engineers — improving cross-region latency 6x (1 hr → 10 min).",
          "Designed a 5-layer backup architecture for multi-billion-dollar design IP after a disk fault caused simultaneous loss of live data and backup.",
        ],
      },
      {
        title: "MES Engineer",
        org: "Samsung Electronics & Samsung Display, MES Team",
        period: "Feb 2020 – Dec 2022",
        points: [
          "Implemented real-time 3-Sigma outlier detection (Vue.js → Java → Oracle PL/SQL) and optimized Oracle queries — improving response time 6x (60s → 10s) and preventing tens of millions USD in potential wafer scrap.",
        ],
      },
    ],
    speaking: [
      "Claude Bloom (Jun 2026) · Invited speaker, Yonsei University MBA — enterprise AI adoption & LLMOps",
      "JobKorea VibeThon (Jul 2026, upcoming) · Invited judge — AI / vibe-coding hackathon",
      "vLLM Korea Meetup (2026) · 200 attendees (Naver, Kakao, Hyundai) — private LLM serving at scale",
      "Arize AI & Dify Korea Meetups @ AWS Korea HQ (2026) · air-gapped Claude Code & RAG case studies",
      "LinkedIn Content Creator · 5,000+ followers; top post 90K views",
    ],
    entre: {
      title: "Lia English · Founder & Operator (English Academy)",
      period: "2024 – Present",
      body: "",
    },
    awards: [
      "Samsung DS President's Award (DS Vision Award) — 3-time recipient: Individual, Apr 2026 (air-gapped Claude Code); Team, Apr 2025 (GPU LLM infra); Team, Aug 2024 ($750M EDA cost system)",
      "B.S. in Software Engineering, Korea Aerospace University (Feb 2020)",
    ],
    skills: [
      { k: "LLM & AI", v: "vLLM, LMCache, LiteLLM, Ollama, Dify, RAG, BGE Embeddings, MCP" },
      { k: "Infrastructure", v: "Kubernetes, Docker, GPU clusters (H200/H100/A100), Perforce, Linux, Networking" },
      { k: "DevOps & Data", v: "CI/CD, Prometheus, Grafana, Keycloak (SSO), Python, FastAPI, Pandas, Java, PL/SQL, Oracle, MongoDB, Milvus" },
    ],
  },
};

export default function AboutContent() {
  const [lang, setLang] = useState<Lang>("ko");
  const d = DATA[lang];

  const aLink = "text-accent hover:underline";
  const introNode =
    lang === "ko" ? (
      <>
        폐쇄망(air-gapped) 환경에서 사내 LLM 플랫폼·GPU 인프라·RAG를 설계·운영하는 AI 인프라
        엔지니어입니다. LinkedIn에 AI·인프라 이야기를 쓰며{" "}
        <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className={aLink}>
          팔로워 5,000+
        </a>
        를 모았고, 이곳{" "}
        <Link href="/blog" className={aLink}>
          블로그
        </Link>
        에도 글을 씁니다. 영어 학원{" "}
        <Link href="/english" className={aLink}>
          리아영어
        </Link>
        를 직접 운영하고, SaaS 100개를 결제해보며{" "}
        <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className={aLink}>
          격주 뉴스레터
        </a>
        로 솔직하게 리뷰합니다.
      </>
    ) : (
      <>
        I&apos;m an AI infrastructure engineer building in-house LLM platforms, GPU infrastructure,
        and RAG in fully air-gapped environments. I write about AI &amp; infra on{" "}
        <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className={aLink}>
          LinkedIn (5,000+ followers)
        </a>{" "}
        and on this{" "}
        <Link href="/blog" className={aLink}>
          blog
        </Link>
        , founded and run an English academy{" "}
        <Link href="/english" className={aLink}>
          (Lia English)
        </Link>
        , and review 100+ SaaS tools I&apos;ve paid for in a{" "}
        <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className={aLink}>
          biweekly newsletter
        </a>
        .
      </>
    );
  const entreBody =
    lang === "ko" ? (
      <>
        엔지니어이면서 직접 교육 비즈니스{" "}
        <Link href="/english" className={aLink}>
          리아영어
        </Link>
        를 창업해 운영했습니다. 고객을 모으고·마케팅하고·운영을 최적화하는 전 과정을 책임지며 0에서
        정원(40명)까지 키웠어요. 이 경험에서 &apos;오프라인 사업자의 고객 획득&apos;이라는 문제를 깊이
        이해했고, 지금은 그걸 데이터·AI로 자동화하는 걸 만들고 있습니다.
      </>
    ) : (
      <>
        As an engineer, I also founded and ran an education business,{" "}
        <Link href="/english" className={aLink}>
          Lia English
        </Link>
        — owning the full cycle of customer acquisition, marketing, and operations, and growing it
        from zero to full capacity (40 students). That taught me the real problem of customer
        acquisition for offline businesses, and I&apos;m now building ways to automate it with data
        &amp; AI.
      </>
    );

  return (
    <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-12">
      {/* 언어 토글 */}
      <div className="mb-4 flex justify-end">
        <div className="flex gap-1 rounded-lg border border-border p-0.5 text-xs">
          {(["ko", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-md px-2.5 py-1 transition ${
                lang === l ? "bg-accent text-white" : "text-muted hover:text-white"
              }`}
            >
              {l === "ko" ? "한국어" : "English"}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-white">{d.name}</h1>
      <p className="mt-2 text-[15px] text-zinc-200">{d.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{introNode}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`mailto:${EMAIL}`} className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white">
          ✉ {EMAIL}
        </a>
        <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white">
          in · LinkedIn
        </a>
        <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white">
          ✉ Newsletter
        </a>
      </div>

      <Section title={d.labels.experience}>
        <div className="space-y-5">
          {d.experience.map((r) => (
            <div key={r.title + r.period} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-white">{r.title}</h3>
                <span className="text-xs text-muted">{r.period}</span>
              </div>
              <p className="mt-0.5 text-[13px] text-accent">{r.org}</p>
              <ul className="mt-3 space-y-2">
                {r.points.map((pt, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-300">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={d.labels.speaking}>
        <ul className="space-y-2">
          {d.speaking.map((s, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-300">
              <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent2" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={d.labels.entre}>
        <div className="rounded-2xl border border-border bg-card p-5 text-[13px] leading-relaxed text-zinc-300">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-white">{d.entre.title}</h3>
            <span className="text-xs text-muted">{d.entre.period}</span>
          </div>
          <p className="mt-3">{entreBody}</p>
        </div>
      </Section>

      <Section title={d.labels.edu}>
        <ul className="space-y-2">
          {d.awards.map((a, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-300">
              <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={d.labels.skills}>
        <div className="space-y-2.5">
          {d.skills.map((s) => (
            <div key={s.k} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-accent">{s.k}</p>
              <p className="mt-1 text-[13px] text-zinc-300">{s.v}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
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
