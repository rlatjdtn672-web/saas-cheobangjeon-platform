"use client";

import { useState } from "react";
import LineChart, { Series } from "./LineChart";
import HourHistogram from "./HourHistogram";
import { lastNDays, fmtNum, fillHours, hourLabel } from "@/lib/browser";
import type { SaasMetrics } from "@/lib/types";

function Stat({ k, v, h }: { k: string; v: string | number; h?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-2 text-3xl font-bold text-white">{v}</p>
      {h && <p className="mt-1 text-[11px] text-muted">{h}</p>}
    </div>
  );
}

function Bars({
  rows,
  unit,
  color,
}: {
  rows: { label: string; value: number }[];
  unit: string;
  color: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (rows.length === 0) return <p className="text-sm text-muted">아직 기록이 없습니다.</p>;
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-28 truncate text-sm text-zinc-200" title={r.label}>
            {r.label}
          </span>
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <span
              className="block h-full rounded-full"
              style={{ width: `${(r.value / max) * 100}%`, background: color }}
            />
          </span>
          <span className="w-16 text-right text-sm text-white">
            {fmtNum(r.value)}
            <span className="text-[11px] text-muted"> {unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SaasDashboardView({ m }: { m: SaasMetrics }) {
  const conv = m.views ? Math.round((m.clicks / m.views) * 100) : 0;
  const [gran, setGran] = useState<"day" | "hour">("day");

  let labels: string[];
  let series: Series[];
  if (gran === "day") {
    const days = lastNDays(14);
    const byDay: Record<string, number> = {};
    m.byDay.forEach((r) => (byDay[r.day] = r.views));
    labels = days;
    series = [{ label: "유입(조회)", color: "#5b8cff", points: days.map((x) => ({ x, y: byDay[x] || 0 })) }];
  } else {
    const byHour: Record<string, number> = {};
    m.byHour.forEach((r) => (byHour[r.hour] = r.views));
    const hours = fillHours(m.byHour.map((r) => r.hour));
    labels = hours.map(hourLabel);
    series = [
      { label: "유입(조회)", color: "#5b8cff", points: hours.map((h) => ({ x: hourLabel(h), y: byHour[h] || 0 })) },
    ];
  }

  // GitHub 스타 추이 (KST 시각 라벨)
  const kstHour = (iso: string) => {
    const d = new Date(new Date(iso).getTime() + 9 * 3600000);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}시`;
  };
  const starPts = m.stars || [];
  const curStars = starPts.length ? starPts[starPts.length - 1].stars : null;
  const starDelta = starPts.length > 1 ? curStars! - starPts[0].stars : 0;
  const starSeries: Series[] = [
    {
      label: "GitHub ★",
      color: "#f5c842",
      points: starPts.map((p) => ({ x: kstHour(p.at), y: p.stars })),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
      <div className="flex items-center justify-between">
        <div>
          <a href="/dashboard" className="text-[13px] text-muted hover:text-white">
            ← 전체 대시보드
          </a>
          <h1 className="mt-2 text-2xl font-bold text-white">{m.name}</h1>
          <p className="text-xs text-muted">상세 유입·이동 대시보드</p>
        </div>
        <a
          href={`/s/${m.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:text-white"
        >
          공개 페이지 ↗
        </a>
      </div>

      <div className="mt-8 space-y-12">
        {/* 핵심 지표 */}
        <div className="grid grid-cols-3 gap-4">
          <Stat k="유입(조회)" v={fmtNum(m.views)} h="이 페이지 방문" />
          <Stat k="이동(클릭)" v={fmtNum(m.clicks)} h="외부 링크 클릭" />
          <Stat k="전환율" v={`${conv}%`} h="유입 → 클릭" />
        </div>

        {/* 유입 추이 (일별/시간별 토글) */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-white">📈 유입 추이</h3>
            <div className="flex gap-1 rounded-lg border border-border p-0.5 text-xs">
              {(["day", "hour"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGran(g)}
                  className={`rounded-md px-2.5 py-1 transition ${
                    gran === g ? "bg-accent text-white" : "text-muted hover:text-white"
                  }`}
                >
                  {g === "day" ? "일별 (14일)" : "시간별 (72h)"}
                </button>
              ))}
            </div>
          </div>
          <LineChart
            days={labels}
            series={series}
            tickFmt={gran === "hour" ? (s) => s.split(" ")[1] ?? s : undefined}
          />
        </div>

        {/* 시간대별 유입 */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-[15px] font-semibold text-white">🕐 시간대별 유입 (KST)</h3>
          <HourHistogram data={m.hourOfDay.map((x) => ({ h: x.h, value: x.views }))} />
        </div>

        {/* GitHub 스타 추이 */}
        {curStars != null && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-white">⭐ GitHub 스타 추이</h3>
              <span className="text-sm">
                <span className="font-bold text-white">{fmtNum(curStars)}</span>
                <span className="text-yellow-300"> ★</span>
                {starPts.length > 1 && (
                  <span className="ml-2 text-xs text-accent2">
                    {starDelta >= 0 ? "+" : ""}
                    {fmtNum(starDelta)} (기록 {starPts.length})
                  </span>
                )}
              </span>
            </div>
            {starPts.length >= 2 ? (
              <LineChart days={starSeries[0].points.map((p) => p.x)} series={starSeries} baseline="min" />
            ) : (
              <p className="text-sm text-muted">스냅샷이 2개 이상 쌓이면 추이 그래프가 그려집니다. (매시간 자동 기록)</p>
            )}
          </div>
        )}

        {/* 어디로 이동했나 (링크별 클릭) */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">🔗 어디로 이동했나 (링크별 클릭)</h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Bars
              rows={m.byTarget.map((t) => ({ label: t.target, value: t.clicks }))}
              unit="클릭"
              color="#22c55e"
            />
          </div>
        </div>

        {/* 어디서 왔나 (출처) */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">📥 어디서 왔나 (유입 출처)</h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Bars
              rows={m.bySource.map((s) => ({ label: s.source, value: s.views }))}
              unit="명"
              color="#5b8cff"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
