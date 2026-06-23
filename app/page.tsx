import Link from "next/link";
import { getStore } from "@/lib/store";
import { listPublishedPosts } from "@/lib/blog";
import { NEWSLETTER } from "@/data/seed";
import SaasCard from "./components/SaasCard";
import PageViewTracker from "./components/PageViewTracker";
import SiteHeader from "./components/SiteHeader";

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
      <PageViewTracker type="page_view" />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />

      <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-14">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
            {NEWSLETTER.cadence} · by {NEWSLETTER.author}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">실전 SaaS 처방전</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-300">
            안녕하세요, 삼성전자에서 폐쇄망 LLM·GPU 인프라를 만드는 AI 인프라 엔지니어{" "}
            <Link href="/about" className="text-accent hover:underline">
              김성수
            </Link>
            입니다. LinkedIn에 AI·인프라 이야기를 쓰며{" "}
            <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              팔로워 5,000+
            </a>
            를 모았고, 영어 학원{" "}
            <Link href="/english" className="text-accent hover:underline">
              리아영어
            </Link>
를 직접 운영합니다. 여기선{" "}
            <Link href="/blog" className="text-accent hover:underline">
              블로그
            </Link>
            ·리아영어와{" "}
            <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              SaaS 리뷰 뉴스레터
            </a>
            를 한곳에 모읍니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/85">
              뉴스레터 구독
            </a>
            <Link href="/about" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-accent/50">
              소개
            </Link>
            <a href={NEWSLETTER.linkedinProfile} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-accent/50">
              LinkedIn
            </a>
          </div>
        </header>

        {/* 블로그 최신 */}
        {mainPosts.length > 0 && (
          <section className="mt-14">
            <SectionHead title="✍ 블로그" href="/blog" />
            <div className="space-y-2.5">
              {mainPosts.slice(0, 3).map((p) => (
                <PostRow key={p.id} href={`/blog/${p.slug}`} title={p.title} date={p.created_at} excerpt={p.excerpt} />
              ))}
            </div>
          </section>
        )}

        {/* 리아영어 최신 */}
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

        {/* 리뷰한 SaaS */}
        <section className="mt-12">
          <SectionHead title="🧾 리뷰한 SaaS" href="/blog" />
          <div className="space-y-2.5">
            {saasList.map((saas) => (
              <SaasCard key={saas.id} saas={saas} />
            ))}
          </div>
        </section>

        {/* Footer */}
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
          <p className="mt-4 text-xs">seungsu.com · by {NEWSLETTER.author}</p>
        </footer>
      </div>
    </main>
  );
}
