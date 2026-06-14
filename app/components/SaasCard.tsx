import Link from "next/link";
import type { Saas } from "@/lib/types";
import CopyLinkButton from "./CopyLinkButton";

function Logo({ saas }: { saas: Saas }) {
  if (saas.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={saas.logoUrl}
        alt={saas.name}
        className="h-9 w-9 rounded-lg bg-white/5 object-contain p-1"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-base font-bold text-accent">
      {saas.name.slice(0, 1).toUpperCase()}
    </div>
  );
}

// 공개 홈: 미니 연결 카드 (한 줄 + 상세로 이동 + 링크 복사)
export default function SaasCard({ saas }: { saas: Saas }) {
  const detail = `/s/${saas.slug}`;
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50">
      <Link href={detail} className="flex items-center gap-3">
        <Logo saas={saas} />
        <div>
          <h3 className="text-base font-semibold text-white">{saas.name}</h3>
          {saas.issueNo && <p className="text-xs text-muted">{saas.issueNo}</p>}
        </div>
      </Link>
      <Link href={detail} className="mt-3 block text-sm leading-relaxed text-zinc-300">
        {saas.tagline}
      </Link>
      <div className="mt-4 flex gap-2">
        <Link
          href={detail}
          className="flex-1 rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-accent/85"
        >
          열기 →
        </Link>
        <CopyLinkButton
          path={`/s/${saas.slug}?ref=linkedin`}
          label="링크 복사"
          className="rounded-lg border border-dashed border-border px-3 py-2 text-[13px] font-medium text-muted transition hover:border-accent/50 hover:text-white"
        />
      </div>
    </article>
  );
}
