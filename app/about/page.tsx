import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import AboutContent from "@/app/components/AboutContent";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "소개 — 김성수 (Sungsu Kim)",
  description:
    "삼성전자 AI 인프라 엔지니어. 폐쇄망(air-gapped) 환경의 LLM 플랫폼·GPU 인프라·RAG를 만듭니다. AI Infrastructure Engineer at Samsung Electronics.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="relative">
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[260px]" />
      <AboutContent />
    </main>
  );
}
