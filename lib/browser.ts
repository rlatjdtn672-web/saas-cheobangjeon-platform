// 클라이언트(브라우저) 전용 Supabase 헬퍼 — 지표 조회 + 이벤트 기록.
// NEXT_PUBLIC_* 환경변수만 사용 (anon 키). service 키는 절대 여기 들어오지 않음.

// anon 키/URL은 공개용(브라우저에 노출 의도, RLS로 보호). env가 빌드에 인라인되지
// 않아도 클라이언트가 항상 동작하도록 공개 기본값을 둔다.
const DEFAULT_URL = "https://oaglzmiidhjrumfnltrx.supabase.co";
const DEFAULT_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";

export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
export const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON;

const H = { apikey: SB_ANON, Authorization: "Bearer " + SB_ANON };

export function sbReady() {
  return Boolean(SB_URL && SB_ANON);
}

export async function sbGet<T = any>(path: string): Promise<T[]> {
  if (!sbReady()) return [];
  try {
    const r = await fetch(SB_URL + "/rest/v1/" + path, { headers: H });
    return r.ok ? ((await r.json()) as T[]) : [];
  } catch {
    return [];
  }
}

// 방문 출처: ?ref= / ?utm_source= 우선, 없으면 referrer 파싱
export function visitorSource(): string {
  if (typeof window === "undefined") return "direct";
  const p = new URLSearchParams(window.location.search);
  const ref = (p.get("ref") || p.get("utm_source") || "").toLowerCase();
  if (ref) return ref;
  const r = document.referrer || "";
  if (/linkedin|lnkd\.in/i.test(r)) return "linkedin";
  if (r) {
    try {
      return new URL(r).hostname.replace(/^www\./, "");
    } catch {}
  }
  return "direct";
}

export function track(type: string, saasId?: string | null, target?: string | null) {
  if (!sbReady()) return;
  try {
    fetch(SB_URL + "/rest/v1/events", {
      method: "POST",
      headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        type,
        saas_id: saasId ?? null,
        source: visitorSource(),
        target: target ?? null,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// 최근 n일 (YYYY-MM-DD)
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10));
  }
  return out;
}

export function fmtNum(n: any): string {
  return (Number(n) || 0).toLocaleString("en-US");
}
