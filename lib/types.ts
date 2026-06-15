// 플랫폼 핵심 도메인 타입

export type SaasLink = { label: string; url: string };

export type ButtonKind = "website" | "github" | "doc" | "review" | "link";
export type SaasButton = {
  kind: ButtonKind;
  label: string;
  url: string;
  enabled: boolean;
};

export type Saas = {
  id: string;
  slug: string;
  name: string;
  tagline: string;        // 한 줄 요약
  description: string;     // 처방 설명 (왜 이걸 추천하는지)
  body?: string;           // 상세 본문 (상세 허브 페이지)
  category: string;        // 예: 자동화, AI 에이전트, 분석
  pricing: string;         // 예: "무료 / $20~", "오픈소스"
  websiteUrl: string;      // SaaS 공식 사이트
  githubUrl?: string;      // GitHub 레포 URL
  docUrl?: string;         // 관련 문서/Doc 링크
  githubRepo?: string;     // "owner/repo" (스타 추적용)
  logoUrl?: string;        // 로고 (없으면 이니셜 표시)
  links?: SaasLink[];      // (구) 관련 링크 모음
  buttons?: SaasButton[];  // 정렬/활성 가능한 연결 버튼 목록
  // 이 SaaS를 다룬 뉴스레터 리뷰
  reviewTitle: string;
  reviewUrl: string;
  publishedAt: string;     // ISO date
  issueNo?: string;        // 예: "1호"
  featured?: boolean;
};

export type EventType =
  | "page_view"      // 대시보드 방문
  | "saas_view"      // 특정 SaaS 상세 조회 (플랫폼 유입)
  | "website_click"  // SaaS 사이트로 나간 클릭
  | "review_click"   // 리뷰 글로 나간 클릭
  | "github_click";  // GitHub 레포로 나간 클릭

export type TrackEvent = {
  type: EventType;
  saasId?: string | null;
  referrer?: string | null;
  createdAt: string;
};

// 집계 지표
export type SaasStats = {
  saasId: string;
  websiteClicks: number;
  reviewClicks: number;
  views: number;
};

export type ImpactSummary = {
  totalReviews: number;
  totalWebsiteClicks: number;  // 뉴스레터가 SaaS로 보낸 총 유입
  totalReviewClicks: number;
  totalPageViews: number;
  topSaas: { saas: Saas; clicks: number }[];
};

export type PerSaas = {
  saasId: string;
  name: string;
  slug: string;
  views: number;
  clicks: number;
};

// 유입 대시보드(비공개)용 전체 데이터
export type DashboardData = {
  totalReviews: number;
  totalVisits: number;        // page_view + saas_view
  totalLinkedinVisits: number;
  totalGithubClicks: number;
  inflow: { day: string; source: string; visits: number }[];
  stars: { saasId: string; stars: number; capturedAt: string }[];
  saasStats: { saasId: string; views: number; githubClicks: number }[];
  perSaas: PerSaas[];
  inflowHourly: { hour: string; source: string; visits: number }[];
  inflowBySaas: { name: string; slug: string; day: string; views: number }[];
  hourOfDay: { h: number; visits: number }[];
  recent: { type: string; target: string | null; name: string | null; source: string; at: string }[];
};

// 단일 SaaS 상세 대시보드 데이터
export type SaasMetrics = {
  name: string;
  slug: string;
  views: number;
  clicks: number;
  byDay: { day: string; views: number }[];
  byHour: { hour: string; views: number }[];
  hourOfDay: { h: number; views: number }[];
  bySource: { source: string; views: number }[];
  byTarget: { target: string; clicks: number }[];
  stars: { stars: number; at: string }[];
};
