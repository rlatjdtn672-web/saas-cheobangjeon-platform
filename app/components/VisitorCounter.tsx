"use client";

import { useEffect, useState } from "react";
import { SB_URL, SB_ANON, fmtNum } from "@/lib/browser";

type Stats = { total: number; today: number; visitors: number };

export default function VisitorCounter() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`${SB_URL}/rest/v1/rpc/visitor_stats`, {
      method: "POST",
      headers: {
        apikey: SB_ANON,
        Authorization: "Bearer " + SB_ANON,
        "Content-Type": "application/json",
      },
      body: "{}",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setS(d))
      .catch(() => {});
  }, []);

  if (!s) return null;
  return (
    <p className="text-xs text-muted">
      👀 전체 방문 <span className="text-zinc-300">{fmtNum(s.total)}</span> · 오늘{" "}
      <span className="text-zinc-300">{fmtNum(s.today)}</span> · 방문자{" "}
      <span className="text-zinc-300">{fmtNum(s.visitors)}</span>
    </p>
  );
}
