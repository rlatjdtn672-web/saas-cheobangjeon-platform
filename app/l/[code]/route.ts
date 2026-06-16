import { NextRequest, NextResponse } from "next/server";
import { resolveLink } from "@/lib/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 단축 링크 1:1 리다이렉트 + 접속 집계
export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;
  const u = new URL(req.url);
  const refParam = (u.searchParams.get("ref") || u.searchParams.get("utm_source") || "").toLowerCase();
  const referer = req.headers.get("referer") || "";
  let src = refParam;
  if (!src) {
    if (/linkedin|lnkd\.in/i.test(referer)) src = "linkedin";
    else if (referer) {
      try {
        src = new URL(referer).hostname.replace(/^www\./, "");
      } catch {
        src = "direct";
      }
    } else src = "direct";
  }
  const ua = req.headers.get("user-agent") || "";

  const target = await resolveLink(code, src, referer, ua);
  if (!target || !/^https?:\/\//.test(target)) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }
  return NextResponse.redirect(target, 302);
}
