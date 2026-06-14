import { NextResponse } from "next/server";
import { DASH_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
