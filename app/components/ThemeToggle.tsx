"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      onClick={toggle}
      title={theme === "dark" ? "라이트 모드로" : "다크 모드로"}
      className="rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted transition hover:text-white"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
