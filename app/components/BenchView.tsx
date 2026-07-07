"use client";

import { useState } from "react";
import LineChart from "./LineChart";
import { BENCH } from "@/data/bench";

// Anthropic 직통 vs AWS Bedrock — Claude 3종 레이턴시 벤치마크 뷰
// 시계열 차트는 LineChart(캡처 버튼 내장) 재사용, 축 눈금(y 5개·x 전체 시간)을 보이게 설정.

const METRICS = {
  ttft: { label: "⚡ TTFT — 첫 토큰까지 (낮을수록 좋음)", unit: "s", yFmt: (v: number) => `${v.toFixed(2)}s` },
  tps: { label: "🚀 생성속도 tok/s (높을수록 좋음)", unit: "tok/s", yFmt: (v: number) => `${Math.round(v)}` },
} as const;
type MetricKey = keyof typeof METRICS;

const EP_DOT: Record<string, string> = {
  Anthropic직통: "#5b8cff",
  "Bedrock-미국": "#f59e0b",
  "Bedrock-도쿄": "#34d399",
};

function fmtS(v: number) {
  return `${v.toFixed(2)}s`;
}

export default function BenchView() {
  const [metric, setMetric] = useState<MetricKey>("ttft");
  const m = METRICS[metric];

  return (
    <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-white">⚡ Claude API 레이턴시 벤치마크</h1>
        <p className="mt-1.5 text-sm text-muted">
          같은 모델이라도 어디로 호출하느냐에 따라 속도가 다르다. 한국(내 PC)에서 Anthropic 직통 vs AWS
          Bedrock(미국·도쿄)으로 Haiku·Sonnet·Opus를 매시간 호출해 스트리밍 첫 토큰까지 시간(TTFT)과
          생성속도를 측정했습니다.
        </p>
        <p className="mt-2 text-xs text-muted">
          {BENCH.periodStart} ~ {BENCH.updated} · 누적 {BENCH.totalSamples}샘플 (매시간 워밍업 1 + 샘플 3) ·
          값은 시간대별 중앙값
        </p>
      </header>

      {/* 요약 표 — 전체 기간 중앙값 */}
      <h2 className="mb-2 text-sm font-semibold text-white">📋 전체 기간 요약 (중앙값)</h2>
      <div className="mb-2 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3.5 py-2.5 font-medium">모델</th>
              {["Anthropic직통", "Bedrock-미국", "Bedrock-도쿄"].map((ep) => (
                <th key={ep} className="whitespace-nowrap px-3 py-2.5 font-medium">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: EP_DOT[ep] }} />
                  {ep}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BENCH.summary.map((row) => {
              const best = Math.min(...row.endpoints.filter(Boolean).map((e) => e!.ttft));
              return (
                <tr key={row.model} className="border-b border-border/60 last:border-0">
                  <td className="whitespace-nowrap px-3.5 py-2.5 font-medium text-white">{row.name}</td>
                  {row.endpoints.map((e, i) =>
                    e ? (
                      <td key={i} className="whitespace-nowrap px-3 py-2.5">
                        <span className={e.ttft === best ? "font-semibold text-emerald-400" : "text-zinc-200"}>
                          {fmtS(e.ttft)}
                        </span>
                        <span className="ml-1.5 text-[11px] text-muted">
                          {Math.round(e.tps)} tok/s · n={e.n}
                        </span>
                      </td>
                    ) : (
                      <td key={i} className="px-3 py-2.5 text-muted">
                        —
                      </td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mb-7 text-[11px] text-muted">
        각 칸 = TTFT 중앙값 (초록 = 그 모델의 최속 엔드포인트) · 뒤 숫자 = 생성속도 중앙값과 샘플수
      </p>

      {/* 지표 토글 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(Object.keys(METRICS) as MetricKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setMetric(k)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${
              metric === k ? "bg-accent font-semibold text-white" : "border border-border text-muted hover:text-white"
            }`}
          >
            {METRICS[k].label}
          </button>
        ))}
      </div>

      {/* 모델별 시간대 시계열 (축 눈금 표시 + 📋 캡처 버튼) */}
      <div className="space-y-5">
        {BENCH.summary.map((row) => {
          const s = BENCH.series[row.model]?.[metric] ?? [];
          const series = s.map((sr) => ({
            label: sr.label,
            color: sr.color,
            points: sr.points.map((y, i) => ({ x: BENCH.hours[i], y: y ?? 0 })),
          }));
          return (
            <div key={row.model} className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-1 text-sm font-semibold text-white">
                {row.name} — 시간대별 {metric === "ttft" ? "TTFT (첫 토큰까지)" : "생성속도 (tok/s)"}
              </h3>
              <LineChart
                days={BENCH.hours}
                series={series}
                height={210}
                baseline={metric === "tps" ? "min" : "zero"}
                yFmt={m.yFmt}
                yTicks={5}
                xMaxTicks={16}
                tickFmt={(s) => s}
              />
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted">
        각 차트의 📋 캡처 버튼을 누르면 축·범례가 포함된 이미지가 클립보드에 복사됩니다. 마우스를 올리면
        시간대별 정확한 값이 보이고, 드래그하면 구간을 확대할 수 있어요.
      </p>
    </div>
  );
}
