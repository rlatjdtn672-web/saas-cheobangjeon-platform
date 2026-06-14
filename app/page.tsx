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
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[240px]" />

      <div className="relative mx-auto max-w-xl px-5 pb-20 pt-16">
        {/* 제목 */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-white">실전 SaaS 처방전</h1>
          <p className="mt-1 text-[13px] text-muted">
            {NEWSLETTER.author}님이 리뷰한 SaaS 목록
          </p>
        </header>

        {/* SaaS 목록 */}
        <section className="mt-7 space-y-2.5">
          {saasList.map((saas) => (
            <SaasCard key={saas.id} saas={saas} />
          ))}
        </section>

        {/* 하단: 구독 · 대시보드 · 문의 */}
        <footer className="mt-14 border-t border-border pt-6 text-center text-xs text-muted">
          <div className="flex justify-center gap-4">
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              뉴스레터 구독
            </a>
            <span>·</span>
            <a href="/dashboard" className="hover:text-white">
              유입 대시보드
            </a>
            <span>·</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
              리뷰 문의
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
