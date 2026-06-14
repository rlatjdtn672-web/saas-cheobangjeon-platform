"use client";

import { useEffect, useState } from "react";
import { sbGet, lastNDays, fmtNum, sbReady } from "@/lib/browser";
import LineChart, { Series } from "./LineChart";

type SaasLite = { id: string; name: string; slug: string };

type Data = {
  impact: any;
  inflow: { day: string; source: string; visits: number }[];
  github: { saas_id: string; github_clicks: number }[];
  stars: { saas_id: string; stars: number; captured_at: string }[];
  saasStats: { saas_id: string; views: number; github_clicks: number }[];
};

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

export default function Metrics({ saas }: { saas: SaasLite[] }) {
  const [d, setD] = useState<Data | null>(null);
  const nameById: Record<string, string> = {};
  saas.forEach((s) => (nameById[s.id] = s.name));

  useEffect(() => {
    let on = true;
    (async () => {
      const [impact, inflow, github, stars, saasStats] = await Promise.all([
        sbGet("impact_summary"),
        sbGet("daily_inflow?select=*"),
        sbGet("daily_github?select=*"),
        sbGet("github_stats?select=saas_id,stars,captured_at&order=captured_at.asc"),
        sbGet("saas_stats?select=*"),
      ]);
      if (on)
        setD({ impact: impact[0] || {}, inflow, github, stars, saasStats } as Data);
    })();
    return () => {
      on = false;
    };
  }, []);

  if (!sbReady()) {
    return (
      <p className="text-sm text-muted">
        Supabase 환경변수가 설정되지 않아 지표를 표시할 수 없습니다.
      </p>
    );
  }
  if (!d) return <p className="text-sm text-muted">지표 불러오는 중…</p>;

  const im = d.impact || {};
  const visits = im.total_visits || 0;
  const linkedin = im.total_linkedin_visits || 0;
  const ghClicks = im.total_github_clicks || 0;
  const conv = visits ? Math.round((ghClicks / visits) * 100) : 0;

  // 시계열
  const days = lastNDays(14);
  const totByDay: Record<string, number> = {};
  const liByDay: Record<string, number> = {};
  d.inflow.forEach((r) => {
    totByDay[r.day] = (totByDay[r.day] || 0) + r.visits;
    if (r.source === "linkedin") liByDay[r.day] = (liByDay[r.day] || 0) + r.visits;
  });
  const inflowSeries: Series[] = [
    { label: "전체 유입", color: "#5b8cff", points: days.map((x) => ({ x, y: totByDay[x] || 0 })) },
    { label: "LinkedIn 유입", color: "#22c55e", points: days.map((x) => ({ x, y: liByDay[x] || 0 })) },
  ];

  // 스타
  const seriesBySaas: Record<string, { stars: number; captured_at: string }[]> = {};
  d.stars.forEach((r) => (seriesBySaas[r.saas_id] = seriesBySaas[r.saas_id] || []).push(r));
  const starDaysSet = new Set<string>();
  const starRows = Object.keys(seriesBySaas).map((sid, i) => {
    const arr = seriesBySaas[sid];
    const first = arr[0],
      last = arr[arr.length - 1];
    arr.forEach((r) => starDaysSet.add(r.captured_at.slice(0, 10)));
    return {
      sid,
      color: STAR_COLORS[i % STAR_COLORS.length],
      last: last.stars,
      delta: last.stars - first.stars,
      snaps: arr.length,
      pts: arr,
    };
  });
  const starDays = [...starDaysSet].sort();
  const starSeries: Series[] = starRows.map((r) => ({
    label: nameById[r.sid] || r.sid,
    color: r.color,
    points: starDays.map((day) => {
      const m = r.pts.find((p) => p.captured_at.slice(0, 10) === day);
      return { x: day, y: m ? m.stars : r.pts[0].stars };
    }),
  }));

  // top 유입
  const ranked = saas
    .map((s) => ({ s, c: d.saasStats.find((x) => x.saas_id === s.id)?.views || 0 }))
    .filter((x) => x.c > 0)
    .sort((a, b) => b.c - a.c)
    .slice(0, 5);

  return (
    <div className="space-y-14">
      {/* 지표 카드 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat k="리뷰한 SaaS" v={saas.length} h="누적 처방 건수" />
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
            <div className="min-w-[120px] flex-1 rounded-xl border border-border bg-paper p-3.5">
              <p className="text-xs text-muted">플랫폼 유입</p>
              <p className="mt-1.5 text-2xl font-extrabold">{fmtNum(visits)}</p>
            </div>
            <div className="self-center text-sm font-semibold text-accent2">→</div>
            <div className="min-w-[120px] flex-1 rounded-xl border border-border bg-paper p-3.5">
              <p className="text-xs text-muted">그 중 LinkedIn</p>
              <p className="mt-1.5 text-2xl font-extrabold">{fmtNum(linkedin)}</p>
            </div>
            <div className="self-center text-sm font-semibold text-accent2">→</div>
            <div className="min-w-[120px] flex-1 rounded-xl border border-border bg-paper p-3.5">
              <p className="text-xs text-muted">GitHub 클릭</p>
              <p className="mt-1.5 text-2xl font-extrabold">{fmtNum(ghClicks)}</p>
            </div>
            <div className="self-center text-sm font-semibold text-accent2">{conv}%</div>
          </div>
          <p className="mt-3 text-xs text-muted">
            링크드인 글 → 플랫폼 상세 → GitHub 으로 이어지는 전환을 추적합니다.
          </p>
        </div>
      </div>

      {/* GitHub 스타 */}
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

      {/* Top 유입 */}
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
  );
}
