import { cookies } from "next/headers";
import { getStore } from "@/lib/store";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { fetchDashboard } from "@/lib/dashboard";
import LoginForm from "@/app/components/LoginForm";
import DashboardView from "@/app/components/DashboardView";

export const dynamic = "force-dynamic";
export const metadata = { title: "유입 대시보드 — 실전 SaaS 처방전", robots: { index: false } };

export default async function DashboardPage() {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) {
    return (
      <main className="relative min-h-screen">
        <LoginForm />
      </main>
    );
  }

  const [data, saasList] = await Promise.all([fetchDashboard(pw), getStore().listSaas()]);
  const saasLite = saasList.map((s) => ({ id: s.id, name: s.name, slug: s.slug }));

  if (!data) {
    return (
      <main className="relative min-h-screen">
        <LoginForm />
      </main>
    );
  }

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[300px]" />
      <div className="relative">
        <DashboardView data={data} saas={saasLite} />
      </div>
    </main>
  );
}
