import type { Saas } from "@/lib/types";

// 뉴스레터 "실전 SaaS 처방전" (by 김성수) 의 실제 발행 내역 기반 시드 데이터.
// 새 SaaS를 리뷰할 때마다 여기(또는 Supabase saas 테이블)에 추가하면 됩니다.

export const NEWSLETTER = {
  name: "실전 SaaS 처방전",
  author: "김성수",
  tagline:
    "SaaS 100개를 직접 결제해본 사람의 솔직한 처방전. 툴 소개가 아니라, 당신 회사의 진짜 문제를 짚고 \"이건 이걸로 풀어보세요\"를 처방합니다.",
  cadence: "격주 발행",
  newsletterUrl:
    "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
};

export const SEED_SAAS: Saas[] = [
  {
    id: "n8n",
    slug: "n8n",
    name: "n8n",
    tagline: "노드 기반 워크플로 자동화. 셀프호스팅 가능한 오픈소스 자동화 툴.",
    description:
      "Zapier/Make의 대안으로 많이 거론되지만, 폐쇄망 대기업 환경에서는 enterprise 라이선스조차 결국 막히는 지점이 있다. 어디까지 되고 어디서 막히는지 실제 도입 관점에서 처방.",
    category: "워크플로 자동화",
    pricing: "오픈소스 / 셀프호스팅 / Enterprise",
    websiteUrl: "https://n8n.io",
    logoUrl: "https://n8n.io/favicon.ico",
    reviewTitle: "n8n enterprise, 폐쇄망 대기업에선 결국 막힌다.",
    reviewUrl:
      "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
    publishedAt: "2026-06-03",
    issueNo: "2호",
    featured: true,
  },
  {
    id: "tradingagents",
    slug: "tradingagents",
    name: "TradingAgents",
    tagline: "멀티 에이전트 LLM 금융 트레이딩 프레임워크.",
    description:
      "AI 에이전트들이 애널리스트/리서처/트레이더 역할을 나눠 맡아 의사결정을 시뮬레이션한다. \"AI가 알아서 내 돈으로 주식거래를?\" 실제로 어디까지 믿을 수 있는지, 무엇을 조심해야 하는지 처방.",
    category: "AI 에이전트 / 핀테크",
    pricing: "오픈소스",
    websiteUrl: "https://github.com/TauricResearch/TradingAgents",
    logoUrl: "https://github.com/favicon.ico",
    reviewTitle: "AI가 알아서 내돈으로 주식거래를? - TradingAgents",
    reviewUrl:
      "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
    publishedAt: "2026-05-26",
    issueNo: "1호",
    featured: true,
  },
];

// SaaS 없이 발행된 오프닝 글도 "임팩트" 집계용으로 노출하고 싶다면 사용.
export const INTRO_POST = {
  title: "0호. SaaS 처방전을 시작하며",
  url: "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
  publishedAt: "2026-05-22",
};
