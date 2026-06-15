"use client";

import { useRef, useState } from "react";

export type Series = { label: string; color: string; points: { x: string; y: number }[] };

// 의존성 없는 인터랙티브 SVG 라인차트 (호버 시 크로스헤어 + 툴팁)
export default function LineChart({
  days,
  series,
  height = 200,
  tickFmt,
}: {
  days: string[];
  series: Series[];
  height?: number;
  tickFmt?: (label: string) => string;
}) {
  const W = 680,
    Hh = height,
    pad = { l: 36, r: 12, t: 14, b: 24 };
  const iw = W - pad.l - pad.r,
    ih = Hh - pad.t - pad.b;
  const maxY = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.y)));
  const n = days.length;
  const xOf = (i: number) => pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const yOf = (v: number) => pad.t + ih - (v / maxY) * ih;
  const fmt = tickFmt ?? ((s: string) => (s.length > 5 ? s.slice(5) : s));

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W; // viewBox 좌표
    const i = Math.round(((px - pad.l) / iw) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  const hx = hover != null ? xOf(hover) : 0;
  const tipLeftPct = hover != null ? (hx / W) * 100 : 0;

  return (
    <div ref={wrapRef} className="relative">
      <div style={{ marginBottom: 8 }}>
        {series.map((s) => (
          <span
            key={s.label}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 14, fontSize: 12, color: "#8b949e" }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: "inline-block" }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${Hh}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        style={{ display: "block", touchAction: "none" }}
      >
        {[0, 0.5, 1].map((f, i) => {
          const v = Math.round(maxY * f);
          const y = yOf(v);
          return (
            <g key={i}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#1f2630" />
              <text x={pad.l - 6} y={y + 3} fill="#5b6573" fontSize="10" textAnchor="end">{v}</text>
            </g>
          );
        })}
        {days.map((d, i) => {
          if (n > 8 && i % Math.ceil(n / 6) !== 0 && i !== n - 1) return null;
          return (
            <text key={i} x={xOf(i)} y={Hh - 6} fill="#5b6573" fontSize="10" textAnchor="middle">{fmt(d)}</text>
          );
        })}
        {/* 크로스헤어 */}
        {hover != null && (
          <line x1={hx} y1={pad.t} x2={hx} y2={pad.t + ih} stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        )}
        {series.map((s) => (
          <g key={s.label}>
            {s.points.length > 1 && (
              <polyline points={s.points.map((p, i) => `${xOf(i)},${yOf(p.y)}`).join(" ")} fill="none" stroke={s.color} strokeWidth="2" />
            )}
            {s.points.map((p, i) => (
              <circle key={i} cx={xOf(i)} cy={yOf(p.y)} r={hover === i ? 4 : 2.5} fill={s.color} />
            ))}
          </g>
        ))}
      </svg>
      {hover != null && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: `${tipLeftPct}%`,
            transform: `translateX(${tipLeftPct > 60 ? "-100%" : tipLeftPct < 12 ? "0" : "-50%"})`,
            pointerEvents: "none",
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: 8,
            padding: "6px 9px",
            fontSize: 11,
            whiteSpace: "nowrap",
            zIndex: 10,
            boxShadow: "0 4px 14px rgba(0,0,0,.4)",
          }}
        >
          <div style={{ color: "#8b949e", marginBottom: 3 }}>{days[hover]}</div>
          {series.map((s) => (
            <div key={s.label} style={{ color: "#e6edf3", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
              {s.label}: <b>{s.points[hover]?.y ?? 0}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
