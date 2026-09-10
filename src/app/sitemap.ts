import type { MetadataRoute } from "next";
import { getAllHooks } from "@/lib/hooks/load";
import { CATEGORIES } from "@/lib/hooks/schema";

const BASE = "https://claudehookbook.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const hooks = getAllHooks();
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/hooks`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/generator`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4 },
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/hooks/category/${c}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...hooks.map((h) => ({
      url: `${BASE}/hooks/${h.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
