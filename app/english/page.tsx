import type { Metadata } from "next";
import SectionBlog from "@/app/components/SectionBlog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "리아영어 — seungsu.com",
  description: "영어 학습 기록 · 리아영어",
  alternates: { canonical: "/english" },
};

export default function EnglishList() {
  return <SectionBlog sectionKey="lia" />;
}
