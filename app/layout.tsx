import type { Metadata } from "next";
import "./globals.css";
import { NEWSLETTER } from "@/data/seed";
import { SITE_URL, GOOGLE_SITE_VERIFICATION, NAVER_SITE_VERIFICATION } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "실전 SaaS 처방전 — 인디 SaaS 리뷰",
    template: "%s",
  },
  description: NEWSLETTER.tagline,
  keywords: ["SaaS", "SaaS 리뷰", "실전 SaaS 처방전", "김성수", "n8n", "PRISM-INSIGHT", "TradingAgents"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "실전 SaaS 처방전",
    description: NEWSLETTER.tagline,
    type: "website",
    url: SITE_URL,
    siteName: "실전 SaaS 처방전",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "실전 SaaS 처방전",
    description: NEWSLETTER.tagline,
  },
  robots: { index: true, follow: true },
  verification: {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
    ...(NAVER_SITE_VERIFICATION
      ? { other: { "naver-site-verification": NAVER_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
