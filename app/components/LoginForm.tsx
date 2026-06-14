"use client";

import { useState } from "react";

export default function LoginForm() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (r.ok) window.location.reload();
    else setErr(true);
  }

  return (
    <div className="mx-auto mt-24 max-w-sm px-5">
      <h1 className="text-center text-xl font-bold text-white">🔒 유입 대시보드</h1>
      <p className="mt-2 text-center text-sm text-muted">비밀번호를 입력하세요.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-16 text-sm text-white outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-2 my-auto h-7 rounded-md px-2 text-xs text-muted transition hover:text-white"
            tabIndex={-1}
          >
            {show ? "숨기기" : "보기"}
          </button>
        </div>
        {err && <p className="text-xs text-red-400">비밀번호가 올바르지 않습니다.</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/85 disabled:opacity-60"
        >
          {loading ? "확인 중…" : "들어가기"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-muted">
        <a href="/" className="hover:text-white">
          ← 공개 페이지로
        </a>
      </p>
    </div>
  );
}
