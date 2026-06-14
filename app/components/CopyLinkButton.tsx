"use client";

import { useState } from "react";

// 게시글(상세) 링크를 클립보드에 복사. 뉴스레터/댓글에 붙여넣기용.
// path 예: "/s/tradingagents?ref=linkedin"  → 현재 도메인 기준 절대 URL로 복사.
export default function CopyLinkButton({
  path,
  label = "링크 복사",
  className,
}: {
  path: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://saas-cheobangjeon-platform.vercel.app";
    const url = origin + path;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // 클립보드 권한 거부 시 폴백
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-accent/50 hover:text-white"
      }
      title="뉴스레터/댓글에 붙여넣을 추적 링크를 복사합니다"
    >
      {copied ? "✓ 복사됨!" : `🔗 ${label}`}
    </button>
  );
}
