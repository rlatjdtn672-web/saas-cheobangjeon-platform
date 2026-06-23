import type { Metadata } from "next";
import { getPublishedPost } from "@/lib/blog";
import SectionPost from "@/app/components/SectionPost";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPublishedPost(params.slug, "lia");
  if (!post) return { title: "리아영어 — seungsu.com" };
  const desc = post.excerpt || post.body?.slice(0, 120) || "";
  return {
    title: `${post.title} — 리아영어`,
    description: desc,
    alternates: { canonical: `/english/${post.slug}` },
    openGraph: { title: post.title, description: desc, type: "article" },
  };
}

export default function EnglishPostPage({ params }: { params: { slug: string } }) {
  return <SectionPost slug={params.slug} sectionKey="lia" />;
}
