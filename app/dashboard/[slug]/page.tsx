import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { fetchSaasMetrics } from "@/lib/dashboard";
import LoginForm from "@/app/components/LoginForm";
import SaasDashboardView from "@/app/components/SaasDashboardView";

export const dynamic = "force-dynamic";
export const metadata = { title: "SaaS 상세 대시보드", robots: { index: false } };

export default async function SaasDashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) {
    return (
      <main className="relative min-h-screen">
        <LoginForm />
      </main>
    );
  }

  const m = await fetchSaasMetrics(pw, params.slug);
  if (!m) notFound();

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[260px]" />
      <div className="relative">
        <SaasDashboardView m={m} />
      </div>
    </main>
  );
}
