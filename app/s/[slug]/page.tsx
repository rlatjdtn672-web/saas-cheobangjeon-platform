import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import PageViewTracker from "@/app/components/PageViewTracker";
import TrackedLink from "@/app/components/TrackedLink";
import CopyLinkButton from "@/app/components/CopyLinkButton";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "rlatjdtn672@gmail.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const saas = await getStore().getSaas(params.slug);
  if (!saas) return { title: "실전 SaaS 처방전" };
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
      className="h-12 w-12 flex-none rounded-2xl bg-white/5 object-contain p-1.5"
    />
  ) : (
    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-accent/15 text-xl font-bold text-accent">
      {saas.name.slice(0, 1).toUpperCase()}
    </div>
  );

  // 연결 버튼: GitHub / 뉴스레터 / 관련 Doc
  const btn =
    "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 text-sm font-medium text-white transition hover:border-accent/50";

  return (
    <main className="relative">
      <PageViewTracker type="saas_view" saasId={saas.id} />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[300px]" />

      <div className="relative mx-auto max-w-md px-5 pb-24 pt-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[13px] text-muted hover:text-white">
            ← 처방전 목록
          </Link>
          <CopyLinkButton
            path={`/s/${saas.slug}?ref=linkedin`}
            label="복사"
            className="rounded-md px-2 py-1 text-[11px] text-muted transition hover:text-white"
          />
        </div>

        <div className="mt-6 flex items-center gap-3.5">
          {logo}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">{saas.name}</h1>
            {saas.issueNo && <p className="text-xs text-muted">{saas.issueNo}</p>}
          </div>
        </div>

        {/* 한 줄 설명 */}
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-200">{saas.tagline}</p>

        {/* 연결 버튼: 사이트 / GitHub / 문서 / 뉴스레터 / 추가 링크 */}
        <div className="mt-7 space-y-2.5">
          {saas.websiteUrl && saas.websiteUrl !== saas.githubUrl && (
            <TrackedLink href={saas.websiteUrl} type="website_click" saasId={saas.id} target="사이트" className={btn}>
              <span>🌐 사이트 · 라이브</span>
              <span className="text-accent">↗</span>
            </TrackedLink>
          )}
          {saas.githubUrl && (
            <TrackedLink href={saas.githubUrl} type="github_click" saasId={saas.id} target="GitHub" className={btn}>
              <span>★ GitHub</span>
              <span className="text-accent">↗</span>
            </TrackedLink>
          )}
          {saas.docUrl && (
            <TrackedLink href={saas.docUrl} type="website_click" saasId={saas.id} target="Doc" className={btn}>
              <span>📄 관련 Doc</span>
              <span className="text-accent">↗</span>
            </TrackedLink>
          )}
          <TrackedLink href={saas.reviewUrl} type="review_click" saasId={saas.id} target="뉴스레터" className={btn}>
            <span>📰 뉴스레터 리뷰</span>
            <span className="text-accent">↗</span>
          </TrackedLink>
          {(saas.links ?? []).map((l) => (
            <TrackedLink
              key={l.url}
              href={l.url}
              type={/github\.com/.test(l.url) ? "github_click" : "website_click"}
              saasId={saas.id}
              target={l.label}
              className={btn}
            >
              <span>🔗 {l.label}</span>
              <span className="text-accent">↗</span>
            </TrackedLink>
          ))}
        </div>

        {/* 리뷰 문의 */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          <p>
            리뷰 문의는{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
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
        </footer>
      </div>
    </main>
  );
}
