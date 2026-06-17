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

  // Vercel 엣지 지오IP 헤더 (배포 환경에서 자동 제공, 무료)
  const h = req.headers;
  const ipRaw = h.get("x-forwarded-for") || h.get("x-real-ip") || "";
  const ip = ipRaw.split(",")[0].trim() || undefined;
  const dec = (v: string | null) => {
    if (!v) return undefined;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const latS = h.get("x-vercel-ip-latitude");
  const lonS = h.get("x-vercel-ip-longitude");
  const geo = {
    ip,
    country: dec(h.get("x-vercel-ip-country")),
    region: dec(h.get("x-vercel-ip-country-region")),
    city: dec(h.get("x-vercel-ip-city")),
    lat: latS ? parseFloat(latS) : null,
    lon: lonS ? parseFloat(lonS) : null,
  };

  const target = await resolveLink(code, src, referer, ua, geo);
  if (!target || !/^https?:\/\//.test(target)) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }
  return NextResponse.redirect(target, 302);
}
