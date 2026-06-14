import type { Metadata } from "next";
import "./globals.css";
import { NEWSLETTER } from "@/data/seed";

export const metadata: Metadata = {
  title: "실전 SaaS 처방전 — 인디 SaaS 리뷰 & 임팩트",
  description: NEWSLETTER.tagline,
  openGraph: {
    title: "실전 SaaS 처방전",
    description: NEWSLETTER.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
