import Link from "next/link";
import { getAllHooks } from "@/lib/hooks/load";
import { CATEGORIES, CATEGORY_META } from "@/lib/hooks/schema";
import HookCard from "@/components/HookCard";
import WaitlistCard from "@/components/WaitlistCard";

export const dynamic = "force-static";

const FEATURED = [
  "prettier-after-edit",
  "protect-env-secrets",
  "block-destructive-commands",
  "secret-scan-changed-files",
  "run-nearest-test",
  "notify-input-needed",
];

export default function Home() {
  const hooks = getAllHooks();
  const featured = FEATURED.map((s) => hooks.find((h) => h.slug === s)!).filter(Boolean);

  return (
    <>
      <h1>Production-ready Claude Code hooks you can understand, combine, and export.</h1>
      <p className="lede">
        A reviewed library of copy-ready hooks for Claude Code, plus a generator
        that composes them into one valid settings.json. Every hook says when it
        runs, what it needs, what it risks, and how to test it.
      </p>
      <p style={{ margin: "22px 0" }}>
        <Link className="btn" href="/generator">Build your settings.json</Link>{" "}
        <Link className="btn secondary" href="/hooks">Browse the library</Link>
      </p>

      <h2>Featured hooks</h2>
      <div className="cards">
        {featured.map((h) => <HookCard key={h.slug} hook={h} />)}
      </div>

      <h2>Categories</h2>
      <div className="chips">
        {CATEGORIES.map((c) => (
          <Link key={c} className="chip" href={`/hooks/category/${c}`}>
            {CATEGORY_META[c].title} ({hooks.filter((h) => h.category.includes(c)).length})
          </Link>
        ))}
      </div>

      <WaitlistCard />
    </>
  );
}
