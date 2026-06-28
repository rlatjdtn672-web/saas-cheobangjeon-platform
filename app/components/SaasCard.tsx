import Link from "next/link";
import type { Saas } from "@/lib/types";

function Logo({ saas }: { saas: Saas }) {
  if (saas.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={saas.logoUrl}
        alt={saas.name}
        className="h-10 w-10 flex-none rounded-lg bg-white/5 object-contain p-1"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-accent/15 text-base font-bold text-accent">
      {saas.name.slice(0, 1).toUpperCase()}
    </div>
  );
}

// 메인 목록: SaaS 한 줄 행 (전체 클릭 시 상세 연결창구로)
export default function SaasCard({ saas }: { saas: Saas }) {
  return (
    <Link
      href={`/s/${saas.slug}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition hover:border-accent/50"
    >
      <Logo saas={saas} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-semibold text-white">{saas.name}</h3>
          {saas.issueNo && <span className="flex-none text-[11px] text-muted">{saas.issueNo}</span>}
        </div>
        <p className="mt-0.5 truncate text-[13px] text-muted">{saas.tagline}</p>
      </div>
      <span className="flex-none text-muted">→</span>
    </Link>
  );
}
