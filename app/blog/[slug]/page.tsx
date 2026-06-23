import type { Metadata } from "next";
import { getPublishedPost } from "@/lib/blog";
import SectionPost from "@/app/components/SectionPost";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPublishedPost(params.slug, "main");
  if (!post) return { title: "블로그 — seungsu.com" };
  const desc = post.excerpt || post.body?.slice(0, 120) || "";
  return {
    title: `${post.title} — seungsu.com`,
    description: desc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: desc, type: "article" },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  return <SectionPost slug={params.slug} sectionKey="main" />;
}
