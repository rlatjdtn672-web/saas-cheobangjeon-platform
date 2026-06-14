"use client";

import { useEffect, useState } from "react";
import { sbGet, fmtNum } from "@/lib/browser";

// 상세 페이지에서 현재 GitHub 스타/포크를 실시간 표시
export default function LiveStars({ saasId }: { saasId: string }) {
  const [gh, setGh] = useState<{ stars: number; forks: number } | null>(null);
  useEffect(() => {
    let on = true;
    sbGet(`github_latest?saas_id=eq.${encodeURIComponent(saasId)}&select=stars,forks`).then(
      (rows) => {
        if (on && rows[0]) setGh(rows[0]);
      }
    );
    return () => {
      on = false;
    };
  }, [saasId]);

  if (!gh) return null;
  return (
    <>
      <span className="rounded-md bg-yellow-400/10 px-2.5 py-1 text-xs text-yellow-300">
        ★ {fmtNum(gh.stars)} stars
      </span>
      <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-muted">
        ⑂ {fmtNum(gh.forks)} forks
      </span>
    </>
  );
}
