import { getStore } from "@/lib/store";
import { NEWSLETTER } from "@/data/seed";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// llms.txt: LLM/AI 크롤러가 사이트 핵심 콘텐츠를 빠르게 파악하도록 돕는 안내 파일
// (제안 표준 — 강제는 아니지만 일부 도구가 참고)
export async function GET() {
  let saas: { name: string; slug: string; tagline: string }[] = [];
  try {
    saas = await getStore().listSaas();
  } catch {}

  const lines = [
    `# 실전 SaaS 처방전 (${SITE_URL})`,
    "",
    `> ${NEWSLETTER.bio} 작성자 ${NEWSLETTER.author}. ${NEWSLETTER.cadence}.`,
    "",
    "## 리뷰한 SaaS",
    ...saas.map((s) => `- [${s.name}](${SITE_URL}/s/${s.slug}): ${s.tagline}`),
    "",
    "## 더보기",
    `- [홈 · 리뷰 목록](${SITE_URL})`,
    `- [LinkedIn 뉴스레터](${NEWSLETTER.newsletterUrl})`,
    `- 리뷰 문의: ${NEWSLETTER.contactEmail}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
