import Link from "next/link";
import { cookies } from "next/headers";
import { checkPassword, DASH_COOKIE } from "@/lib/auth";
import { postsAdmin } from "@/lib/blog";
import LoginForm from "@/app/components/LoginForm";
import BlogManager from "@/app/components/BlogManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "블로그 관리", robots: { index: false } };

export default async function BlogManagePage() {
  const pw = cookies().get(DASH_COOKIE)?.value;
  if (!pw || !checkPassword(pw)) {
    return (
      <main className="relative min-h-screen">
        <LoginForm />
      </main>
    );
  }
  const posts = await postsAdmin(pw);

  return (
    <main className="relative">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[220px]" />
      <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/blog" className="text-[13px] text-muted hover:text-white">
              ← 블로그
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-white">✏️ 블로그 관리</h1>
          </div>
          <Link href="/dashboard" className="text-xs text-muted hover:text-white">
            대시보드
          </Link>
        </div>
        <BlogManager posts={posts} />
      </div>
    </main>
  );
}
