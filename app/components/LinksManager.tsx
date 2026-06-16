"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmtNum } from "@/lib/browser";

type Link = {
  slug: string;
  target_url: string;
  title: string | null;
  hits: number;
  last_hit: string | null;
  created_at: string;
};

export default function LinksManager({ links, origin }: { links: Link[]; origin: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  const shortUrl = (s: string) => `${origin}/l/${s}`;

  async function add() {
    if (!target.trim()) {
      setErr("대상 URL을 입력하세요.");
      return;
    }
    setBusy(true);
    setErr("");
    const r = await fetch("/api/links/upsert", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target: target.trim(), title: title.trim(), slug: slug.trim() }),
    });
    setBusy(false);
    if (r.ok) {
      setTitle("");
      setTarget("");
      setSlug("");
      router.refresh();
    } else {
      setErr(r.status === 401 ? "로그인이 필요합니다." : "등록 실패 (URL 확인)");
    }
  }

  async function del(s: string) {
    if (!confirm(`'${s}' 링크를 삭제할까요? 통계도 함께 삭제됩니다.`)) return;
    await fetch("/api/links/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: s }),
    });
    router.refresh();
  }

  async function copy(s: string) {
    try {
      await navigator.clipboard.writeText(shortUrl(s));
    } catch {}
    setCopied(s);
    setTimeout(() => setCopied(""), 1500);
  }

  const inp =
    "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white outline-none focus:border-accent";

  return (
    <div>
      {/* 등록 폼 */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-[15px] font-semibold text-white">+ 새 단축 링크</h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <input className={inp} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목(선택) 예: 잡코리아 공지" />
          <input className={inp} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="커스텀 코드(선택) 비우면 자동" />
          <input className={inp + " sm:col-span-2"} value={target} onChange={(e) => setTarget(e.target.value)} placeholder="대상 URL (https://...)" />
        </div>
        {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
        <button
          onClick={add}
          disabled={busy}
          className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/85 disabled:opacity-60"
        >
          {busy ? "등록 중…" : "링크 만들기"}
        </button>
      </div>

      {/* 목록 */}
      <div className="mt-6 space-y-2.5">
        {links.length === 0 && <p className="text-sm text-muted">아직 링크가 없습니다.</p>}
        {links.map((l) => (
          <div key={l.slug} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <a href={`/links/${l.slug}`} className="font-semibold text-white hover:text-accent">
                    {l.title || l.slug}
                  </a>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-accent">
                    📊 {fmtNum(l.hits)} 클릭
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[13px]">
                  <code className="rounded bg-white/5 px-2 py-0.5 text-accent2">{shortUrl(l.slug)}</code>
                  <button onClick={() => copy(l.slug)} className="text-xs text-muted hover:text-white">
                    {copied === l.slug ? "✓ 복사됨" : "복사"}
                  </button>
                </div>
                <p className="mt-1 truncate text-xs text-muted">→ {l.target_url}</p>
              </div>
              <div className="flex flex-none flex-col items-end gap-2">
                <a href={`/links/${l.slug}`} className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-white">
                  통계 →
                </a>
                <button onClick={() => del(l.slug)} className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:border-red-500/50 hover:text-red-400">
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
