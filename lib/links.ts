import "server-only";

const URL_BASE =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oaglzmiidhjrumfnltrx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";

async function rpc(fn: string, body: any) {
  const r = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: ANON, Authorization: "Bearer " + ANON, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!r.ok) return null;
  return r.json().catch(() => null);
}

export type Geo = {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  postal?: string;
  lat?: number | null;
  lon?: number | null;
};

export async function resolveLink(
  code: string,
  src: string,
  ref: string,
  ua: string,
  geo: Geo = {}
): Promise<string | null> {
  const t = await rpc("resolve_link", {
    code,
    src,
    ref,
    ua,
    ip: geo.ip ?? null,
    country: geo.country ?? null,
    region: geo.region ?? null,
    city: geo.city ?? null,
    postal: geo.postal ?? null,
    lat: geo.lat ?? null,
    lon: geo.lon ?? null,
  });
  return typeof t === "string" ? t : null;
}

// Vercel 엣지 지오IP 헤더 파싱 (서버 라우트에서 공용 사용)
export function geoFromHeaders(h: Headers): Geo {
  const dec = (v: string | null) => {
    if (!v) return undefined;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const ipRaw = h.get("x-forwarded-for") || h.get("x-real-ip") || "";
  const latS = h.get("x-vercel-ip-latitude");
  const lonS = h.get("x-vercel-ip-longitude");
  return {
    ip: ipRaw.split(",")[0].trim() || undefined,
    country: dec(h.get("x-vercel-ip-country")),
    region: dec(h.get("x-vercel-ip-country-region")),
    city: dec(h.get("x-vercel-ip-city")),
    postal: dec(h.get("x-vercel-ip-postal-code")),
    lat: latS ? parseFloat(latS) : null,
    lon: lonS ? parseFloat(lonS) : null,
  };
}

export async function listLinks(pw: string): Promise<any[]> {
  const d = await rpc("links_admin", { pw });
  return Array.isArray(d) ? d : [];
}

export async function upsertLink(pw: string, slug: string, target: string, title: string) {
  return rpc("upsert_short_link", { pw, in_slug: slug, in_target: target, in_title: title });
}

export async function deleteLink(pw: string, slug: string) {
  return rpc("delete_short_link", { pw, in_slug: slug });
}

export async function linkDetail(pw: string, code: string) {
  return rpc("link_detail", { pw, code });
}
