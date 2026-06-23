import type { MetadataRoute } from "next";
import { getStore } from "@/lib/store";
import { listPublishedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let saas: { slug: string; publishedAt: string }[] = [];
  let posts: { slug: string; updated_at: string }[] = [];
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
    ...saas.map((s) => ({
      url: `${SITE_URL}/s/${s.slug}`,
      lastModified: s.publishedAt ? new Date(s.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
