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
    body:
      "n8n은 노드 기반의 워크플로 자동화 툴로, Zapier/Make의 셀프호스팅 가능한 오픈소스 대안이다. 400+ 통합과 코드 노드로 유연하지만, 폐쇄망 대기업에서는 이야기가 다르다. 라이선스(엔터프라이즈) 자체보다 외부 SaaS 노드의 아웃바운드 통신, npm 패키지 설치, OAuth 콜백 같은 부분이 망분리 정책에 막힌다. 결국 \"되긴 되는데 우리 환경에선 반쪽\"이 되는 지점을 미리 짚어주는 처방.",
    category: "워크플로 자동화",
    pricing: "오픈소스 / 셀프호스팅 / Enterprise",
    websiteUrl: "https://n8n.io",
    githubUrl: "https://github.com/n8n-io/n8n",
    docUrl: "https://docs.n8n.io",
    githubRepo: "n8n-io/n8n",
    logoUrl: "https://n8n.io/favicon.ico",
    links: [
      { label: "공식 사이트", url: "https://n8n.io" },
      { label: "GitHub 레포", url: "https://github.com/n8n-io/n8n" },
      { label: "문서", url: "https://docs.n8n.io" },
    ],
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
    body:
      "TradingAgents는 LLM 멀티 에이전트로 구성된 금융 트레이딩 프레임워크다. 펀더멘털·센티먼트·뉴스·기술적 분석가 에이전트가 각자 리서치를 내고, 불/베어 리서처가 토론하며, 트레이더 에이전트가 최종 의사결정을, 리스크 매니저가 검증한다. \"AI가 알아서 내 돈으로 주식거래를?\"이라는 자극적 기대와 달리, 실제로는 백테스트·페이퍼 트레이딩 단계에서 검증 도구로 보는 게 맞다. 실거래 연결 전 반드시 리스크 한도와 휴먼 인 더 루프를 둘 것을 처방한다.",
    category: "AI 에이전트 / 핀테크",
    pricing: "오픈소스",
    websiteUrl: "https://github.com/TauricResearch/TradingAgents",
    githubUrl: "https://github.com/TauricResearch/TradingAgents",
    docUrl: "https://github.com/TauricResearch/TradingAgents#readme",
    githubRepo: "TauricResearch/TradingAgents",
    logoUrl: "https://github.com/favicon.ico",
    links: [
      { label: "GitHub 레포", url: "https://github.com/TauricResearch/TradingAgents" },
      { label: "논문/문서", url: "https://github.com/TauricResearch/TradingAgents#readme" },
    ],
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
