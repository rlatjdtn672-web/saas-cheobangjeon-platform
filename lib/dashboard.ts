import "server-only";
import type { DashboardData, SaasMetrics } from "./types";

// 대시보드 지표는 비밀번호로 잠긴 DB 함수(dashboard_metrics)로 가져온다.
// → service 키(잘못 설정될 수 있는 env)에 의존하지 않고, 뷰는 계속 비공개 유지.
// anon 키/URL은 공개값(브라우저에도 노출되는 값)이라 서버에 하드코딩해도 안전.
const URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oaglzmiidhjrumfnltrx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2x6bWlpZGhqcnVtZm5sdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDYzNTcsImV4cCI6MjA5Njk4MjM1N30.y3K5Ky14shiAwXkGvHkJpq5QHg0G4x7RjSdM8QJE5M4";

export async function fetchDashboard(pw: string): Promise<DashboardData | null> {
  try {
    const r = await fetch(`${URL}/rest/v1/rpc/dashboard_metrics`, {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: "Bearer " + ANON,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pw }),
      cache: "no-store",
    });
    if (!r.ok) return null;
    const d = await r.json();
    if (!d) return null;
    const im = d.impact || {};
    return {
      totalReviews: im.total_reviews ?? 0,
      totalVisits: im.total_visits ?? 0,
      totalLinkedinVisits: im.total_linkedin_visits ?? 0,
      totalGithubClicks: im.total_github_clicks ?? 0,
      inflow: (d.inflow || []).map((x: any) => ({
        day: x.day,
        source: x.source,
        visits: x.visits,
      })),
      stars: (d.stars || []).map((x: any) => ({
        saasId: x.saas_id,
        stars: x.stars,
        capturedAt: x.captured_at,
      })),
      saasStats: (d.saas_stats || []).map((x: any) => ({
        saasId: x.saas_id,
        views: x.views ?? 0,
        githubClicks: x.github_clicks ?? 0,
      })),
      perSaas: (d.per_saas || []).map((x: any) => ({
        saasId: x.saas_id,
        name: x.name,
        slug: x.slug,
        views: x.views ?? 0,
        clicks: x.clicks ?? 0,
      })),
      inflowHourly: (d.inflow_hourly || []).map((x: any) => ({
        hour: x.hour,
        source: x.source,
        visits: x.visits,
      })),
      inflowBySaas: (d.inflow_by_saas || []).map((x: any) => ({
        name: x.name,
        slug: x.slug,
        day: x.day,
        views: x.views,
      })),
      hourOfDay: (d.hour_of_day || []).map((x: any) => ({ h: x.h, visits: x.visits })),
      recent: (d.recent || []).map((x: any) => ({
        type: x.type,
        target: x.target,
        name: x.name,
        source: x.source,
        at: x.at,
      })),
    };
  } catch {
    return null;
  }
}

// 단일 SaaS 상세 지표
export async function fetchSaasMetrics(
  pw: string,
  sid: string
): Promise<SaasMetrics | null> {
  try {
    const r = await fetch(`${URL}/rest/v1/rpc/saas_metrics`, {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: "Bearer " + ANON,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pw, sid }),
      cache: "no-store",
    });
    if (!r.ok) return null;
    const d = await r.json();
    if (!d || !d.name) return null;
    return {
      name: d.name,
      slug: d.slug,
      views: d.views ?? 0,
      clicks: d.clicks ?? 0,
      byDay: (d.byDay || []).map((x: any) => ({ day: x.day, views: x.views })),
      byHour: (d.byHour || []).map((x: any) => ({ hour: x.hour, views: x.views })),
      hourOfDay: (d.hourOfDay || []).map((x: any) => ({ h: x.h, views: x.views })),
      bySource: (d.bySource || []).map((x: any) => ({ source: x.source, views: x.views })),
      byTarget: (d.byTarget || []).map((x: any) => ({ target: x.target, clicks: x.clicks })),
      stars: (d.stars || []).map((x: any) => ({ stars: x.stars, at: x.at })),
    };
  } catch {
    return null;
  }
}
