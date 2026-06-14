"use client";

export type Series = { label: string; color: string; points: { x: string; y: number }[] };

// 의존성 없는 미니 SVG 라인차트
export default function LineChart({
  days,
  series,
  height = 200,
}: {
  days: string[];
  series: Series[];
  height?: number;
}) {
  const W = 680,
    Hh = height,
    pad = { l: 36, r: 12, t: 14, b: 24 };
  const iw = W - pad.l - pad.r,
    ih = Hh - pad.t - pad.b;
  const maxY = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.y)));
  const xOf = (i: number) =>
    pad.l + (days.length <= 1 ? iw / 2 : (i / (days.length - 1)) * iw);
  const yOf = (v: number) => pad.t + ih - (v / maxY) * ih;

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        {series.map((s) => (
          <span
            key={s.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginRight: 14,
              fontSize: 12,
              color: "#8b949e",
            }}
          >
            <span
              style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: "inline-block" }}
            />
            {s.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${Hh}`} width="100%" preserveAspectRatio="xMidYMid meet">
        {[0, 0.5, 1].map((f, i) => {
          const v = Math.round(maxY * f);
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
        {days.map((d, i) => {
          if (days.length > 8 && i % Math.ceil(days.length / 6) !== 0 && i !== days.length - 1)
            return null;
          return (
            <text key={d} x={xOf(i)} y={Hh - 6} fill="#5b6573" fontSize="10" textAnchor="middle">
              {d.slice(5)}
            </text>
          );
        })}
        {series.map((s) => (
          <g key={s.label}>
            {s.points.length > 1 && (
              <polyline
                points={s.points.map((p, i) => `${xOf(i)},${yOf(p.y)}`).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
              />
            )}
            {s.points.map((p, i) => (
              <circle key={i} cx={xOf(i)} cy={yOf(p.y)} r="2.5" fill={s.color} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
