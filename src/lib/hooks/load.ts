import fs from "node:fs";
import path from "node:path";
import { hookSchema, type Hook } from "./schema.ts";

const CONTENT_DIR = path.join(process.cwd(), "content", "hooks");

let cache: Hook[] | null = null;

export function getAllHooks(): Hook[] {
  if (cache) return cache;
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  const hooks = files.map((f) => {
    const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"));
    const parsed = hookSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid hook content file ${f}: ${parsed.error.message}`);
    }
    if (parsed.data.slug !== f.replace(/\.json$/, "")) {
      throw new Error(`Slug mismatch in ${f}: slug field is ${parsed.data.slug}`);
    }
    return parsed.data;
  });
  hooks.sort((a, b) => a.name.localeCompare(b.name));
  cache = hooks;
  return hooks;
}

export function getHook(slug: string): Hook | undefined {
  return getAllHooks().find((h) => h.slug === slug);
}

export function getHooksByCategory(category: string): Hook[] {
  return getAllHooks().filter((h) => h.category.includes(category as Hook["category"][number]));
}

export { configFragmentFor } from "./fragment.ts";
