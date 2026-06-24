"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/browser";
import ThemeToggle from "./ThemeToggle";

const TABS = [
  { title: "홈", path: "/" },
  { title: "블로그", path: "/blog" },
  { title: "리아영어", path: "/english" },
];

export default function SiteHeader() {
  const p = usePathname() || "/";
  const active = (path: string) => (path === "/" ? p === "/" : p.startsWith(path));

  // 공개 페이지 방문 집계 (세션·경로별 1회)
  useEffect(() => {
    const key = `scb-pv-${p}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    track("page_view");
  }, [p]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-2.5">
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="mr-2 font-bold text-white">
            seungsu<span className="text-accent">.</span>
          </Link>
          {TABS.map((t) => (
            <Link
              key={t.path}
              href={t.path}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                active(t.path)
                  ? "bg-white/5 font-semibold text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              {t.title}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
