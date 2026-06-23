import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import SaasCard from "./components/SaasCard";
import PageViewTracker from "./components/PageViewTracker";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const saasList = await getStore().listSaas();

  return (
    <main className="relative">
      <PageViewTracker type="page_view" />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[260px]" />

      <div className="relative mx-auto max-w-xl px-5 pb-20 pt-16">
        {/* 제목 + 소개 */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-white">실전 SaaS 처방전</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-300">
            안녕하세요, <span className="font-semibold text-white">{NEWSLETTER.author}</span>입니다.
            <br />
            {NEWSLETTER.bio}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={NEWSLETTER.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white"
            >
              in · LinkedIn 연결
            </a>
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white"
            >
              ✉ 뉴스레터 구독
            </a>
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-zinc-200 transition hover:border-accent/50 hover:text-white"
            >
              ✍ 블로그
            </a>
          </div>
        </header>

        {/* SaaS 목록 */}
        <section className="mt-9">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            리뷰한 SaaS
          </p>
          <div className="space-y-2.5">
            {saasList.map((saas) => (
              <SaasCard key={saas.id} saas={saas} />
            ))}
          </div>
        </section>

        {/* 하단: 대시보드 · 문의 */}
        <footer className="mt-14 border-t border-border pt-6 text-center text-xs text-muted">
          <p>
            리뷰 문의는{" "}
            <a href={`mailto:${NEWSLETTER.contactEmail}`} className="text-accent hover:underline">
              {NEWSLETTER.contactEmail}
            </a>{" "}
            메일 또는{" "}
            <a
              href={NEWSLETTER.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              LinkedIn DM
            </a>
            으로 주세요.
          </p>
          <p className="mt-3">
            <a href="/dashboard" className="hover:text-white">
              📊 유입 대시보드
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
