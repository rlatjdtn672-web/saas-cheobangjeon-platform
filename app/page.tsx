import { getStore } from "@/lib/store";
import { NEWSLETTER, INTRO_POST } from "@/data/seed";
import SaasCard from "./components/SaasCard";
import PageViewTracker from "./components/PageViewTracker";
import Metrics from "./components/Metrics";
import TrackedLink from "./components/TrackedLink";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const store = getStore();
  const [saasList, stats] = await Promise.all([store.listSaas(), store.statsBySaas()]);
  const saasLite = saasList.map((s) => ({ id: s.id, name: s.name, slug: s.slug }));

  return (
    <main className="relative">
      <PageViewTracker type="page_view" />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-14">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
            {NEWSLETTER.cadence} · by {NEWSLETTER.author}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            실전 SaaS 처방전
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-300">
            {NEWSLETTER.tagline}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/85"
            >
              뉴스레터 구독하기
            </a>
            <a
              href="#reviews"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-accent/50"
            >
              리뷰 보기
            </a>
          </div>
        </header>

        {/* 임팩트 지표 + 차트 + 퍼널 + 스타 (클라이언트, 실시간) */}
        <section className="mt-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">📊 뉴스레터 임팩트</h2>
            <span className="text-xs text-muted">실시간 집계 (Supabase)</span>
          </div>
          <Metrics saas={saasLite} />
        </section>

        {/* SaaS 그리드 */}
        <section id="reviews" className="mt-16 scroll-mt-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            🧾 처방한 SaaS ({saasList.length})
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saasList.map((saas) => (
              <SaasCard key={saas.id} saas={saas} stats={stats[saas.id]} />
            ))}
          </div>
        </section>

        {/* 타임라인 */}
        <section className="mt-16">
          <h2 className="mb-4 text-lg font-semibold text-white">🗓 발행 타임라인</h2>
          <div className="rounded-2xl border border-border bg-card">
            <a
              href={INTRO_POST.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-border px-5 py-4 transition hover:bg-white/[0.03]"
            >
              <span className="text-sm text-zinc-200">{INTRO_POST.title}</span>
              <span className="text-xs text-muted">{INTRO_POST.publishedAt}</span>
            </a>
            {saasList.map((saas) => (
              <TrackedLink
                key={saas.id}
                href={saas.reviewUrl}
                type="review_click"
                saasId={saas.id}
                className="flex items-center justify-between px-5 py-4 transition last:rounded-b-2xl hover:bg-white/[0.03]"
              >
                <span className="text-sm text-zinc-200">
                  {saas.issueNo ? `${saas.issueNo}. ` : ""}
                  {saas.reviewTitle}
                </span>
                <span className="text-xs text-muted">{saas.publishedAt}</span>
              </TrackedLink>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-border pt-8 text-center text-xs text-muted">
          <p>
            실전 SaaS 처방전 · by {NEWSLETTER.author} · 인디 SaaS부터 시작하는 SaaS 광고 플랫폼
          </p>
          <p className="mt-2">
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              LinkedIn 뉴스레터 →
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
