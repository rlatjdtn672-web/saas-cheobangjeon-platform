"use client";

import { useRef, useState } from "react";
import { marked } from "marked";

async function uploadFile(file: File): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  const r = await fetch("/api/blog/upload", { method: "POST", body: form });
  if (!r.ok) return null;
  const d = await r.json().catch(() => null);
  return d?.url ?? null;
}

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function applyAtCursor(transform: (sel: string) => { text: string; cursor?: number }) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end);
    const { text } = transform(sel);
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  const wrap = (b: string, a: string, ph: string) =>
    applyAtCursor((sel) => ({ text: `${b}${sel || ph}${a}` }));
  const linePrefix = (p: string, ph: string) =>
    applyAtCursor((sel) => ({ text: sel ? sel.split("\n").map((l) => p + l).join("\n") : p + ph }));

  function insertImage(url: string) {
    applyAtCursor(() => ({ text: `\n![](${url})\n` }));
  }

  async function handleFiles(files: FileList | File[]) {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;
    setUploading(true);
    for (const f of imgs) {
      const url = await uploadFile(f);
      if (url) insertImage(url);
    }
    setUploading(false);
  }

  function pickImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => input.files && handleFiles(input.files);
    input.click();
  }

  const Btn = ({ onClick, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-white/5 hover:text-white"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-border">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        <Btn title="굵게" onClick={() => wrap("**", "**", "굵게")}>
          <b>B</b>
        </Btn>
        <Btn title="기울임" onClick={() => wrap("*", "*", "기울임")}>
          <i>I</i>
        </Btn>
        <span className="mx-1 h-4 w-px bg-border" />
        <Btn title="제목2" onClick={() => linePrefix("## ", "제목")}>
          H2
        </Btn>
        <Btn title="제목3" onClick={() => linePrefix("### ", "제목")}>
          H3
        </Btn>
        <Btn title="목록" onClick={() => linePrefix("- ", "항목")}>
          •
        </Btn>
        <Btn title="번호목록" onClick={() => linePrefix("1. ", "항목")}>
          1.
        </Btn>
        <Btn title="인용" onClick={() => linePrefix("> ", "인용")}>
          ❝
        </Btn>
        <Btn title="코드" onClick={() => wrap("`", "`", "코드")}>
          &lt;/&gt;
        </Btn>
        <Btn title="링크" onClick={() => wrap("[", "](https://)", "텍스트")}>
          🔗
        </Btn>
        <Btn title="이미지 업로드" onClick={pickImage}>
          🖼
        </Btn>
        <div className="ml-auto flex items-center gap-2">
          {uploading && <span className="text-[11px] text-accent">업로드 중…</span>}
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-white"
          >
            {preview ? "✏️ 편집" : "👁 미리보기"}
          </button>
        </div>
      </div>

      {/* 본문 */}
      {preview ? (
        <div
          className="post-body min-h-[320px] p-4 text-[15px] leading-relaxed text-zinc-200"
          dangerouslySetInnerHTML={{ __html: marked.parse(value || "*(내용 없음)*") as string }}
        />
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData.items)
              .filter((i) => i.type.startsWith("image/"))
              .map((i) => i.getAsFile())
              .filter(Boolean) as File[];
            if (files.length) {
              e.preventDefault();
              handleFiles(files);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          placeholder={"여기에 작성하세요. 이미지는 드래그&드롭 / 붙여넣기 / 🖼 버튼으로 업로드돼요.\n\n# 제목\n- 목록\n**굵게**"}
          className={`min-h-[320px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-white outline-none ${
            dragOver ? "ring-2 ring-accent" : ""
          }`}
        />
      )}
    </div>
  );
}
