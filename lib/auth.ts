import "server-only";
import { createHash } from "crypto";

// 유입 대시보드 비밀번호.
// 평문을 공개 repo에 커밋하지 않도록 SHA-256 해시로 검증한다.
// Vercel 환경변수 DASHBOARD_PASSWORD 를 설정하면 그 값으로 바꿀 수 있다.
const PASSWORD_SHA256 =
  "01c2de66b42a22657854ec9a3d4619dc343f6bdd3a4c1e3b7ca18546a928b641";

export const DASH_COOKIE = "scb_dash";

export function checkPassword(input: string): boolean {
  if (!input) return false;
  const envPw = process.env.DASHBOARD_PASSWORD;
  if (envPw) return input === envPw;
  const hash = createHash("sha256").update(input, "utf8").digest("hex");
  return hash === PASSWORD_SHA256;
}
