"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SaasButton, ButtonKind } from "@/lib/types";

type Initial = {
  tagline: string;
  githubRepo: string;
  buttons: SaasButton[];
};

const KINDS: { kind: ButtonKind; label: string }[] = [
  { kind: "website", label: "🌐 사이트" },
  { kind: "github", label: "★ GitHub" },
  { kind: "doc", label: "📄 Doc" },
  { kind: "review", label: "📰 뉴스레터" },
  { kind: "link", label: "🔗 링크" },
];

export default function EditPanel({ sid, initial }: { sid: string; initial: Initial }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [tagline, setTagline] = useState(initial.tagline);
  const [githubRepo, setGithubRepo] = useState(initial.githubRepo);
  const [btns, setBtns] = useState<SaasButton[]>(initial.buttons.map((b) => ({ ...b })));

  const upd = (i: number, k: keyof SaasButton, v: any) =>
    setBtns((p) => p.map((b, j) => (j === i ? { ...b, [k]: v } : b)));
  const move = (i: number, dir: -1 | 1) =>
    setBtns((p) => {
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const n = [...p];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const remove = (i: number) => setBtns((p) => p.filter((_, j) => j !== i));
  const add = () =>
    setBtns((p) => [...p, { kind: "link", label: "", url: "", enabled: true }]);

  async function save() {
    setSaving(true);
    setErr("");
    const patch = {
      tagline,
      github_repo: githubRepo,
      buttons: btns.filter((b) => b.label.trim() && b.url.trim()),
    };
    const r = await fetch("/api/saas/update", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sid, patch }),
    });
    setSaving(false);
    if (r.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setErr(r.status === 401 ? "권한 없음. 대시보드에서 다시 로그인하세요." : "저장 실패");
    }
  }

  const inp =
    "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-white outline-none focus:border-accent";
  const lbl = "text-[11px] uppercase tracking-wide text-muted";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-border px-2 py-1 text-[11px] text-muted transition hover:border-accent/50 hover:text-white"
        title="이 페이지의 버튼 편집 (관리자)"
      >
        ✏️ 편집
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="my-8 w-full max-w-xl rounded-2xl border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">✏️ 버튼·링크 편집</h2>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={lbl}>한 줄 설명</label>
                <input className={inp} value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>GitHub repo (owner/repo · 스타추적)</label>
                <input
                  className={inp}
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="owner/repo"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={lbl}>연결 버튼 (↑↓ 순서 · 체크 끄면 숨김)</label>
                  <button onClick={add} className="text-xs text-accent hover:underline">
                    + 버튼 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {btns.length === 0 && <p className="text-xs text-muted">버튼 없음</p>}
                  {btns.map((b, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border border-border p-2 ${b.enabled ? "" : "opacity-50"}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={b.enabled}
                          onChange={(e) => upd(i, "enabled", e.target.checked)}
                          title="표시/숨김"
                          className="h-4 w-4 accent-[#5b8cff]"
                        />
                        <button
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="rounded px-1.5 text-muted hover:text-white disabled:opacity-30"
                          title="위로"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => move(i, 1)}
                          disabled={i === btns.length - 1}
                          className="rounded px-1.5 text-muted hover:text-white disabled:opacity-30"
                          title="아래로"
                        >
                          ↓
                        </button>
                        <select
                          value={b.kind}
                          onChange={(e) => upd(i, "kind", e.target.value)}
                          className="rounded-md border border-border bg-paper px-1.5 py-1.5 text-xs text-white outline-none"
                        >
                          {KINDS.map((k) => (
                            <option key={k.kind} value={k.kind}>
                              {k.label}
                            </option>
                          ))}
                        </select>
                        <input
                          className={inp + " flex-1"}
                          value={b.label}
                          onChange={(e) => upd(i, "label", e.target.value)}
                          placeholder="라벨"
                        />
                        <button
                          onClick={() => remove(i)}
                          className="flex-none rounded-md border border-border px-2 py-1.5 text-sm text-muted hover:border-red-500/50 hover:text-red-400"
                          title="삭제"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        className={inp + " mt-1.5"}
                        value={b.url}
                        onChange={(e) => upd(i, "url", e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {err && <p className="text-xs text-red-400">{err}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-white"
                >
                  취소
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/85 disabled:opacity-60"
                >
                  {saving ? "저장 중…" : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
