"use client";

import { useState } from "react";
import type { LabTask } from "@/data/lab";

const VENDOR_COLOR: Record<string, string> = {
  Anthropic: "text-orange-400 bg-orange-400/10",
  Google: "text-sky-400 bg-sky-400/10",
  Alibaba: "text-violet-400 bg-violet-400/10",
  Meta: "text-blue-400 bg-blue-400/10",
  Mistral: "text-rose-400 bg-rose-400/10",
};

type Verdict = "works" | "broken" | "fail";
const VERDICT: Record<Verdict, { icon: string; label: string; cls: string }> = {
  works: { icon: "✅", label: "정상 작동", cls: "text-emerald-400" },
  broken: { icon: "⚠️", label: "작동 이상", cls: "text-amber-400" },
  fail: { icon: "❌", label: "생성 실패", cls: "text-rose-400/80" },
};

function VendorBadge({ vendor }: { vendor: string }) {
  const c = VENDOR_COLOR[vendor] || "text-zinc-400 bg-white/5";
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${c}`}>{vendor || "—"}</span>;
}

// 전체 요약 매트릭스 (모델 × 과제) — 클릭하면 펼쳐짐
function SummaryMatrix({ tasks }: { tasks: LabTask[] }) {
  const [open, setOpen] = useState(false);
  const byModel: Record<string, { name: string; vendor: string; cells: Record<string, Verdict>; pts: number }> = {};
  tasks.forEach((t) =>
    t.models.forEach((m) => {
      const v = m.verdict as Verdict;
      if (!byModel[m.model]) byModel[m.model] = { name: m.name, vendor: m.vendor, cells: {}, pts: 0 };
      byModel[m.model].cells[t.key] = v;
      byModel[m.model].pts += v === "works" ? 2 : v === "broken" ? 1 : 0;
    })
  );
  const rows = Object.values(byModel).sort(
    (a, b) => b.pts - a.pts || (a.vendor === "Anthropic" ? -1 : b.vendor === "Anthropic" ? 1 : 0)
  );

  return (
    <div className="mb-7">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:border-accent/50"
      >
        <span className="text-sm font-semibold text-white">📋 전체 요약 — 모델 × 과제</span>
        <span className="text-xs text-muted">{open ? "접기 ▲" : "펼치기 ▼"}</span>
      </button>

      {open && (
        <>
          <div className="mt-2 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3.5 py-2.5 font-medium">모델</th>
                  {tasks.map((t) => (
                    <th key={t.key} className="whitespace-nowrap px-3 py-2.5 text-center font-medium">
                      {t.emoji} {t.title}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-right font-medium">종합</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-border/60 last:border-0">
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap font-medium text-white">{r.name}</span>
                        <VendorBadge vendor={r.vendor} />
                      </div>
                    </td>
                    {tasks.map((t) => {
                      const v = r.cells[t.key];
                      return (
                        <td key={t.key} className="px-3 py-2.5 text-center" title={v ? VERDICT[v].label : ""}>
                          {v ? VERDICT[v].icon : "—"}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-300">{r.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
            <span>✅ 정상 작동</span>
            <span>⚠️ 만들었으나 정상 동작 안 함</span>
            <span>❌ 생성 실패</span>
            <span className="text-zinc-500">· 종합 = 정상 2점 / 작동이상 1점 / 실패 0점</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function LabView({
  tasks,
  title = "🧪 AI 모델 실험실",
  desc = "같은 미션, 다른 모델. 클로드부터 로컬 오픈모델까지 — 동일한 프롬프트 하나로 게임을 만들게 시키고, 직접 다 돌려본 결과를 그대로 비교합니다.",
  note = "▶ Play를 누르면 해당 모델이 만든 결과물이 새 페이지에서 그대로 실행됩니다 (방향키/WASD로 조작). ⚠️ 표시는 결과물이 만들어졌지만 실제로는 제대로 동작하지 않은 경우로, 직접 눌러서 확인해볼 수 있습니다.",
}: {
  tasks: LabTask[];
  title?: string;
  desc?: string;
  note?: string;
}) {
  const [activeKey, setActiveKey] = useState(tasks[0]?.key);
  const [promptOpen, setPromptOpen] = useState(false);
  const task = tasks.find((t) => t.key === activeKey) || tasks[0];
  if (!task) return null;

  const counts = { works: 0, broken: 0, fail: 0 };
  task.models.forEach((m) => (counts[m.verdict as Verdict] += 1));

  return (
    <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1.5 text-sm text-muted">{desc}</p>
      </header>

      <SummaryMatrix tasks={tasks} />

      {/* 과제 탭 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tasks.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveKey(t.key);
              setPromptOpen(false);
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${
              t.key === task.key
                ? "bg-accent font-semibold text-white"
                : "border border-border text-muted hover:text-white"
            }`}
          >
            {t.emoji} {t.title}
          </button>
        ))}
      </div>

      {/* 과제 헤더 + 프롬프트 보기 */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">
          {task.emoji} {task.title}{" "}
          <span className="ml-1 text-sm font-normal text-muted">
            ✅ {counts.works} · ⚠️ {counts.broken} · ❌ {counts.fail}
          </span>
        </h2>
        <button
          onClick={() => setPromptOpen(true)}
          className="flex-none rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-white"
        >
          📝 프롬프트 보기
        </button>
      </div>

      {/* 리더보드 */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3.5 py-2.5 font-medium">#</th>
              <th className="px-1 py-2.5 font-medium">모델</th>
              <th className="px-2 py-2.5 font-medium">판정</th>
              <th className="hidden px-2 py-2.5 font-medium sm:table-cell">점수</th>
              <th className="hidden px-2 py-2.5 font-medium md:table-cell">빌드</th>
              <th className="px-2 py-2.5 text-right font-medium">플레이</th>
            </tr>
          </thead>
          <tbody>
            {task.models.map((m, i) => {
              const v = VERDICT[m.verdict as Verdict];
              return (
                <tr key={m.model} className="border-b border-border/60 last:border-0">
                  <td className="px-3.5 py-2.5 text-muted">{i + 1}</td>
                  <td className="px-1 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{m.name}</span>
                      <VendorBadge vendor={m.vendor} />
                    </div>
                  </td>
                  <td className={`px-2 py-2.5 ${v.cls}`}>
                    <span className="whitespace-nowrap">
                      {v.icon} <span className="hidden text-xs sm:inline">{v.label}</span>
                    </span>
                  </td>
                  <td className="hidden px-2 py-2.5 sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.round((m.score / task.maxScore) * 100)}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-zinc-300">{m.score}</span>
                    </div>
                  </td>
                  <td className="hidden px-2 py-2.5 tabular-nums text-muted md:table-cell">
                    {m.buildS ? `${m.buildS}s` : "—"}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    {m.hasFile && m.url ? (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg bg-accent/15 px-2.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/25"
                      >
                        ▶ Play
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">{note}</p>

      {/* 프롬프트 모달 */}
      {promptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPromptOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h4 className="text-sm font-semibold text-white">
                📝 {task.emoji} {task.title} — 모든 모델에 동일하게 준 프롬프트
              </h4>
              <button
                onClick={() => setPromptOpen(false)}
                className="rounded-lg px-2 py-1 text-muted transition hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="max-h-[64vh] overflow-auto whitespace-pre-wrap px-5 py-4 text-[13px] leading-relaxed text-zinc-300">
              {task.prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
