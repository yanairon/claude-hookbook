import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About and editorial policy",
  description: "How Claude Hookbook sources, reviews, and labels hooks.",
};

export default function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p className="lede">
        Claude Hookbook is a reviewed library of Claude Code hooks plus a generator
        that composes them into settings.json. It is not affiliated with Anthropic.
      </p>

      <h2>Editorial policy</h2>
      <ul style={{ maxWidth: 720 }}>
        <li>Every hook names its event, matcher, risk level, and source links with the date they were last checked.</li>
        <li>No hook ships from a plausible snippet alone. A hook gets the <strong>tested</strong> badge only after a config-lint, an install in a disposable repo, a positive trigger test, a negative non-trigger test, and a documented failure behavior.</li>
        <li>Hooks marked <strong>needs manual check</strong> have docs-verified event and matcher semantics but have not completed the full test pass against the current Claude Code release. The test steps are on the page - run them before relying on the hook.</li>
        <li>Blocking hooks always carry a recovery note.</li>
        <li>Hooks run code on your machine. Read a hook before you install it; that is why every script is printed in full.</li>
      </ul>

      <h2>Scope</h2>
      <p style={{ maxWidth: 720 }}>
        Project scope (<code>.claude/settings.json</code>) applies to one repo and can be
        checked in to share with a team. User scope (<code>~/.claude/settings.json</code>)
        applies to every project on your machine. Both run together; project hooks add
        to user hooks.
      </p>

      <h2>Contact</h2>
      <p>
        Found a broken hook or have one worth reviewing? Open an issue on the{" "}
        <a href="https://github.com/yanairon/claude-hookbook">GitHub repo</a>, or browse the{" "}
        <Link href="/hooks">library</Link>.
      </p>
    </>
  );
}
