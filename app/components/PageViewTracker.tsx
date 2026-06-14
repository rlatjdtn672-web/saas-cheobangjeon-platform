"use client";

import { useEffect } from "react";
import { track } from "@/lib/browser";

// 방문 시 이벤트 1회 기록. type: page_view(대시보드) 또는 saas_view(상세).
export default function PageViewTracker({
  type = "page_view",
  saasId,
}: {
  type?: "page_view" | "saas_view";
  saasId?: string;
}) {
  useEffect(() => {
    const key = `scb-${type}-${saasId || "home"}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    track(type, saasId);
  }, [type, saasId]);
  return null;
}
