import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { listPublishedPosts } from "@/lib/blog";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { NEWSLETTER } from "@/data/seed";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "블로그 — 실전 SaaS 처방전",
  description: "SaaS·AI·자동화에 대한 김성수의 글.",
  alternates: { canonical: "/blog" },
};

function fmtDate(iso: string) {
  return iso ? iso.slice(0, 10) : "";
}

export default async function BlogList() {
  const posts = await listPublishedPosts();
  const canEdit = (() => {
    const pw = cookies().get(DASH_COOKIE)?.value;
    return !!pw && checkPassword(pw);
  })();

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[240px]" />
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-16">
        <div className="flex items-end justify-between">
          <div>
            <Link href="/" className="text-[13px] text-muted hover:text-white">
              ← 홈
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">블로그</h1>
            <p className="mt-1 text-[13px] text-muted">SaaS · AI · 자동화 — {NEWSLETTER.author}의 글</p>
          </div>
          {canEdit && (
            <Link
              href="/blog/manage"
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:text-white"
            >
              ✏️ 글 관리
            </Link>
          )}
        </div>

        <section className="mt-9 space-y-3">
          {posts.length === 0 && <p className="text-sm text-muted">아직 발행된 글이 없습니다.</p>}
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="block rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">{p.title}</h2>
                <span className="flex-none text-xs text-muted">{fmtDate(p.created_at)}</span>
              </div>
              {p.excerpt && <p className="mt-1.5 text-sm text-muted">{p.excerpt}</p>}
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
