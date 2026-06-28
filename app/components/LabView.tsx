"use client";

import { useState } from "react";
import type { LabTask, LabModel } from "@/data/lab";

const VENDOR_COLOR: Record<string, string> = {
  Anthropic: "text-orange-400 bg-orange-400/10",
  Google: "text-sky-400 bg-sky-400/10",
  Alibaba: "text-violet-400 bg-violet-400/10",
  Meta: "text-blue-400 bg-blue-400/10",
  Mistral: "text-rose-400 bg-rose-400/10",
};

function VendorBadge({ vendor }: { vendor: string }) {
  const c = VENDOR_COLOR[vendor] || "text-zinc-400 bg-white/5";
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${c}`}>{vendor || "—"}</span>;
}

function fmtBytes(n: number) {
  if (!n) return "—";
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
}

function ModelCard({ task, m }: { task: LabTask; m: LabModel }) {
  const [run, setRun] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-white">{m.name}</span>
            {m.isClaude && <span title="Anthropic 모델">⭐</span>}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <VendorBadge vendor={m.vendor} />
            <span className="text-[11px] text-muted">점수 {m.score} · {fmtBytes(m.bytes)}</span>
          </div>
        </div>
        <div className="flex flex-none gap-1.5">
          <button
            onClick={() => setRun((v) => !v)}
            className="rounded-lg bg-accent/15 px-2.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/25"
          >
            {run ? "■ 닫기" : "▶ 실행"}
          </button>
          {m.url && (
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition hover:text-white"
            >
              ↗
            </a>
          )}
        </div>
      </div>
      {run && m.url && (
        <iframe
          src={m.url}
          title={`${task.title} — ${m.name}`}
          sandbox="allow-scripts"
          className="h-[440px] w-full border-t border-border bg-white"
        />
      )}
    </div>
  );
}

export default function LabView({ tasks }: { tasks: LabTask[] }) {
  const [activeKey, setActiveKey] = useState(tasks[0]?.key);
  const [promptOpen, setPromptOpen] = useState(false);
  const task = tasks.find((t) => t.key === activeKey) || tasks[0];
  if (!task) return null;

  const playable = task.models.filter((m) => m.hasFile && m.url);

  return (
    <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-white">🧪 AI 모델 실험실</h1>
        <p className="mt-1.5 text-sm text-muted">
          같은 미션, 다른 모델. 클로드부터 로컬 오픈모델까지 — 동일한 프롬프트 하나로 게임을 만들게 시키고 결과물을 그대로 비교합니다.
        </p>
      </header>

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
          {task.emoji} {task.title} · 결과물 {playable.length}개
        </h2>
        <button
          onClick={() => setPromptOpen(true)}
          className="flex-none rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-white"
        >
          📝 프롬프트 보기
        </button>
      </div>

      {/* 리더보드 */}
      <div className="mb-7 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3.5 py-2.5 font-medium">#</th>
              <th className="px-1 py-2.5 font-medium">모델</th>
              <th className="px-2 py-2.5 font-medium">점수</th>
              <th className="hidden px-2 py-2.5 font-medium sm:table-cell">빌드</th>
              <th className="px-2 py-2.5 text-right font-medium">결과</th>
            </tr>
          </thead>
          <tbody>
            {task.models.map((m, i) => (
              <tr key={m.model} className="border-b border-border/60 last:border-0">
                <td className="px-3.5 py-2.5 text-muted">{i + 1}</td>
                <td className="px-1 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{m.name}</span>
                    <VendorBadge vendor={m.vendor} />
                  </div>
                </td>
                <td className="px-2 py-2.5">
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
                <td className="hidden px-2 py-2.5 tabular-nums text-muted sm:table-cell">
                  {m.buildS ? `${m.buildS}s` : "—"}
                </td>
                <td className="px-2 py-2.5 text-right">
                  {m.hasFile ? (
                    <span className="text-[11px] font-medium text-emerald-400">✓ 완성</span>
                  ) : (
                    <span className="text-[11px] text-rose-400/80">✗ 실패</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 플레이 가능한 결과물 */}
      <h3 className="mb-3 text-sm font-semibold text-white">🎮 결과물 직접 실행해보기</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {playable.map((m) => (
          <ModelCard key={m.model} task={task} m={m} />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">
        ▶ 실행을 누르면 해당 모델이 만든 결과물이 그대로 실행됩니다 (방향키/WASD로 조작). 각 결과물은 외부 라이브러리 없이 단일 HTML 파일로 생성됐습니다.
      </p>

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
