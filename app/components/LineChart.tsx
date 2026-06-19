"use client";

import { useRef, useState } from "react";

export type Series = { label: string; color: string; points: { x: string; y: number }[] };

// 인터랙티브 SVG 라인차트:
//  - 호버: 크로스헤어 + 툴팁
//  - 드래그: 범위 선택(줌). 되돌리기 버튼으로 초기화
//  - 캡처: 차트를 PNG로 클립보드 복사
export default function LineChart({
  days,
  series,
  height = 200,
  tickFmt,
  baseline = "zero",
}: {
  days: string[];
  series: Series[];
  height?: number;
  tickFmt?: (label: string) => string;
  baseline?: "zero" | "min";
}) {
  const W = 680,
    Hh = height,
    pad = { l: 44, r: 12, t: 30, b: 24 }; // t 여유: 범례를 SVG 안에
  const iw = W - pad.l - pad.r,
    ih = Hh - pad.t - pad.b;

  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [range, setRange] = useState<{ s: number; e: number } | null>(null);
  const [drag, setDrag] = useState<{ s: number; e: number } | null>(null);
  const [captured, setCaptured] = useState(false);

  // 현재 보이는 구간(줌 반영)
  const base = range ? range.s : 0;
  const vDays = range ? days.slice(range.s, range.e + 1) : days;
  const vSeries: Series[] = range
    ? series.map((sr) => ({ ...sr, points: sr.points.slice(range.s, range.e + 1) }))
    : series;

  const n = vDays.length;
  const allY = vSeries.flatMap((s) => s.points.map((p) => p.y));
  const dataMax = Math.max(1, ...allY);
  const dataMin = Math.min(...(allY.length ? allY : [0]));
  const lo = baseline === "min" ? Math.max(0, dataMin - Math.ceil((dataMax - dataMin) * 0.15) - 1) : 0;
  const hi = Math.max(lo + 1, dataMax);
  const xOf = (i: number) => pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const yOf = (v: number) => pad.t + ih - ((v - lo) / (hi - lo)) * ih;
  const fmt = tickFmt ?? ((s: string) => (s.length > 5 ? s.slice(5) : s));

  function idxFromEvent(e: React.MouseEvent<SVGSVGElement>) {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / iw) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  }

  function onDown(e: React.MouseEvent<SVGSVGElement>) {
    if (n < 3) return;
    const i = idxFromEvent(e);
    setDrag({ s: i, e: i });
    setHover(null);
  }
  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const i = idxFromEvent(e);
    if (drag) setDrag({ ...drag, e: i });
    else setHover(i);
  }
  function onUp() {
    if (drag) {
      const a = Math.min(drag.s, drag.e);
      const b = Math.max(drag.s, drag.e);
      if (b - a >= 1) setRange({ s: base + a, e: base + b });
      setDrag(null);
    }
  }

  async function capture() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", String(W));
    clone.setAttribute("height", String(Hh));
    const xml = new XMLSerializer().serializeToString(clone);
    const url = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale;
      canvas.height = Hh * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCaptured(true);
          setTimeout(() => setCaptured(false), 1600);
        } catch {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "chart.png";
          a.click();
          URL.revokeObjectURL(a.href);
        }
      }, "image/png");
    };
    img.src = url;
  }

  const hx = hover != null ? xOf(hover) : 0;
  const tipLeftPct = hover != null ? (hx / W) * 100 : 0;

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-end gap-2">
        {range && (
          <button
            onClick={() => setRange(null)}
            className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted transition hover:text-white"
          >
            ↺ 전체보기
          </button>
        )}
        <button
          onClick={capture}
          className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted transition hover:text-white"
          title="차트를 이미지로 클립보드에 복사"
        >
          {captured ? "✓ 복사됨" : "📋 캡처"}
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${Hh}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={() => {
          setHover(null);
          setDrag(null);
        }}
        style={{ display: "block", touchAction: "none", cursor: n >= 3 ? "crosshair" : "default" }}
      >
        <rect x="0" y="0" width={W} height={Hh} fill="#0d1117" />
        {/* 범례 (SVG 내부 → 캡처에 포함) */}
        {vSeries.map((s, i) => (
          <g key={s.label} transform={`translate(${pad.l + i * 130}, 16)`}>
            <rect x="0" y="-8" width="10" height="10" rx="2" fill={s.color} />
            <text x="15" y="1" fill="#8b949e" fontSize="11">
              {s.label}
            </text>
          </g>
        ))}
        {/* 가로 그리드 */}
        {[0, 0.5, 1].map((f, i) => {
          const v = Math.round(lo + (hi - lo) * f);
          const y = yOf(v);
          return (
            <g key={i}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#1f2630" />
              <text x={pad.l - 6} y={y + 3} fill="#5b6573" fontSize="10" textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}
        {/* x 라벨 */}
        {vDays.map((d, i) => {
          if (n > 8 && i % Math.ceil(n / 6) !== 0 && i !== n - 1) return null;
          return (
            <text key={i} x={xOf(i)} y={Hh - 6} fill="#5b6573" fontSize="10" textAnchor="middle">
              {fmt(d)}
            </text>
          );
        })}
        {/* 드래그 선택 영역 */}
        {drag && (
          <rect
            x={xOf(Math.min(drag.s, drag.e))}
            y={pad.t}
            width={Math.abs(xOf(drag.e) - xOf(drag.s)) || 1}
            height={ih}
            fill="#5b8cff"
            fillOpacity="0.15"
            stroke="#5b8cff"
            strokeOpacity="0.5"
          />
        )}
        {/* 호버 크로스헤어 */}
        {hover != null && !drag && (
          <line x1={hx} y1={pad.t} x2={hx} y2={pad.t + ih} stroke="#5b8cff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        )}
        {/* 라인 + 점 */}
        {vSeries.map((s) => (
          <g key={s.label}>
            {s.points.length > 1 && (
              <polyline points={s.points.map((p, i) => `${xOf(i)},${yOf(p.y)}`).join(" ")} fill="none" stroke={s.color} strokeWidth="2" />
            )}
            {s.points.map((p, i) => (
              <circle key={i} cx={xOf(i)} cy={yOf(p.y)} r={hover === i && !drag ? 4 : 2.5} fill={s.color} />
            ))}
          </g>
        ))}
      </svg>

      {hover != null && !drag && (
        <div
          style={{
            position: "absolute",
            top: 40,
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
          <div style={{ color: "#8b949e", marginBottom: 3 }}>{vDays[hover]}</div>
          {vSeries.map((s) => (
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
