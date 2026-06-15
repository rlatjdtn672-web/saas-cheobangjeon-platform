"use client";

import { fmtNum } from "@/lib/browser";

// 시간대(0~23시) 분포 막대 히스토그램
export default function HourHistogram({
  data,
  unit = "명",
  color = "#5b8cff",
}: {
  data: { h: number; value: number }[];
  unit?: string;
  color?: string;
}) {
  const map: Record<number, number> = {};
  data.forEach((d) => (map[d.h] = d.value));
  const hours = Array.from({ length: 24 }, (_, h) => ({ h, v: map[h] || 0 }));
  const max = Math.max(1, ...hours.map((x) => x.v));
  const peak = hours.reduce((a, b) => (b.v > a.v ? b : a), hours[0]);

  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height: 120 }}>
        {hours.map(({ h, v }) => (
          <div key={h} className="group relative flex flex-1 flex-col items-center justify-end">
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${(v / max) * 100}%`,
                minHeight: v > 0 ? 3 : 0,
                background: h === peak.h && v > 0 ? "#22c55e" : color,
                opacity: v > 0 ? 1 : 0.25,
              }}
              title={`${h}시: ${fmtNum(v)}${unit}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted">
        <span>0시</span>
        <span>6시</span>
        <span>12시</span>
        <span>18시</span>
        <span>23시</span>
      </div>
      {peak.v > 0 && (
        <p className="mt-2 text-xs text-muted">
          가장 많이 유입되는 시간대: <span className="text-accent2">{peak.h}시</span> ({fmtNum(peak.v)}
          {unit})
        </p>
      )}
    </div>
  );
}
