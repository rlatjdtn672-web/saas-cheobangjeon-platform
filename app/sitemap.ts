import type { MetadataRoute } from "next";
import { getStore } from "@/lib/store";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let saas: { slug: string; publishedAt: string }[] = [];
  try {
    saas = await getStore().listSaas();
  } catch {
    saas = [];
  }
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...saas.map((s) => ({
      url: `${SITE_URL}/s/${s.slug}`,
      lastModified: s.publishedAt ? new Date(s.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
