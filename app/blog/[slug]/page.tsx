import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getPublishedPost } from "@/lib/blog";
import { NEWSLETTER } from "@/data/seed";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPublishedPost(params.slug);
  if (!post) return { title: "블로그 — 실전 SaaS 처방전" };
  const desc = post.excerpt || post.body?.slice(0, 120) || "";
  return {
    title: `${post.title} — 실전 SaaS 처방전`,
    description: desc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: desc, type: "article" },
  };
}

const CONTACT_EMAIL = "rlatjdtn672@gmail.com";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPublishedPost(params.slug);
  if (!post) notFound();

  marked.setOptions({ breaks: true, gfm: true });
  const html = marked.parse(post.body || "") as string;

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[220px]" />
      <article className="relative mx-auto max-w-2xl px-5 pb-24 pt-12">
        <Link href="/blog" className="text-[13px] text-muted hover:text-white">
          ← 블로그
        </Link>
        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-xs text-muted">
          {post.created_at?.slice(0, 10)} · {NEWSLETTER.author}
        </p>
        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt="" className="mt-6 w-full rounded-2xl border border-border" />
        )}

        <div
          className="post-body mt-8 text-[15px] leading-relaxed text-zinc-200"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="mt-14 border-t border-border pt-6 text-center text-xs text-muted">
          <p>
            글 문의·제안:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            ·{" "}
            <a
              href={NEWSLETTER.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </footer>
      </article>
    </main>
  );
}
