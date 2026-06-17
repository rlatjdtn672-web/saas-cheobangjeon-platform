import { NextRequest, NextResponse } from "next/server";
import { geoFromHeaders } from "@/lib/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SB =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oaglzmiidhjrumfnltrx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";

const ALLOWED = ["page_view", "saas_view", "website_click", "review_click", "github_click"];

// 이벤트 기록 + 서버에서 Vercel 지오 헤더로 지역 정보 부착 (뉴스레터 유입 지도용)
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!ALLOWED.includes(b?.type)) return NextResponse.json({ ok: false }, { status: 400 });
  const g = geoFromHeaders(req.headers);
  try {
    await fetch(`${SB}/rest/v1/events`, {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: "Bearer " + ANON,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        type: b.type,
        saas_id: b.saasId ?? null,
        source: b.source ?? null,
        target: b.target ?? null,
        ip: g.ip ?? null,
        country: g.country ?? null,
        region: g.region ?? null,
        city: g.city ?? null,
        postal: g.postal ?? null,
        lat: g.lat ?? null,
        lon: g.lon ?? null,
      }),
    });
  } catch {}
  return NextResponse.json({ ok: true });
}
