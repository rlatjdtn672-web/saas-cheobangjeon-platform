import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import type { EventType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 아웃바운드 클릭 추적 리다이렉트.
//   /go?type=website&id=<saasId>   → SaaS 사이트로 유입 (뉴스레터 임팩트)
//   /go?type=review&id=<saasId>    → 리뷰 글로 이동
// JS 없이도 동작하므로 추적 누락이 적다.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("type"); // "website" | "review"
  const id = searchParams.get("id");

  const store = getStore();
  const saas = id ? await store.getSaas(id) : null;

  let target = "/";
  let eventType: EventType | null = null;

  if (saas && kind === "website") {
    target = saas.websiteUrl;
    eventType = "website_click";
  } else if (saas && kind === "review") {
    target = saas.reviewUrl;
    eventType = "review_click";
  }

  if (saas && eventType) {
    const referrer = req.headers.get("referer");
    await store.recordEvent(eventType, saas.id, referrer);
  }

  // 안전장치: 절대 URL이 아니면 홈으로
  if (!/^https?:\/\//.test(target)) target = "/";

  return NextResponse.redirect(target, 302);
}
