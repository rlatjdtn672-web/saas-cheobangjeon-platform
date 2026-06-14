// 플랫폼 핵심 도메인 타입

export type Saas = {
  id: string;
  slug: string;
  name: string;
  tagline: string;        // 한 줄 요약
  description: string;     // 처방 설명 (왜 이걸 추천하는지)
  category: string;        // 예: 자동화, AI 에이전트, 분석
  pricing: string;         // 예: "무료 / $20~", "오픈소스"
  websiteUrl: string;      // SaaS 공식 사이트
  logoUrl?: string;        // 로고 (없으면 이니셜 표시)
  // 이 SaaS를 다룬 뉴스레터 리뷰
  reviewTitle: string;
  reviewUrl: string;
  publishedAt: string;     // ISO date
  issueNo?: string;        // 예: "1호"
  featured?: boolean;
};

export type EventType =
  | "page_view"      // 대시보드 방문
  | "saas_view"      // 특정 SaaS 카드 노출/조회
  | "website_click"  // SaaS 사이트로 나간 클릭 (뉴스레터가 만든 유입)
  | "review_click";  // 리뷰 글로 나간 클릭

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
