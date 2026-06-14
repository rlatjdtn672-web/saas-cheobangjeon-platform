import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import SaasCard from "./components/SaasCard";
import PageViewTracker from "./components/PageViewTracker";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "rlatjdtn672@gmail.com";

export default async function HomePage() {
  const saasList = await getStore().listSaas();

  return (
    <main className="relative">
      <PageViewTracker type="page_view" />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[360px]" />

      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-16">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
            {NEWSLETTER.cadence} · by {NEWSLETTER.author}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">실전 SaaS 처방전</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-300">
            뉴스레터가 다룬 SaaS의 연결 창구. 한 곳에서 GitHub·뉴스레터·문서로.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/85"
            >
              뉴스레터 구독
            </a>
            <a
              href="/dashboard"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-accent/50"
            >
              📊 유입 대시보드
            </a>
          </div>
        </header>

        {/* SaaS 디렉터리 */}
        <section className="mt-14">
          <div className="grid gap-4 sm:grid-cols-2">
            {saasList.map((saas) => (
              <SaasCard key={saas.id} saas={saas} />
            ))}
          </div>
        </section>

        {/* 리뷰 문의 + Footer */}
        <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted">
          <p className="text-zinc-300">리뷰 문의</p>
          <p className="mt-1.5">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            또는{" "}
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              LinkedIn DM
            </a>
          </p>
          <p className="mt-6 text-xs">실전 SaaS 처방전 · by {NEWSLETTER.author}</p>
        </footer>
      </div>
    </main>
  );
}
