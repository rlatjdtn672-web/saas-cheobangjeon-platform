"use client";

type Item = {
  type: string;
  target: string | null;
  name: string | null;
  source: string;
  at: string;
};

const LABEL: Record<string, { icon: string; text: string }> = {
  page_view: { icon: "🏠", text: "홈 방문" },
  saas_view: { icon: "👀", text: "상세 유입" },
  website_click: { icon: "🌐", text: "사이트 클릭" },
  github_click: { icon: "★", text: "GitHub 클릭" },
  review_click: { icon: "📰", text: "리뷰 클릭" },
};

function ago(iso: string): string {
  const t = new Date(iso).getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "방금";
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  return `${Math.floor(s / 86400)}일 전`;
}

export default function RecentFeed({ items }: { items: Item[] }) {
  if (!items || items.length === 0)
    return <p className="text-sm text-muted">아직 활동이 없습니다.</p>;
  return (
    <div className="divide-y divide-border">
      {items.map((it, i) => {
        const l = LABEL[it.type] || { icon: "•", text: it.type };
        return (
          <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="w-5 text-center">{l.icon}</span>
            <span className="flex-1 truncate text-zinc-200">
              {it.name ? <span className="text-white">{it.name}</span> : "홈"}
              <span className="text-muted"> · {it.target || l.text}</span>
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">{it.source}</span>
            <span className="w-16 text-right text-[11px] text-muted">{ago(it.at)}</span>
          </div>
        );
      })}
    </div>
  );
}
