import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import PageViewTracker from "@/app/components/PageViewTracker";
import TrackedLink from "@/app/components/TrackedLink";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import EditPanel from "@/app/components/EditPanel";
import SiteHeader from "@/app/components/SiteHeader";
import LabView from "@/app/components/LabView";
import { LAB_TASKS } from "@/data/lab";
import { PHYSICS_TASKS } from "@/data/physics";
import BenchView from "@/app/components/BenchView";

import type { Saas, SaasButton, ButtonKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "rlatjdtn672@gmail.com";

const KIND_ICON: Record<ButtonKind, string> = {
  website: "🌐",
  github: "★",
  doc: "📄",
  review: "📰",
  link: "🔗",
};
const trackType = (k: ButtonKind): "github_click" | "review_click" | "website_click" =>
  k === "github" ? "github_click" : k === "review" ? "review_click" : "website_click";

// buttons 가 없으면 기존 필드로 구성(폴백)
function deriveButtons(s: Saas): SaasButton[] {
  if (s.buttons && s.buttons.length) return s.buttons;
  const out: SaasButton[] = [];
  if (s.websiteUrl && s.websiteUrl !== s.githubUrl)
    out.push({ kind: "website", label: "사이트", url: s.websiteUrl, enabled: true });
  if (s.githubUrl) out.push({ kind: "github", label: "GitHub", url: s.githubUrl, enabled: true });
  if (s.docUrl) out.push({ kind: "doc", label: "관련 Doc", url: s.docUrl, enabled: true });
  if (s.reviewUrl)
    out.push({ kind: "review", label: "뉴스레터 리뷰", url: s.reviewUrl, enabled: true });
  (s.links ?? []).forEach((l) => out.push({ kind: "link", label: l.label, url: l.url, enabled: true }));
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const saas = await getStore().getSaas(params.slug);
  if (!saas) return { title: "seungsu.com" };
  return {
    title: `${saas.name} — seungsu.com`,
    description: saas.tagline,
    openGraph: { title: saas.name, description: saas.tagline, type: "article" },
  };
}

export default async function SaasDetail({ params }: { params: { slug: string } }) {
  // 실험실(4호)은 이 상세 URL(/s/ai-lab)에 실험실 페이지를 그대로 렌더 → 링크 진입 = 유입(saas_view) 집계
  if (params.slug === "ai-lab") {
    return (
      <main className="relative">
        <PageViewTracker type="saas_view" saasId="ai-lab" />
        <SiteHeader />
        <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />
        <LabView tasks={LAB_TASKS} />
      </main>
    );
  }

  // API 레이턴시 벤치마크(6호) — Anthropic 직통 vs Bedrock 시계열
  if (params.slug === "api-bench") {
    return (
      <main className="relative">
        <PageViewTracker type="saas_view" saasId="api-bench" />
        <SiteHeader />
        <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />
        <BenchView />
      </main>
    );
  }

  // 물리 게임 실험실(5호) — Claude 4종 비교, 동일 구조
  if (params.slug === "physics-lab") {
    return (
      <main className="relative">
        <PageViewTracker type="saas_view" saasId="physics-lab" />
        <SiteHeader />
        <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />
        <LabView
          tasks={PHYSICS_TASKS}
          title="🎯 물리 게임 실험실 — Claude 4종"
          desc="Fable·Opus·Sonnet·Haiku에게 동일한 프롬프트로 Matter.js 새총(앵그리버드식) 물리 게임을 만들게 시키고, 직접 다 플레이해본 결과를 비교합니다."
          note="▶ Play를 누르면 해당 모델이 만든 게임이 새 페이지에서 실행됩니다 (마우스 드래그로 새총 발사). Matter.js CDN을 쓰므로 인터넷 연결이 필요합니다. △·❌ 판정도 직접 눌러서 확인해볼 수 있습니다."
          showSummary={false}
          showScore={false}
          verdictIcons={{ broken: "△" }}
        />
      </main>
    );
  }

  const saas = await getStore().getSaas(params.slug);
  if (!saas) notFound();

  // 대시보드 로그인(쿠키 비번) 상태에서만 편집 버튼 노출
  const pw = cookies().get(DASH_COOKIE)?.value;
  const canEdit = !!pw && checkPassword(pw);

  const allButtons = deriveButtons(saas);
  const buttons = allButtons.filter((b) => b.enabled && b.url);

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
            ← 홈
          </Link>
          <div className="flex items-center gap-2">
            {canEdit && (
              <EditPanel
                sid={saas.slug}
                initial={{
                  tagline: saas.tagline ?? "",
                  githubRepo: saas.githubRepo ?? "",
                  buttons: allButtons,
                }}
              />
            )}
            <CopyLinkButton
              path={`/s/${saas.slug}?ref=linkedin`}
              label="복사"
              className="rounded-md px-2 py-1 text-[11px] text-muted transition hover:text-white"
            />
          </div>
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

        {/* 연결 버튼 (순서·활성 편집 가능) */}
        <div className="mt-7 space-y-2.5">
          {buttons.map((b, i) => (
            <TrackedLink
              key={`${b.kind}-${i}`}
              href={b.url}
              type={trackType(b.kind)}
              saasId={saas.id}
              target={b.label}
              className={btn}
            >
              <span>
                {KIND_ICON[b.kind] || "🔗"} {b.label}
              </span>
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
