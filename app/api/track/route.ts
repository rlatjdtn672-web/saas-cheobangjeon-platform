import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import type { EventType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: EventType[] = ["page_view", "saas_view", "website_click", "review_click"];

// 클라이언트에서 보내는 이벤트(주로 page_view, saas_view) 기록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body?.type as EventType;
    if (!ALLOWED.includes(type)) {
      return NextResponse.json({ ok: false, error: "invalid type" }, { status: 400 });
    }
    const referrer = req.headers.get("referer");
    await getStore().recordEvent(type, body?.saasId ?? null, referrer);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
