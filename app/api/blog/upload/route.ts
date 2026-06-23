import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SB =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oaglzmiidhjrumfnltrx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";
const BUCKET = "blog-images";

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

// 블로그 이미지 업로드 (대시보드 로그인 시에만)
export async function POST(req: NextRequest) {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) return NextResponse.json({ ok: false }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ ok: false, error: "no file" }, { status: 400 });
  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ ok: false, error: "type" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json({ ok: false, error: "too large" }, { status: 400 });

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = await file.arrayBuffer();
  const up = await fetch(`${SB}/storage/v1/object/${BUCKET}/${name}`, {
    method: "POST",
    headers: { apikey: ANON, Authorization: "Bearer " + ANON, "Content-Type": file.type },
    body: buf,
  });
  if (!up.ok) return NextResponse.json({ ok: false }, { status: 500 });
  const url = `${SB}/storage/v1/object/public/${BUCKET}/${name}`;
  return NextResponse.json({ ok: true, url });
}
