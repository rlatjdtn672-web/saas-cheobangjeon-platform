// 자동 생성: scripts/gen_bench.py (원본: llm-eval/results/bench_data.jsonl)
// 갱신: python3 scripts/gen_bench.py 재실행 후 커밋
export type BenchEp = { endpoint: string; ttft: number; tps: number; cps: number; n: number } | null;
export type BenchSeries = { label: string; color: string; points: (number | null)[] };
export const BENCH = {
  "updated": "2026-07-07 09:19",
  "periodStart": "2026-07-06 17:35",
  "totalSamples": 432,
  "hours": [
    "17시",
    "18시",
    "19시",
    "20시",
    "21시",
    "22시",
    "23시",
    "01시",
    "02시",
    "03시",
    "04시",
    "05시",
    "06시",
    "07시",
    "08시",
    "09시"
  ],
  "summary": [
    {
      "model": "haiku4.5",
      "name": "Haiku 4.5",
      "endpoints": [
        {
          "endpoint": "Anthropic직통",
          "ttft": 0.67,
          "tps": 109.0,
          "cps": 469.0,
          "n": 54
        },
        {
          "endpoint": "Bedrock-미국",
          "ttft": 1.55,
          "tps": 120.0,
          "cps": 518.0,
          "n": 54
        },
        {
          "endpoint": "Bedrock-도쿄",
          "ttft": 0.94,
          "tps": 122.0,
          "cps": 519.0,
          "n": 54
        }
      ]
    },
    {
      "model": "sonnet4.6",
      "name": "Sonnet 4.6",
      "endpoints": [
        {
          "endpoint": "Anthropic직통",
          "ttft": 0.99,
          "tps": 51.0,
          "cps": 228.0,
          "n": 54
        },
        {
          "endpoint": "Bedrock-미국",
          "ttft": 1.56,
          "tps": 58.0,
          "cps": 256.0,
          "n": 54
        },
        {
          "endpoint": "Bedrock-도쿄",
          "ttft": 0.99,
          "tps": 57.0,
          "cps": 256.0,
          "n": 54
        }
      ]
    },
    {
      "model": "opus4.6",
      "name": "Opus 4.6",
      "endpoints": [
        {
          "endpoint": "Anthropic직통",
          "ttft": 1.81,
          "tps": 50.0,
          "cps": 211.0,
          "n": 54
        },
        {
          "endpoint": "Bedrock-미국",
          "ttft": 2.15,
          "tps": 54.0,
          "cps": 234.0,
          "n": 54
        },
        null
      ]
    }
  ],
  "series": {
    "haiku4.5": {
      "ttft": [
        {
          "label": "Anthropic직통",
          "color": "#5b8cff",
          "points": [
            0.68,
            0.62,
            0.56,
            0.68,
            0.64,
            0.7,
            0.65,
            1.08,
            0.59,
            0.63,
            0.57,
            1.18,
            1.69,
            0.58,
            0.7,
            0.56
          ]
        },
        {
          "label": "Bedrock-미국",
          "color": "#f59e0b",
          "points": [
            1.63,
            1.65,
            1.39,
            1.37,
            1.53,
            1.84,
            1.55,
            1.55,
            1.76,
            1.7,
            1.58,
            1.79,
            1.74,
            1.46,
            1.65,
            1.44
          ]
        },
        {
          "label": "Bedrock-도쿄",
          "color": "#34d399",
          "points": [
            0.89,
            0.9,
            0.94,
            1.01,
            1.0,
            1.13,
            0.93,
            0.84,
            1.09,
            0.88,
            1.1,
            0.82,
            0.88,
            0.96,
            1.08,
            0.99
          ]
        }
      ],
      "tps": [
        {
          "label": "Anthropic직통",
          "color": "#5b8cff",
          "points": [
            109.1,
            102.0,
            119.4,
            115.6,
            123.0,
            111.6,
            97.6,
            111.9,
            110.8,
            106.1,
            110.0,
            118.9,
            118.4,
            102.4,
            105.4,
            101.1
          ]
        },
        {
          "label": "Bedrock-미국",
          "color": "#f59e0b",
          "points": [
            122.0,
            117.4,
            125.6,
            117.4,
            126.2,
            120.2,
            129.6,
            112.3,
            113.1,
            123.4,
            124.7,
            117.7,
            120.7,
            123.9,
            118.4,
            118.3
          ]
        },
        {
          "label": "Bedrock-도쿄",
          "color": "#34d399",
          "points": [
            127.3,
            118.9,
            115.6,
            123.3,
            118.7,
            120.4,
            122.4,
            126.3,
            123.6,
            119.0,
            113.3,
            115.8,
            119.9,
            117.8,
            130.6,
            124.7
          ]
        }
      ]
    },
    "sonnet4.6": {
      "ttft": [
        {
          "label": "Anthropic직통",
          "color": "#5b8cff",
          "points": [
            1.08,
            1.04,
            1.04,
            0.95,
            0.94,
            0.94,
            0.93,
            1.04,
            0.94,
            1.06,
            1.43,
            0.97,
            0.99,
            0.88,
            1.22,
            1.14
          ]
        },
        {
          "label": "Bedrock-미국",
          "color": "#f59e0b",
          "points": [
            1.54,
            1.49,
            1.49,
            1.55,
            1.51,
            1.61,
            1.55,
            1.7,
            1.64,
            1.85,
            2.0,
            1.8,
            1.67,
            1.51,
            1.5,
            1.47
          ]
        },
        {
          "label": "Bedrock-도쿄",
          "color": "#34d399",
          "points": [
            0.96,
            0.99,
            0.9,
            1.0,
            0.98,
            0.94,
            1.08,
            0.99,
            0.99,
            1.03,
            1.27,
            1.25,
            1.0,
            0.98,
            1.08,
            1.43
          ]
        }
      ],
      "tps": [
        {
          "label": "Anthropic직통",
          "color": "#5b8cff",
          "points": [
            51.1,
            50.7,
            51.8,
            51.8,
            54.2,
            48.6,
            48.9,
            49.5,
            52.8,
            46.2,
            53.3,
            53.5,
            44.9,
            50.8,
            51.9,
            48.1
          ]
        },
        {
          "label": "Bedrock-미국",
          "color": "#f59e0b",
          "points": [
            59.5,
            62.7,
            56.9,
            54.3,
            57.9,
            57.4,
            59.3,
            56.3,
            55.4,
            57.5,
            54.4,
            57.2,
            58.2,
            59.5,
            59.8,
            58.6
          ]
        },
        {
          "label": "Bedrock-도쿄",
          "color": "#34d399",
          "points": [
            57.4,
            52.8,
            57.1,
            61.0,
            61.3,
            57.0,
            52.7,
            57.9,
            55.8,
            55.1,
            54.7,
            59.8,
            57.3,
            58.1,
            57.1,
            55.3
          ]
        }
      ]
    },
    "opus4.6": {
      "ttft": [
        {
          "label": "Anthropic직통",
          "color": "#5b8cff",
          "points": [
            2.36,
            2.03,
            1.8,
            2.97,
            2.09,
            1.78,
            1.76,
            1.75,
            1.92,
            1.78,
            1.75,
            1.66,
            1.87,
            2.14,
            1.85,
            2.01
          ]
        },
        {
          "label": "Bedrock-미국",
          "color": "#f59e0b",
          "points": [
            2.16,
            2.11,
            2.12,
            2.3,
            2.01,
            2.19,
            2.25,
            2.07,
            2.12,
            2.16,
            2.21,
            2.27,
            2.19,
            1.99,
            2.07,
            2.15
          ]
        }
      ],
      "tps": [
        {
          "label": "Anthropic직통",
          "color": "#5b8cff",
          "points": [
            49.4,
            53.5,
            57.2,
            51.1,
            53.3,
            48.8,
            47.8,
            49.2,
            50.9,
            50.8,
            49.2,
            47.8,
            50.3,
            48.5,
            48.2,
            48.6
          ]
        },
        {
          "label": "Bedrock-미국",
          "color": "#f59e0b",
          "points": [
            54.7,
            53.0,
            58.6,
            53.5,
            51.9,
            55.8,
            55.9,
            52.5,
            58.9,
            56.4,
            52.4,
            54.8,
            53.7,
            54.5,
            55.4,
            52.9
          ]
        }
      ]
    }
  }
} as {
  updated: string; periodStart: string; totalSamples: number; hours: string[];
  summary: { model: string; name: string; endpoints: BenchEp[] }[];
  series: Record<string, { ttft: BenchSeries[]; tps: BenchSeries[] }>;
};
