import Link from "next/link";
import { cookies } from "next/headers";
import { listPublishedPosts } from "@/lib/blog";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { SECTIONS, SectionKey } from "@/lib/sections";
import { NEWSLETTER } from "@/data/seed";
import SiteHeader from "./SiteHeader";

export default async function SectionBlog({ sectionKey }: { sectionKey: SectionKey }) {
  const sec = SECTIONS[sectionKey];
  const posts = await listPublishedPosts(sec.key);
  const pw = cookies().get(DASH_COOKIE)?.value;
  const canEdit = !!pw && checkPassword(pw);

  return (
    <main className="relative">
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[220px]" />
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{sec.title}</h1>
            <p className="mt-1 text-[13px] text-muted">
              {sec.desc} · {NEWSLETTER.author}
            </p>
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

        <section className="mt-8 space-y-3">
          {posts.length === 0 && <p className="text-sm text-muted">아직 발행된 글이 없습니다.</p>}
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`${sec.path}/${p.slug}`}
              className="block rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">{p.title}</h2>
                <span className="flex-none text-xs text-muted">{p.created_at?.slice(0, 10)}</span>
              </div>
              {p.excerpt && <p className="mt-1.5 text-sm text-muted">{p.excerpt}</p>}
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
