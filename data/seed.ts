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
  // 작성자 본인 LinkedIn 프로필 (DM·연결용)
  linkedinProfile:
    "https://www.linkedin.com/in/%EC%84%B1%EC%88%98-%EA%B9%80-9b04303a0/",
  bio: "SaaS 100개를 직접 결제해보고, 진짜 문제를 짚어 \"이건 이걸로 풀어보세요\"를 처방하는 뉴스레터를 격주로 씁니다.",
  contactEmail: "rlatjdtn672@gmail.com",
};

export const SEED_SAAS: Saas[] = [
  {
    id: "physics-lab",
    slug: "physics-lab",
    name: "물리 게임 실험실",
    tagline:
      "Claude 4종(Fable·Opus·Sonnet·Haiku)에게 같은 프롬프트로 Matter.js 새총 물리 게임을 만들게 시켰다. 조준선·사운드·파티클까지 — 누가 가장 완성도 높은 물리 게임을 만들까?",
    description:
      "Claude 4종 × 물리 게임 벤치마크. 각 모델의 결과물을 직접 플레이해보고 비교. (판정은 직접 테스트 후 업데이트 예정)",
    category: "AI / 벤치마크",
    pricing: "오픈",
    websiteUrl: "https://seungsu.com/s/physics-lab",
    links: [],
    reviewTitle: "물리 게임 실험실 — Claude 4종 비교",
    reviewUrl:
      "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
    publishedAt: "2026-07-06",
    issueNo: "5호",
    featured: true,
  },
  {
    id: "ai-lab",
    slug: "ai-lab",
    name: "AI 모델 실험실",
    tagline:
      "같은 프롬프트 하나로 Claude·Qwen·Gemma·Llama·Mistral 등 7개 AI 모델에게 테트리스·2048·스트리트 파이터·길건너 친구들을 만들게 시키고, 직접 다 돌려본 결과를 비교했습니다. 누가 진짜 '작동하는' 게임을 만들까?",
    description:
      "7개 모델 × 4개 게임 빌드 벤치마크. 모델마다 만든 결과물을 그대로 실행해보고 정상 작동 / 작동 이상 / 생성 실패로 직접 판정했습니다.",
    category: "AI / 벤치마크",
    pricing: "오픈",
    websiteUrl: "https://seungsu.com/lab",
    buttons: [
      { kind: "website", label: "실험실 열기 — 7개 모델 결과물 비교·플레이", url: "/lab", enabled: true },
    ],
    links: [],
    reviewTitle: "AI 모델 실험실 — 같은 미션, 다른 모델",
    reviewUrl:
      "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
    publishedAt: "2026-06-28",
    issueNo: "4호",
    featured: true,
  },
  {
    id: "prism-insight",
    slug: "prism-insight",
    name: "PRISM-INSIGHT",
    tagline:
      "8개월째 실제 돈으로 매매하는 13개 멀티에이전트 주식 AI. 코드·매매내역·월 운영비까지 전부 공개한 오픈소스.",
    description:
      "카카오 백엔드 개발자가 혼자 만든 멀티에이전트 트레이딩 시스템. 매크로·분석·전략·트레이딩·상담까지 13개+ 에이전트가 팀으로 일하고, MCP로 도구를 묶고, 매매일지를 주기적으로 압축해 기억으로 주입하는 self-improving 루프가 핵심.",
    category: "AI 에이전트 / 핀테크",
    pricing: "오픈소스",
    websiteUrl: "https://analysis.stocksimulation.kr/",
    githubUrl: "https://github.com/dragon1086/prism-insight",
    githubRepo: "dragon1086/prism-insight",
    links: [
      { label: "메이커 LinkedIn (문상록)", url: "https://www.linkedin.com/in/sangrok-mun/" },
    ],
    reviewTitle: "8개월째 돈을 굴리는 13-에이전트 AI — PRISM-INSIGHT 엔지니어링 리뷰",
    reviewUrl:
      "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/",
    publishedAt: "2026-06-15",
    issueNo: "3호",
    featured: true,
  },
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
    links: [],
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
    links: [],
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
