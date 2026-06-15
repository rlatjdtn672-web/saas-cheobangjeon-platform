import { NextRequest, NextResponse } from "next/server";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pw = body?.password;
  if (!checkPassword(pw)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  // 비밀번호를 httpOnly 쿠키에 저장 → 대시보드 서버가 잠긴 DB 함수 호출에 사용.
  // (본인만 가진 값, HTTPS·httpOnly로만 전송)
  res.cookies.set(DASH_COOKIE, pw, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });
  return res;
}
