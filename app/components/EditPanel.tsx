"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SaasLink } from "@/lib/types";

type Initial = {
  tagline: string;
  websiteUrl: string;
  githubUrl: string;
  githubRepo: string;
  docUrl: string;
  reviewUrl: string;
  links: SaasLink[];
};

export default function EditPanel({ sid, initial }: { sid: string; initial: Initial }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState<Initial>({ ...initial, links: [...initial.links] });

  const set = (k: keyof Initial, v: any) => setF((p) => ({ ...p, [k]: v }));
  const setLink = (i: number, k: keyof SaasLink, v: string) =>
    setF((p) => ({ ...p, links: p.links.map((l, j) => (j === i ? { ...l, [k]: v } : l)) }));
  const addLink = () => setF((p) => ({ ...p, links: [...p.links, { label: "", url: "" }] }));
  const removeLink = (i: number) =>
    setF((p) => ({ ...p, links: p.links.filter((_, j) => j !== i) }));

  async function save() {
    setSaving(true);
    setErr("");
    const patch = {
      tagline: f.tagline,
      website_url: f.websiteUrl,
      github_url: f.githubUrl,
      github_repo: f.githubRepo,
      doc_url: f.docUrl,
      review_url: f.reviewUrl,
      links: f.links.filter((l) => l.label.trim() && l.url.trim()),
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
      setErr(r.status === 401 ? "권한이 없습니다. 대시보드에서 다시 로그인하세요." : "저장 실패");
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
        title="이 페이지의 링크 편집 (관리자)"
      >
        ✏️ 편집
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="my-8 w-full max-w-lg rounded-2xl border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">✏️ 링크 편집</h2>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={lbl}>한 줄 설명</label>
                <input className={inp} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={lbl}>사이트 URL</label>
                  <input className={inp} value={f.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://" />
                </div>
                <div>
                  <label className={lbl}>GitHub URL</label>
                  <input className={inp} value={f.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/owner/repo" />
                </div>
                <div>
                  <label className={lbl}>GitHub repo (owner/repo · 스타추적)</label>
                  <input className={inp} value={f.githubRepo} onChange={(e) => set("githubRepo", e.target.value)} placeholder="owner/repo" />
                </div>
                <div>
                  <label className={lbl}>Doc URL</label>
                  <input className={inp} value={f.docUrl} onChange={(e) => set("docUrl", e.target.value)} placeholder="https://" />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>뉴스레터 리뷰 URL</label>
                  <input className={inp} value={f.reviewUrl} onChange={(e) => set("reviewUrl", e.target.value)} placeholder="https://" />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={lbl}>추가 링크</label>
                  <button onClick={addLink} className="text-xs text-accent hover:underline">
                    + 링크 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {f.links.length === 0 && <p className="text-xs text-muted">추가 링크 없음</p>}
                  {f.links.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className={inp + " flex-[2]"}
                        value={l.label}
                        onChange={(e) => setLink(i, "label", e.target.value)}
                        placeholder="라벨 (예: 메이커 LinkedIn)"
                      />
                      <input
                        className={inp + " flex-[3]"}
                        value={l.url}
                        onChange={(e) => setLink(i, "url", e.target.value)}
                        placeholder="https://"
                      />
                      <button
                        onClick={() => removeLink(i)}
                        className="flex-none rounded-lg border border-border px-2.5 text-sm text-muted hover:border-red-500/50 hover:text-red-400"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {err && <p className="text-xs text-red-400">{err}</p>}

              <div className="flex justify-end gap-2 pt-2">
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
