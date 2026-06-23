import { cookies, headers } from "next/headers";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { listLinks } from "@/lib/links";
import LoginForm from "@/app/components/LoginForm";
import LinksManager from "@/app/components/LinksManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "단축 링크 — seungsu.com", robots: { index: false } };

export default async function LinksPage() {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) {
    return (
      <main className="relative min-h-screen">
        <LoginForm />
      </main>
    );
  }

  const links = await listLinks(pw);
  const host = headers().get("host") || "saas-cheobangjeon-platform.vercel.app";
  const origin = `https://${host}`;

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[260px]" />
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <a href="/dashboard" className="text-[13px] text-muted hover:text-white">
              ← 대시보드
            </a>
            <h1 className="mt-2 text-2xl font-bold text-white">🔗 단축 링크</h1>
            <p className="text-xs text-muted">
              짧은 링크로 1:1 리다이렉트하며 중간에서 클릭(접속)을 집계합니다.
            </p>
          </div>
        </div>
        <div className="mt-7">
          <LinksManager links={links} origin={origin} />
        </div>
      </div>
    </main>
  );
}
