import type { Metadata } from "next";
import SectionBlog from "@/app/components/SectionBlog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "블로그 — 실전 SaaS 처방전",
  description: "SaaS·AI·자동화에 대한 김성수의 글.",
  alternates: { canonical: "/blog" },
};

export default function BlogList() {
  return <SectionBlog sectionKey="main" />;
}
