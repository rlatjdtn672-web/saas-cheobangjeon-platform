// 실전 SaaS 처방전 - Supabase 클라이언트 공통 헬퍼 (정적, 무빌드)
const SUPABASE_URL = "https://oaglzmiidhjrumfnltrx.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";
const H = { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON };

const NEWSLETTER_URL =
  "https://www.linkedin.com/newsletters/실전-saas-처방전-7463394467773984768/";

function esc(s) {
  return (s || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}
function fmtNum(n) {
  return (Number(n) || 0).toLocaleString("en-US");
}

async function sbGet(path) {
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/" + path, { headers: H });
    return r.ok ? await r.json() : [];
  } catch (e) {
    return [];
  }
}

// 방문 출처: ?ref= / ?utm_source= 우선, 없으면 referrer 파싱
function visitorSource() {
  const p = new URLSearchParams(location.search);
  const ref = (p.get("ref") || p.get("utm_source") || "").toLowerCase();
  if (ref) return ref;
  const r = document.referrer || "";
  if (/linkedin|lnkd\.in/i.test(r)) return "linkedin";
  if (r) {
    try {
      return new URL(r).hostname.replace(/^www\./, "");
    } catch (e) {}
  }
  return "direct";
}

// 이벤트 기록
function track(type, saasId) {
  try {
    fetch(SUPABASE_URL + "/rest/v1/events", {
      method: "POST",
      headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ type, saas_id: saasId || null, source: visitorSource() }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {}
}

// ── 미니 SVG 라인차트 ──
// series: [{label, color, points:[{x:'YYYY-MM-DD', y:number}]}]  (x는 정렬된 날짜)
function lineChart(el, days, series, opts) {
  opts = opts || {};
  const W = opts.w || 680,
    Hh = opts.h || 200,
    pad = { l: 36, r: 12, t: 14, b: 24 };
  const iw = W - pad.l - pad.r,
    ih = Hh - pad.t - pad.b;
  const maxY = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.y)));
  const xOf = (i) => pad.l + (days.length <= 1 ? iw / 2 : (i / (days.length - 1)) * iw);
  const yOf = (v) => pad.t + ih - (v / maxY) * ih;
  const gridY = [0, 0.5, 1].map((f) => {
    const v = Math.round(maxY * f);
    const y = yOf(v);
    return `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="#1f2630"/><text x="${
      pad.l - 6
    }" y="${y + 3}" fill="#5b6573" font-size="10" text-anchor="end">${v}</text>`;
  });
  const xticks = days
    .map((d, i) => {
      if (days.length > 8 && i % Math.ceil(days.length / 6) !== 0 && i !== days.length - 1) return "";
      return `<text x="${xOf(i)}" y="${Hh - 6}" fill="#5b6573" font-size="10" text-anchor="middle">${d.slice(
        5
      )}</text>`;
    })
    .join("");
  const paths = series
    .map((s) => {
      const pts = s.points.map((p, i) => `${xOf(i)},${yOf(p.y)}`);
      const dots = s.points
        .map((p, i) => `<circle cx="${xOf(i)}" cy="${yOf(p.y)}" r="2.5" fill="${s.color}"/>`)
        .join("");
      const line =
        pts.length > 1
          ? `<polyline points="${pts.join(" ")}" fill="none" stroke="${s.color}" stroke-width="2"/>`
          : "";
      return line + dots;
    })
    .join("");
  const legend = series
    .map(
      (s) =>
        `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;font-size:12px;color:#8b949e"><span style="width:10px;height:10px;border-radius:2px;background:${s.color};display:inline-block"></span>${esc(
          s.label
        )}</span>`
    )
    .join("");
  el.innerHTML =
    `<div style="margin-bottom:8px">${legend}</div>` +
    `<svg viewBox="0 0 ${W} ${Hh}" width="100%" preserveAspectRatio="xMidYMid meet">${gridY.join(
      ""
    )}${xticks}${paths}</svg>`;
}

// 날짜 유틸: 최근 n일 라벨 배열 (KST 기준 근사, UTC 날짜 사용)
function lastNDays(n) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
