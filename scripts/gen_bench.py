#!/usr/bin/env python3
"""bench_data.jsonl → data/bench.ts 생성기.
데이터가 매시간 누적되므로, 갱신하려면 이 스크립트를 다시 돌리고 커밋하면 됨.
  python3 scripts/gen_bench.py
"""
import json, statistics, os

SRC = "/Users/hoyadoyou1/llm-eval/results/bench_data.jsonl"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "bench.ts")

MODEL_NAME = {"haiku4.5": "Haiku 4.5", "sonnet4.6": "Sonnet 4.6", "opus4.6": "Opus 4.6"}
MODEL_ORDER = ["haiku4.5", "sonnet4.6", "opus4.6"]
EP_ORDER = ["Anthropic직통", "Bedrock-미국", "Bedrock-도쿄"]
EP_COLOR = {"Anthropic직통": "#5b8cff", "Bedrock-미국": "#f59e0b", "Bedrock-도쿄": "#34d399"}

rows = [json.loads(l) for l in open(SRC)]
rows.sort(key=lambda r: r["ts"])

def med(xs, nd=2):
    return round(statistics.median(xs), nd) if xs else None

# 시간 슬롯 (등장 순서 유지)
slots = []
for r in rows:
    h = r["ts"][:13]  # YYYY-MM-DDTHH
    if h not in slots:
        slots.append(h)
slot_label = [f"{h[11:13]}시" for h in slots]

# 요약: model × endpoint 중앙값
summary = []
for m in MODEL_ORDER:
    entry = {"model": m, "name": MODEL_NAME[m], "endpoints": []}
    for ep in EP_ORDER:
        sub = [r for r in rows if r["model"] == m and r["endpoint"] == ep]
        if not sub:
            entry["endpoints"].append(None)
            continue
        entry["endpoints"].append({
            "endpoint": ep,
            "ttft": med([r["ttft_s"] for r in sub]),
            "tps": med([r["tps"] for r in sub], 0),
            "cps": med([r["cps"] for r in sub if "cps" in r], 0),
            "n": len(sub),
        })
    summary.append(entry)

# 시계열: model → metric → endpoint별 시간 슬롯 중앙값
series = {}
for m in MODEL_ORDER:
    series[m] = {"ttft": [], "tps": []}
    for ep in EP_ORDER:
        sub = [r for r in rows if r["model"] == m and r["endpoint"] == ep]
        if not sub:
            continue
        ttft_pts, tps_pts = [], []
        for h in slots:
            hh = [r for r in sub if r["ts"][:13] == h]
            ttft_pts.append(med([r["ttft_s"] for r in hh]))
            tps_pts.append(med([r["tps"] for r in hh], 1))
        series[m]["ttft"].append({"label": ep, "color": EP_COLOR[ep], "points": ttft_pts})
        series[m]["tps"].append({"label": ep, "color": EP_COLOR[ep], "points": tps_pts})

data = {
    "updated": rows[-1]["ts"].replace("T", " ")[:16],
    "periodStart": rows[0]["ts"].replace("T", " ")[:16],
    "totalSamples": len(rows),
    "hours": slot_label,
    "summary": summary,
    "series": series,
}

ts = "// 자동 생성: scripts/gen_bench.py (원본: llm-eval/results/bench_data.jsonl)\n"
ts += "// 갱신: python3 scripts/gen_bench.py 재실행 후 커밋\n"
ts += "export type BenchEp = { endpoint: string; ttft: number; tps: number; cps: number; n: number } | null;\n"
ts += "export type BenchSeries = { label: string; color: string; points: (number | null)[] };\n"
ts += "export const BENCH = " + json.dumps(data, ensure_ascii=False, indent=2) + " as {\n"
ts += "  updated: string; periodStart: string; totalSamples: number; hours: string[];\n"
ts += "  summary: { model: string; name: string; endpoints: BenchEp[] }[];\n"
ts += "  series: Record<string, { ttft: BenchSeries[]; tps: BenchSeries[] }>;\n"
ts += "};\n"
open(OUT, "w", encoding="utf-8").write(ts)
print(f"data/bench.ts 생성: {len(rows)}샘플, {len(slots)}시간대, 갱신 {data['updated']}")
