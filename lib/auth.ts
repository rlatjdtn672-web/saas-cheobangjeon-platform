import "server-only";
import { createHash } from "crypto";

// 유입 대시보드 비밀번호.
// 평문을 공개 repo에 커밋하지 않도록 SHA-256 해시로 검증한다.
// Vercel 환경변수 DASHBOARD_PASSWORD 를 설정하면 그 값으로 바꿀 수 있다.
const PASSWORD_SHA256 =
  "bf715c6827407338a81bbaeb6cd4c66dcd2a7661d22630054b375303b0f33fe7";

export const DASH_COOKIE = "scb_dash";
export const DASH_TOKEN = "scb-ok-2026"; // 쿠키에 저장되는 인증 토큰

export function checkPassword(input: string): boolean {
  if (!input) return false;
  const envPw = process.env.DASHBOARD_PASSWORD;
  if (envPw) return input === envPw;
  const hash = createHash("sha256").update(input, "utf8").digest("hex");
  return hash === PASSWORD_SHA256;
}
