import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHooksByCategory } from "@/lib/hooks/load";
import { CATEGORIES, CATEGORY_META, type HookCategory } from "@/lib/hooks/schema";
import HookCard from "@/components/HookCard";

export const dynamic = "force-static";

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug as HookCategory];
  if (!meta) return {};
  return { title: `${meta.title} hooks`, description: meta.blurb };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug as HookCategory];
  if (!meta) notFound();
  const hooks = getHooksByCategory(slug);
  return (
    <>
      <h1>{meta.title} hooks</h1>
      <p className="lede">{meta.blurb}</p>
      <div className="cards">
        {hooks.map((h) => <HookCard key={h.slug} hook={h} />)}
      </div>
    </>
  );
}
