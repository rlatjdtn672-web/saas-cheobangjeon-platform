"use client";

import LineChart, { Series } from "./LineChart";
import WorldMap from "./WorldMap";
import { lastNDays, fmtNum } from "@/lib/browser";

type Detail = {
  slug: string;
  title: string | null;
  target_url: string;
  hits: number;
  byDay: { day: string; hits: number }[];
  bySource: { source: string; hits: number }[];
  geo: { label: string; country: string | null; city: string | null; lat: number; lon: number; hits: number }[];
  byCountry: { country: string; hits: number }[];
  recent: { source: string; city: string | null; country: string | null; at: string }[];
};

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "방금";
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  return `${Math.floor(s / 86400)}일 전`;
}

export default function LinkDetailView({ detail, origin }: { detail: Detail; origin: string }) {
  const days = lastNDays(14);
  const byDay: Record<string, number> = {};
  detail.byDay.forEach((r) => (byDay[r.day] = r.hits));
  const series: Series[] = [
    { label: "클릭", color: "#5b8cff", points: days.map((x) => ({ x, y: byDay[x] || 0 })) },
  ];
  const maxSrc = Math.max(1, ...detail.bySource.map((s) => s.hits));

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10">
      <a href="/links" className="text-[13px] text-muted hover:text-white">
        ← 단축 링크 목록
      </a>
      <h1 className="mt-2 text-2xl font-bold text-white">{detail.title || detail.slug}</h1>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px]">
        <code className="rounded bg-white/5 px-2 py-0.5 text-accent2">{origin}/l/{detail.slug}</code>
        <span className="text-muted">→</span>
        <a href={detail.target_url} target="_blank" rel="noopener noreferrer" className="truncate text-accent hover:underline">
          {detail.target_url}
        </a>
      </div>

      <div className="mt-7 space-y-12">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted">총 클릭(접속)</p>
            <p className="mt-2 text-3xl font-bold text-white">{fmtNum(detail.hits)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted">유입 출처 수</p>
            <p className="mt-2 text-3xl font-bold text-white">{detail.bySource.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-2 text-[15px] font-semibold text-white">📈 일자별 클릭 (최근 14일)</h3>
          <LineChart days={days} series={series} />
        </div>

        {/* 지도 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">🗺 접속 지역 (지도)</h2>
          <div className="rounded-2xl border border-border bg-card p-3">
            <WorldMap points={detail.geo || []} />
          </div>
        </div>

        {/* 국가 분포 */}
        {detail.byCountry && detail.byCountry.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">🌍 국가별</h2>
            <div className="rounded-2xl border border-border bg-card p-5">
              {(() => {
                const maxC = Math.max(1, ...detail.byCountry.map((c) => c.hits));
                return detail.byCountry.map((c) => (
                  <div key={c.country} className="mt-2.5 flex items-center gap-3 first:mt-0">
                    <span className="w-16 truncate text-sm text-zinc-200">{c.country}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <span className="block h-full rounded-full bg-accent2" style={{ width: `${(c.hits / maxC) * 100}%` }} />
                    </span>
                    <span className="w-12 text-right text-sm text-white">{fmtNum(c.hits)}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">📥 유입 출처</h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            {detail.bySource.length === 0 && <p className="text-sm text-muted">아직 없음</p>}
            {detail.bySource.map((s) => (
              <div key={s.source} className="mt-2.5 flex items-center gap-3 first:mt-0">
                <span className="w-28 truncate text-sm text-zinc-200">{s.source}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(s.hits / maxSrc) * 100}%` }} />
                </span>
                <span className="w-12 text-right text-sm text-white">{fmtNum(s.hits)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">⚡ 최근 접속</h2>
          <div className="rounded-2xl border border-border bg-card px-5 py-2">
            {detail.recent.length === 0 && <p className="py-2 text-sm text-muted">아직 없음</p>}
            <div className="divide-y divide-border">
              {detail.recent.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="flex-1 truncate text-zinc-200">{r.source}</span>
                  <span className="hidden text-[11px] text-muted sm:block">
                    {[r.city, r.country].filter(Boolean).join(" · ") || "위치 미상"}
                  </span>
                  <span className="w-16 text-right text-[11px] text-muted">{ago(r.at)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
