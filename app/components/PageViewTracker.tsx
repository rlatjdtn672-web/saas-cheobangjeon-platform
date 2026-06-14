"use client";

import { useEffect } from "react";

// 대시보드 방문 시 page_view 이벤트 1회 기록
export default function PageViewTracker() {
  useEffect(() => {
    const key = "saas-cheobang-pv";
    // 같은 탭 세션에서 중복 집계 방지
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "page_view" }),
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}
