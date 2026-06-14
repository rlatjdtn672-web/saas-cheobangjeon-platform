import type { Saas, SaasStats } from "@/lib/types";

function Logo({ saas }: { saas: Saas }) {
  if (saas.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={saas.logoUrl}
        alt={saas.name}
        className="h-10 w-10 rounded-lg bg-white/5 object-contain p-1"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-lg font-bold text-accent">
      {saas.name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function SaasCard({
  saas,
  stats,
}: {
  saas: Saas;
  stats?: SaasStats;
}) {
  const clicks = stats?.websiteClicks ?? 0;
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo saas={saas} />
          <div>
            <h3 className="text-base font-semibold text-white">{saas.name}</h3>
            <p className="text-xs text-muted">{saas.category}</p>
          </div>
        </div>
        {saas.issueNo && (
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
            {saas.issueNo}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-300">{saas.tagline}</p>
      <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">
        {saas.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
        <span className="rounded-md bg-white/5 px-2 py-1">{saas.pricing}</span>
        <span className="rounded-md bg-white/5 px-2 py-1">
          📈 유입 {clicks}
        </span>
      </div>

      {/* 리뷰 제목 */}
      <div className="mt-4 rounded-xl border border-border/70 bg-black/20 p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted">처방 리뷰</p>
        <p className="mt-1 text-[13px] font-medium text-zinc-200">
          {saas.reviewTitle}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={`/go?type=website&id=${saas.id}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-accent/85"
        >
          사이트 방문 →
        </a>
        <a
          href={`/go?type=review&id=${saas.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-zinc-200 transition hover:border-accent/50 hover:text-white"
        >
          리뷰 읽기
        </a>
      </div>
    </article>
  );
}
