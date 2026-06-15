import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { updateSaas } from "@/lib/dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 상세페이지 인라인 편집 저장. 대시보드 로그인(쿠키 비번)한 경우에만 허용.
export async function POST(req: NextRequest) {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const sid = body?.sid as string;
  const patch = body?.patch as Record<string, any>;
  if (!sid || typeof patch !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const result = await updateSaas(pw, sid, patch);
  if (!result) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: true, saas: result });
}
