import type { MetadataRoute } from "next";
import { getStore } from "@/lib/store";
import { listPublishedPosts } from "@/lib/blog";
import { SECTIONS } from "@/lib/sections";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let saas: { slug: string; publishedAt: string }[] = [];
  let posts: { slug: string; section: string; updated_at: string }[] = [];
  try {
    saas = await getStore().listSaas();
  } catch {}
  try {
    posts = (await listPublishedPosts()) as any;
  } catch {}
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/english`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/saas`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/lab`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...saas
      .filter((s) => s.slug !== "ai-lab") // /s/ai-lab 은 /lab 으로 리다이렉트되므로 제외
      .map((s) => ({
      url: `${SITE_URL}/s/${s.slug}`,
      lastModified: s.publishedAt ? new Date(s.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => {
      const path = (SECTIONS as any)[p.section]?.path ?? "/blog";
      return {
        url: `${SITE_URL}${path}/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }),
  ];
}
