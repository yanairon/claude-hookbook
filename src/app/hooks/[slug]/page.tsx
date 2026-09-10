import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllHooks, getHook } from "@/lib/hooks/load";
import { configFragmentFor } from "@/lib/hooks/fragment";
import Badges from "@/components/Badges";
import CopyButton from "@/components/CopyButton";
import HookCard from "@/components/HookCard";
import WaitlistCard from "@/components/WaitlistCard";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllHooks().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hook = getHook(slug);
  if (!hook) return {};
  return { title: hook.seoTitle, description: hook.seoDescription };
}

function settingsJsonFor(slug: string) {
  const hook = getHook(slug)!;
  const { event, entry } = configFragmentFor(hook);
  return JSON.stringify({ hooks: { [event]: [entry] } }, null, 2);
}

export default async function HookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hook = getHook(slug);
  if (!hook) notFound();

  const settingsJson = settingsJsonFor(slug);
  const related = hook.relatedHooks
    .map((s) => getHook(s))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: hook.name,
    description: hook.oneLine,
    codeRepository: "https://github.com/yanairon/claude-hookbook",
    programmingLanguage: "Bash",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ fontSize: 13, color: "var(--muted)" }}>
        <Link href="/hooks">Hooks</Link> / <Link href={`/hooks/category/${hook.category[0]}`}>{hook.category[0]}</Link>
      </p>
      <h1>{hook.name}</h1>
      <p className="lede">{hook.oneLine}</p>
      <Badges hook={hook} />

      <h2>What it does</h2>
      <p style={{ maxWidth: 720 }}>{hook.description}</p>

      <h2>When it runs</h2>
      <table className="meta">
        <tbody>
          <tr><td>Event</td><td><code>{hook.event}</code></td></tr>
          {hook.matcher && <tr><td>Matcher</td><td><code>{hook.matcher}</code></td></tr>}
          <tr><td>Scope</td><td>{hook.scope === "either" ? "project or user" : hook.scope}</td></tr>
          <tr><td>Platforms</td><td>{hook.platforms.join(", ")}</td></tr>
          {hook.async && <tr><td>Async</td><td>runs in the background, reports on exit</td></tr>}
          {hook.timeout && <tr><td>Timeout</td><td>{hook.timeout}s</td></tr>}
          {hook.requires.length > 0 && <tr><td>Requires</td><td>{hook.requires.map((r) => <code key={r}>{r}</code>).reduce((a, b) => <>{a} {b}</>)}</td></tr>}
          <tr><td>Failure mode</td><td>{hook.failureMode}</td></tr>
          <tr><td>Verified against</td><td>{hook.verifiedAgainst}</td></tr>
          <tr><td>Test status</td><td>{hook.testStatus === "tested" ? `tested${hook.lastTestedAt ? ` on ${hook.lastTestedAt}` : ""}` : "needs manual check - run the test steps below before relying on it"}</td></tr>
        </tbody>
      </table>

      <h2>Config</h2>
      <p style={{ color: "var(--muted)", fontSize: 14 }}>
        Merge this into <code>.claude/settings.json</code>
        {hook.scope !== "project" && <> (or <code>~/.claude/settings.json</code> for user scope)</>} - or use the <Link href="/generator">generator</Link> to combine hooks.
      </p>
      <pre><code>{settingsJson}</code></pre>
      <CopyButton text={settingsJson} label="Copy config JSON" />

      {hook.scriptBody && (
        <>
          <h2>Script</h2>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Save as <code>{hook.scriptPath}</code> and <code>chmod +x</code> it.
          </p>
          <pre><code>{hook.scriptBody}</code></pre>
          <CopyButton text={hook.scriptBody} label="Copy script" />
        </>
      )}

      <h2>Install</h2>
      <ol>{hook.installSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>

      <h2>Test it</h2>
      <ul>{hook.testSteps.map((s, i) => <li key={i}>{s}</li>)}</ul>

      {hook.recoveryNote && (
        <>
          <h2>If it blocks something you wanted</h2>
          <p style={{ maxWidth: 720 }}>{hook.recoveryNote}</p>
        </>
      )}

      <h2>Sources</h2>
      <ul>
        {hook.sources.map((s) => (
          <li key={s.url}><a href={s.url}>{s.title}</a> <span style={{ color: "var(--muted)", fontSize: 13 }}>(checked {s.checkedAt})</span></li>
        ))}
      </ul>

      {related.length > 0 && (
        <>
          <h2>Related hooks</h2>
          <div className="cards">{related.map((h) => <HookCard key={h.slug} hook={h} />)}</div>
        </>
      )}

      <WaitlistCard />
    </>
  );
}
