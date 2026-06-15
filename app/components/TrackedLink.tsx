"use client";

import { track } from "@/lib/browser";

// 클릭 시 이벤트(출처 포함)를 기록한 뒤 새 탭으로 이동.
export default function TrackedLink({
  href,
  type,
  saasId,
  target,
  className,
  children,
  rel = "noopener noreferrer",
}: {
  href: string;
  type: "website_click" | "review_click" | "github_click";
  saasId: string;
  target?: string; // 어떤 링크인지(예: 'GitHub','사이트','Doc','뉴스레터', 링크 라벨)
  className?: string;
  children: React.ReactNode;
  rel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={() => track(type, saasId, target)}
    >
      {children}
    </a>
  );
}
