import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import PageViewTracker from "@/app/components/PageViewTracker";
import TrackedLink from "@/app/components/TrackedLink";
import LiveStars from "@/app/components/LiveStars";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const saas = await getStore().getSaas(params.slug);
  if (!saas) return { title: "SaaS 처방 상세 — 실전 SaaS 처방전" };
  return {
    title: `${saas.name} — 실전 SaaS 처방전`,
    description: saas.tagline,
    openGraph: { title: saas.name, description: saas.tagline, type: "article" },
  };
}

export default async function SaasDetail({ params }: { params: { slug: string } }) {
  const saas = await getStore().getSaas(params.slug);
  if (!saas) notFound();

  const logo = saas.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={saas.logoUrl}
      alt={saas.name}
      className="h-14 w-14 flex-none rounded-2xl bg-white/5 object-contain p-1.5"
    />
  ) : (
    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-accent/15 text-2xl font-bold text-accent">
      {saas.name.slice(0, 1).toUpperCase()}
    </div>
  );

  return (
    <main className="relative">
      <PageViewTracker type="saas_view" saasId={saas.id} />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[360px]" />

      <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-10">
        <Link href="/" className="text-[13px] text-muted hover:text-white">
          ← 실전 SaaS 처방전 대시보드
        </Link>

        <div className="mt-6 flex items-center gap-4">
          {logo}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{saas.name}</h1>
            <p className="mt-0.5 text-[13px] text-muted">
              {saas.category}
              {saas.issueNo ? ` · ${saas.issueNo}` : ""}
            </p>
          </div>
        </div>

        <p className="mt-5 text-[17px] text-zinc-200">{saas.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-muted">{saas.pricing}</span>
          <LiveStars saasId={saas.id} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {saas.githubUrl && (
            <TrackedLink
              href={saas.githubUrl}
              type="github_click"
              saasId={saas.id}
              className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 text-sm font-semibold text-white"
            >
              ★ GitHub 레포
            </TrackedLink>
          )}
          {saas.websiteUrl && (
            <TrackedLink
              href={saas.websiteUrl}
              type="website_click"
              saasId={saas.id}
              rel="noopener noreferrer nofollow"
              className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white"
            >
              사이트 방문 →
            </TrackedLink>
          )}
        </div>

        {saas.body && (
          <p className="mt-7 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-300">
            {saas.body}
          </p>
        )}

        {saas.links && saas.links.length > 0 && (
          <div className="mt-9">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              관련 링크
            </h2>
            <div className="space-y-2.5">
              {saas.links.map((l) => (
                <TrackedLink
                  key={l.url}
                  href={l.url}
                  type={/github\.com/.test(l.url) ? "github_click" : "website_click"}
                  saasId={saas.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 transition hover:border-accent/50"
                >
                  <span className="text-sm text-zinc-200">{l.label}</span>
                  <span className="text-accent">↗</span>
                </TrackedLink>
              ))}
            </div>
          </div>
        )}

        <div className="mt-9">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            처방 리뷰 원문
          </h2>
          <TrackedLink
            href={saas.reviewUrl}
            type="review_click"
            saasId={saas.id}
            className="block rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50"
          >
            <p className="text-[11px] uppercase tracking-wide text-muted">뉴스레터</p>
            <p className="mt-1.5 text-base font-semibold text-white">{saas.reviewTitle}</p>
            <p className="mt-1 text-xs text-muted">
              {saas.publishedAt} 발행 · 클릭하면 LinkedIn 원문으로
            </p>
          </TrackedLink>
        </div>

        <footer className="mt-16 border-t border-border pt-7 text-center text-xs text-muted">
          <p>실전 SaaS 처방전 · by {NEWSLETTER.author}</p>
          <p className="mt-2">
            <a
              href={NEWSLETTER.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              LinkedIn 뉴스레터 구독 →
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
