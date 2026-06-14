import { getStore } from "@/lib/store";
import { NEWSLETTER, INTRO_POST } from "@/data/seed";
import SaasCard from "./components/SaasCard";
import PageViewTracker from "./components/PageViewTracker";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export default async function HomePage() {
  const store = getStore();
  const [saasList, stats, impact] = await Promise.all([
    store.listSaas(),
    store.statsBySaas(),
    store.impact(),
  ]);

  return (
    <main className="relative">
      <PageViewTracker />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-14">
        {/* ── Hero ── */}
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

        {/* ── 임팩트 지표 ── */}
        <section className="mt-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">📊 뉴스레터 임팩트</h2>
            <span className="text-xs text-muted">
              {store.mode === "supabase" ? "실시간 집계" : "로컬 미리보기 (메모리)"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="리뷰한 SaaS" value={impact.totalReviews} hint="누적 처방 건수" />
            <StatCard
              label="SaaS로 보낸 유입"
              value={impact.totalWebsiteClicks}
              hint="뉴스레터가 만든 방문 클릭"
            />
            <StatCard
              label="리뷰 글 클릭"
              value={impact.totalReviewClicks}
              hint="원문 리뷰로 이동"
            />
            <StatCard
              label="대시보드 방문"
              value={impact.totalPageViews}
              hint="플랫폼 페이지뷰"
            />
          </div>

          {impact.topSaas.some((t) => t.clicks > 0) && (
            <div className="mt-4 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs text-muted">유입을 가장 많이 만든 SaaS</p>
              <div className="mt-3 space-y-2">
                {impact.topSaas
                  .filter((t) => t.clicks > 0)
                  .map((t, i) => (
                    <div key={t.saas.id} className="flex items-center gap-3">
                      <span className="w-5 text-sm text-muted">{i + 1}</span>
                      <span className="flex-1 text-sm text-zinc-200">
                        {t.saas.name}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{
                            width: `${Math.min(
                              100,
                              (t.clicks / impact.topSaas[0].clicks) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-white">
                        {t.clicks}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>

        {/* ── 리뷰한 SaaS 그리드 ── */}
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

        {/* ── 발행 타임라인 ── */}
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
              <a
                key={saas.id}
                href={`/go?type=review&id=${saas.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-4 transition last:rounded-b-2xl hover:bg-white/[0.03]"
              >
                <span className="text-sm text-zinc-200">
                  {saas.issueNo ? `${saas.issueNo}. ` : ""}
                  {saas.reviewTitle}
                </span>
                <span className="text-xs text-muted">{saas.publishedAt}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-20 border-t border-border pt-8 text-center text-xs text-muted">
          <p>
            실전 SaaS 처방전 · by {NEWSLETTER.author} · 인디 SaaS부터 시작하는 SaaS
            광고 플랫폼
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
