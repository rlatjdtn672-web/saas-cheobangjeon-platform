import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "실전 SaaS 처방전 — 인디 SaaS 리뷰 & 임팩트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff";

export default async function Image() {
  let fonts: any = undefined;
  try {
    const data = await (await fetch(FONT_URL)).arrayBuffer();
    fonts = [{ name: "Pretendard", data, weight: 700, style: "normal" }];
  } catch {
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0c10",
          backgroundImage:
            "radial-gradient(900px circle at 80% -10%, rgba(91,140,255,0.28), transparent 55%)",
          padding: "72px",
          fontFamily: "Pretendard",
          color: "#e6edf3",
        }}
      >
        {/* 상단: 브랜드 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#5b8cff",
              color: "#fff",
              fontSize: 40,
              fontStyle: "italic",
            }}
          >
            Rx
          </div>
          <div style={{ fontSize: 30, color: "#8b949e" }}>실전 SaaS 처방전</div>
        </div>

        {/* 중앙: 헤드라인 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.15, color: "#ffffff" }}>
            인디 SaaS, 직접 써보고
          </div>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.15, color: "#ffffff" }}>
            <span style={{ color: "#5b8cff", marginRight: 24 }}>솔직하게</span>
            <span>처방합니다</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 30, color: "#aeb7c2" }}>
            리뷰 · 트래픽 임팩트 · GitHub 스타 추적
          </div>
        </div>

        {/* 하단 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, color: "#8b949e" }}>by 김성수 · 격주 발행</div>
          <div style={{ fontSize: 30, color: "#22c55e" }}>seungsu.com</div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
