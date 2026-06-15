"use client";

import LineChart, { Series } from "./LineChart";
import { lastNDays, fmtNum } from "@/lib/browser";
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

  const days = lastNDays(14);
  const byDay: Record<string, number> = {};
  m.byDay.forEach((r) => (byDay[r.day] = r.views));
  const series: Series[] = [
    { label: "유입(조회)", color: "#5b8cff", points: days.map((x) => ({ x, y: byDay[x] || 0 })) },
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

        {/* 일자별 유입 */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-white">📈 일자별 유입</h3>
            <span className="text-xs text-muted">최근 14일</span>
          </div>
          <LineChart days={days} series={series} />
        </div>

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
