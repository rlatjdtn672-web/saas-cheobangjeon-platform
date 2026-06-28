import Link from "next/link";
import { getStore } from "@/lib/store";
import { listPublishedPosts } from "@/lib/blog";
import { NEWSLETTER } from "@/data/seed";
import SaasCard from "./components/SaasCard";
import SiteHeader from "./components/SiteHeader";
import AboutContent from "./components/AboutContent";
import VisitorCounter from "./components/VisitorCounter";

export const dynamic = "force-dynamic";

function PostRow({ href, title, date, excerpt }: { href: string; title: string; date: string; excerpt?: string | null }) {
  return (
    <Link href={href} className="block rounded-xl border border-border bg-card p-4 transition hover:border-accent/50">
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
        <span className="flex-none text-[11px] text-muted">{date?.slice(0, 10)}</span>
      </div>
      {excerpt && <p className="mt-1 truncate text-xs text-muted">{excerpt}</p>}
    </Link>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <Link href={href} className="text-xs text-muted transition hover:text-white">
        전체 보기 →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [saasList, mainPosts, liaPosts] = await Promise.all([
    getStore().listSaas(),
    listPublishedPosts("main"),
    listPublishedPosts("lia"),
  ]);

  return (
    <main className="relative">
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />

      {/* 자기소개 (About) */}
      <AboutContent />

      {/* 콘텐츠 허브 */}
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-4">
        {mainPosts.length > 0 && (
          <section className="mt-10">
            <SectionHead title="✍ 블로그" href="/blog" />
            <div className="space-y-2.5">
              {mainPosts.slice(0, 3).map((p) => (
                <PostRow key={p.id} href={`/blog/${p.slug}`} title={p.title} date={p.created_at} excerpt={p.excerpt} />
              ))}
            </div>
          </section>
        )}

        {liaPosts.length > 0 && (
          <section className="mt-12">
            <SectionHead title="🟢 리아영어" href="/english" />
            <div className="space-y-2.5">
              {liaPosts.slice(0, 3).map((p) => (
                <PostRow key={p.id} href={`/english/${p.slug}`} title={p.title} date={p.created_at} excerpt={p.excerpt} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <SectionHead title="🧾 리뷰한 SaaS" href="/saas" />
          <div className="space-y-2.5">
            {saasList.map((saas) => (
              <SaasCard key={saas.id} saas={saas} />
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted">
          <p>
            문의:{" "}
            <a href={`mailto:${NEWSLETTER.contactEmail}`} className="text-accent hover:underline">
              {NEWSLETTER.contactEmail}
            </a>{" "}
            또는{" "}
            <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              LinkedIn DM
            </a>
          </p>
          <div className="mt-4">
            <VisitorCounter />
          </div>
          <p className="mt-3 text-xs">seungsu.com · by {NEWSLETTER.author}</p>
        </footer>
      </div>
    </main>
  );
}
