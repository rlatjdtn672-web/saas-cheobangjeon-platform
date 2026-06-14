"use client";

import LineChart, { Series } from "./LineChart";
import { lastNDays, fmtNum } from "@/lib/browser";
import type { DashboardData } from "@/lib/types";

type SaasLite = { id: string; name: string; slug: string };
const STAR_COLORS = ["#f5c842", "#5b8cff", "#22c55e", "#ff7b72", "#bc8cff"];

function Stat({ k, v, h }: { k: string; v: string | number; h: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-2 text-3xl font-bold text-white">{v}</p>
      <p className="mt-1 text-[11px] text-muted">{h}</p>
    </div>
  );
}

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/";
}

export default function DashboardView({
  data,
  saas,
}: {
  data: DashboardData;
  saas: SaasLite[];
}) {
  const nameById: Record<string, string> = {};
  saas.forEach((s) => (nameById[s.id] = s.name));

  const visits = data.totalVisits;
  const linkedin = data.totalLinkedinVisits;
  const ghClicks = data.totalGithubClicks;
  const conv = visits ? Math.round((ghClicks / visits) * 100) : 0;

  // 시계열
  const days = lastNDays(14);
  const totByDay: Record<string, number> = {};
  const liByDay: Record<string, number> = {};
  data.inflow.forEach((r) => {
    totByDay[r.day] = (totByDay[r.day] || 0) + r.visits;
    if (r.source === "linkedin") liByDay[r.day] = (liByDay[r.day] || 0) + r.visits;
  });
  const inflowSeries: Series[] = [
    { label: "전체 유입", color: "#5b8cff", points: days.map((x) => ({ x, y: totByDay[x] || 0 })) },
    { label: "LinkedIn 유입", color: "#22c55e", points: days.map((x) => ({ x, y: liByDay[x] || 0 })) },
  ];

  // 스타
  const seriesBySaas: Record<string, { stars: number; capturedAt: string }[]> = {};
  data.stars.forEach((r) => (seriesBySaas[r.saasId] = seriesBySaas[r.saasId] || []).push(r));
  const starDaysSet = new Set<string>();
  const starRows = Object.keys(seriesBySaas).map((sid, i) => {
    const arr = seriesBySaas[sid];
    arr.forEach((r) => starDaysSet.add(r.capturedAt.slice(0, 10)));
    return {
      sid,
      color: STAR_COLORS[i % STAR_COLORS.length],
      last: arr[arr.length - 1].stars,
      delta: arr[arr.length - 1].stars - arr[0].stars,
      snaps: arr.length,
      pts: arr,
    };
  });
  const starDays = [...starDaysSet].sort();
  const starSeries: Series[] = starRows.map((r) => ({
    label: nameById[r.sid] || r.sid,
    color: r.color,
    points: starDays.map((day) => {
      const m = r.pts.find((p) => p.capturedAt.slice(0, 10) === day);
      return { x: day, y: m ? m.stars : r.pts[0].stars };
    }),
  }));

  // top 유입
  const ranked = saas
    .map((s) => ({ s, c: data.saasStats.find((x) => x.saasId === s.id)?.views || 0 }))
    .filter((x) => x.c > 0)
    .sort((a, b) => b.c - a.c)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-10">
      <div className="flex items-center justify-between">
        <div>
          <a href="/" className="text-[13px] text-muted hover:text-white">
            ← 공개 페이지
          </a>
          <h1 className="mt-2 text-2xl font-bold text-white">📊 유입 대시보드</h1>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:text-white"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-8 space-y-14">
        {/* 지표 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat k="리뷰한 SaaS" v={data.totalReviews} h="누적 처방 건수" />
          <Stat k="플랫폼 총 유입" v={fmtNum(visits)} h="상세/대시보드 방문" />
          <Stat k="LinkedIn 유입" v={fmtNum(linkedin)} h="링크드인에서 넘어온 방문" />
          <Stat k="GitHub 클릭" v={fmtNum(ghClicks)} h="플랫폼 → GitHub 전환" />
        </div>

        {/* 시계열 + 퍼널 */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-white">📈 일자별 플랫폼 유입</h3>
              <span className="text-xs text-muted">최근 14일</span>
            </div>
            <LineChart days={days} series={inflowSeries} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-white">🔻 유입 → GitHub 전환 퍼널</h3>
            <div className="flex flex-wrap items-stretch gap-2.5">
              <div className="min-w-[110px] flex-1 rounded-xl border border-border bg-paper p-3.5">
                <p className="text-xs text-muted">플랫폼 유입</p>
                <p className="mt-1.5 text-2xl font-extrabold">{fmtNum(visits)}</p>
              </div>
              <div className="self-center text-sm font-semibold text-accent2">→</div>
              <div className="min-w-[110px] flex-1 rounded-xl border border-border bg-paper p-3.5">
                <p className="text-xs text-muted">그 중 LinkedIn</p>
                <p className="mt-1.5 text-2xl font-extrabold">{fmtNum(linkedin)}</p>
              </div>
              <div className="self-center text-sm font-semibold text-accent2">→</div>
              <div className="min-w-[110px] flex-1 rounded-xl border border-border bg-paper p-3.5">
                <p className="text-xs text-muted">GitHub 클릭</p>
                <p className="mt-1.5 text-2xl font-extrabold">{fmtNum(ghClicks)}</p>
              </div>
              <div className="self-center text-sm font-semibold text-accent2">{conv}%</div>
            </div>
          </div>
        </div>

        {/* 스타 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">⭐ GitHub 스타 추이</h2>
            <span className="text-xs text-muted">매일 자동 스냅샷</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              {starRows.length === 0 && <p className="text-sm text-muted">스냅샷 대기 중…</p>}
              {starRows.map((r) => (
                <div
                  key={r.sid}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <div>
                    <p className="text-xs text-muted">{nameById[r.sid] || r.sid}</p>
                    <p className="text-xl font-bold">{fmtNum(r.last)} ★</p>
                  </div>
                  <p className="text-xs text-accent2">
                    {r.delta >= 0 ? "+" : ""}
                    {fmtNum(r.delta)} (스냅샷 {r.snaps})
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-2 text-[15px] font-semibold text-white">스타 변화 그래프</h3>
              {starDays.length >= 2 ? (
                <LineChart days={starDays} series={starSeries} />
              ) : (
                <p className="text-sm text-muted">스냅샷이 2일 이상 쌓이면 그래프가 그려집니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* Top */}
        {ranked.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">🏆 유입을 가장 많이 만든 SaaS</h2>
            <div className="rounded-2xl border border-border bg-card p-5">
              {ranked.map((x, i) => (
                <div key={x.s.id} className="mt-2.5 flex items-center gap-3 first:mt-0">
                  <span className="w-5 text-sm text-muted">{i + 1}</span>
                  <span className="flex-1 text-sm text-zinc-200">{x.s.name}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${Math.min(100, (x.c / ranked[0].c) * 100)}%` }}
                    />
                  </span>
                  <span className="w-10 text-right text-sm text-white">{fmtNum(x.c)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
