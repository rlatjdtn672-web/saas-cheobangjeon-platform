import type { Metadata } from "next";
import Link from "next/link";
import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import SiteHeader from "../components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "리뷰한 SaaS",
  description:
    "뉴스레터 '실전 SaaS 처방전'에서 다룬 인디 SaaS 모음. 각 서비스의 연결 창구와 트래픽 통계 대시보드를 함께 제공합니다.",
};

function Logo({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={name} className="h-10 w-10 flex-none rounded-lg bg-white/5 object-contain p-1" />;
  }
  return (
    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-accent/15 text-base font-bold text-accent">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export default async function SaasIndexPage() {
  const saasList = await getStore().listSaas();

  return (
    <main className="relative">
      <SiteHeader />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />

      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">🧾 리뷰한 SaaS</h1>
          <p className="mt-1.5 text-sm text-muted">
            뉴스레터{" "}
            <a href={NEWSLETTER.newsletterUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              실전 SaaS 처방전
            </a>
            에서 다룬 인디 SaaS. 각 서비스로 들어가면 연결 창구를, 📊 통계에서는 유입 대시보드를 볼 수 있어요.
          </p>
        </header>

        <div className="space-y-2.5">
          {saasList.map((saas) => (
            <div
              key={saas.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition hover:border-accent/50"
            >
              <Logo name={saas.name} logoUrl={saas.logoUrl} />
              <Link href={saas.slug === "ai-lab" ? "/lab" : `/s/${saas.slug}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-[15px] font-semibold text-white">{saas.name}</h3>
                  {saas.issueNo && <span className="flex-none text-[11px] text-muted">{saas.issueNo}</span>}
                </div>
                <p className="mt-0.5 truncate text-[13px] text-muted">{saas.tagline}</p>
              </Link>
              <Link
                href={`/dashboard/${saas.slug}`}
                className="flex-none rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-white"
              >
                📊 통계
              </Link>
            </div>
          ))}
        </div>

        {saasList.length === 0 && <p className="text-sm text-muted">아직 등록된 SaaS가 없습니다.</p>}
      </div>
    </main>
  );
}
