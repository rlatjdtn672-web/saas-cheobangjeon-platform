import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { linkDetail } from "@/lib/links";
import LoginForm from "@/app/components/LoginForm";
import LinkDetailView from "@/app/components/LinkDetailView";

export const dynamic = "force-dynamic";
export const metadata = { title: "링크 통계 — 실전 SaaS 처방전", robots: { index: false } };

export default async function LinkDetailPage({ params }: { params: { code: string } }) {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) {
    return (
      <main className="relative min-h-screen">
        <LoginForm />
      </main>
    );
  }

  const detail = await linkDetail(pw, params.code);
  if (!detail || !detail.target_url) notFound();

  const host = headers().get("host") || "saas-cheobangjeon-platform.vercel.app";

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[240px]" />
      <div className="relative">
        <LinkDetailView detail={detail} origin={`https://${host}`} />
      </div>
    </main>
  );
}
