import { getStore } from "@/lib/store";
import { listPublishedPosts } from "@/lib/blog";
import { NEWSLETTER } from "@/data/seed";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// llms.txt: LLM/AI 크롤러가 사이트 핵심 콘텐츠를 빠르게 파악하도록 돕는 안내 파일
// (제안 표준 — 강제는 아니지만 일부 도구가 참고)
export async function GET() {
  let saas: { name: string; slug: string; tagline: string }[] = [];
  let posts: { title: string; slug: string; excerpt: string | null }[] = [];
  try {
    saas = await getStore().listSaas();
  } catch {}
  try {
    posts = (await listPublishedPosts()) as any;
  } catch {}

  const lines = [
    `# 김성수 (Sungsu Kim) · ${SITE_URL}`,
    "",
    `> 삼성전자 AI 인프라 엔지니어. AI·인프라 블로그, 영어 학원 '리아영어', SaaS 리뷰(뉴스레터 '실전 SaaS 처방전')를 한곳에 모은 개인 사이트.`,
    "",
    "## 리뷰한 SaaS",
    ...saas.map((s) => `- [${s.name}](${SITE_URL}/s/${s.slug}): ${s.tagline}`),
    "",
    ...(posts.length
      ? ["## 블로그 글", ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? ": " + p.excerpt : ""}`), ""]
      : []),
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
