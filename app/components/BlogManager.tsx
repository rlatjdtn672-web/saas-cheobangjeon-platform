"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECTION_LIST, SECTIONS } from "@/lib/sections";
import MarkdownEditor from "./MarkdownEditor";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  published: boolean;
  section: string;
  created_at: string;
  updated_at: string;
};

type Draft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  published: boolean;
  section: string;
};

const EMPTY: Draft = { slug: "", title: "", excerpt: "", body: "", cover: "", published: true, section: "main" };
const secTitle = (k: string) => (SECTIONS as any)[k]?.title ?? k;

export default function BlogManager({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function openNew() {
    setErr("");
    setEditing({ ...EMPTY });
  }
  function openEdit(p: Post) {
    setErr("");
    setEditing({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      body: p.body ?? "",
      cover: p.cover_url ?? "",
      published: p.published,
      section: p.section ?? "main",
    });
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim()) {
      setErr("제목을 입력하세요.");
      return;
    }
    setSaving(true);
    setErr("");
    const r = await fetch("/api/blog/upsert", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (r.ok) {
      setEditing(null);
      router.refresh();
    } else {
      setErr(r.status === 401 ? "로그인이 필요합니다." : "저장 실패 (slug 중복 등 확인)");
    }
  }

  async function del(p: Post) {
    if (!confirm(`'${p.title}' 글을 삭제할까요?`)) return;
    await fetch("/api/blog/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    });
    router.refresh();
  }

  const inp =
    "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white outline-none focus:border-accent";

  // ── 에디터 ──
  if (editing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {editing.id ? "글 편집" : "새 글"}
          </h2>
          <button onClick={() => setEditing(null)} className="text-sm text-muted hover:text-white">
            ← 목록
          </button>
        </div>

        <input
          className={inp + " text-base"}
          value={editing.title}
          onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          placeholder="제목"
        />
        <div>
          <label className="text-[11px] uppercase tracking-wide text-muted">탭(섹션)</label>
          <select
            value={editing.section}
            onChange={(e) => setEditing({ ...editing, section: e.target.value })}
            className={inp + " mt-1"}
          >
            {SECTION_LIST.map((s) => (
              <option key={s.key} value={s.key}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className={inp}
            value={editing.slug}
            onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            placeholder="slug(주소) — 비우면 자동"
          />
          <input
            className={inp}
            value={editing.cover}
            onChange={(e) => setEditing({ ...editing, cover: e.target.value })}
            placeholder="커버 이미지 URL(선택)"
          />
        </div>
        <input
          className={inp}
          value={editing.excerpt}
          onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
          placeholder="요약(목록·검색에 노출)"
        />

        <div>
          <label className="text-[11px] uppercase tracking-wide text-muted">본문</label>
          <div className="mt-1">
            <MarkdownEditor
              value={editing.body}
              onChange={(v) => setEditing({ ...editing, body: v })}
            />
          </div>
        </div>

        {err && <p className="text-xs text-red-400">{err}</p>}

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={editing.published}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              className="h-4 w-4 accent-[#5b8cff]"
            />
            발행 (체크 해제 = 초안)
          </label>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-white">
              취소
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent/85 disabled:opacity-60"
            >
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 목록 ──
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">총 {posts.length}개</p>
        <button onClick={openNew} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/85">
          + 새 글 작성
        </button>
      </div>
      <div className="space-y-2.5">
        {posts.length === 0 && <p className="text-sm text-muted">아직 글이 없습니다.</p>}
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold text-white">{p.title}</span>
                <span className="flex-none rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-accent">
                  {secTitle(p.section)}
                </span>
                <span
                  className={`flex-none rounded-full px-2 py-0.5 text-[11px] ${
                    p.published ? "bg-accent2/15 text-accent2" : "bg-white/5 text-muted"
                  }`}
                >
                  {p.published ? "발행" : "초안"}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted">
                {(SECTIONS as any)[p.section]?.path ?? "/blog"}/{p.slug} · {p.created_at?.slice(0, 10)}
              </p>
            </div>
            {p.published && (
              <a
                href={`${(SECTIONS as any)[p.section]?.path ?? "/blog"}/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-white"
              >
                보기 ↗
              </a>
            )}
            <button onClick={() => openEdit(p)} className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-white">
              편집
            </button>
            <button onClick={() => del(p)} className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:border-red-500/50 hover:text-red-400">
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
