import { NextRequest, NextResponse } from "next/server";
import { checkPassword, DASH_COOKIE, DASH_TOKEN } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!checkPassword(body?.password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASH_COOKIE, DASH_TOKEN, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });
  return res;
}
