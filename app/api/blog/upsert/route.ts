import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { upsertPost } from "@/lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b?.title?.trim()) return NextResponse.json({ ok: false }, { status: 400 });
  const post = await upsertPost(pw, b);
  if (!post) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: true, post });
}
