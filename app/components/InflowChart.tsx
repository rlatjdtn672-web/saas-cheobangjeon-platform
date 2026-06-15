"use client";

import { useState } from "react";
import LineChart, { Series } from "./LineChart";
import { lastNDays, fillHours, hourLabel } from "@/lib/browser";

type Daily = { day: string; source: string; visits: number };
type Hourly = { hour: string; source: string; visits: number };

export default function InflowChart({ daily, hourly }: { daily: Daily[]; hourly: Hourly[] }) {
  const [gran, setGran] = useState<"day" | "hour">("day");

  let labels: string[];
  let series: Series[];

  if (gran === "day") {
    const days = lastNDays(14);
    const tot: Record<string, number> = {};
    const li: Record<string, number> = {};
    daily.forEach((r) => {
      tot[r.day] = (tot[r.day] || 0) + r.visits;
      if (r.source === "linkedin") li[r.day] = (li[r.day] || 0) + r.visits;
    });
    labels = days;
    series = [
      { label: "전체 유입", color: "#5b8cff", points: days.map((x) => ({ x, y: tot[x] || 0 })) },
      { label: "LinkedIn", color: "#22c55e", points: days.map((x) => ({ x, y: li[x] || 0 })) },
    ];
  } else {
    const tot: Record<string, number> = {};
    const li: Record<string, number> = {};
    hourly.forEach((r) => {
      tot[r.hour] = (tot[r.hour] || 0) + r.visits;
      if (r.source === "linkedin") li[r.hour] = (li[r.hour] || 0) + r.visits;
    });
    const hours = fillHours(hourly.map((r) => r.hour));
    labels = hours.map(hourLabel);
    series = [
      { label: "전체 유입", color: "#5b8cff", points: hours.map((h) => ({ x: hourLabel(h), y: tot[h] || 0 })) },
      { label: "LinkedIn", color: "#22c55e", points: hours.map((h) => ({ x: hourLabel(h), y: li[h] || 0 })) },
    ];
  }

  return (
    <div>
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
  );
}
