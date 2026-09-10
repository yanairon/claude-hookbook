import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSettings, parseExistingSettings } from "../src/lib/hooks/merge.ts";
import type { Hook } from "../src/lib/hooks/schema.ts";

function mkHook(over: Partial<Hook>): Hook {
  return {
    slug: "x", name: "X", oneLine: "", description: "", category: ["safety"],
    tags: [], event: "PreToolUse", matcher: "Bash", handlerType: "command",
    command: "run-x", scope: "project", platforms: ["linux"], requires: [],
    risk: "low", failureMode: "observe", parameters: [], installSteps: ["i"],
    testSteps: ["t"], sources: [{ title: "s", url: "https://example.com", type: "original", checkedAt: "2026-09-10" }],
    verifiedAgainst: "docs", testStatus: "needs-manual-check",
    seoTitle: "", seoDescription: "", relatedHooks: [],
    ...over,
  };
}

test("groups handlers by event and matcher", () => {
  const a = mkHook({ slug: "a", name: "A", command: "run-a" });
  const b = mkHook({ slug: "b", name: "B", command: "run-b" });
  const { settings, warnings } = buildSettings([a, b]);
  assert.deepEqual(warnings, []);
  const groups = (settings.hooks as any).PreToolUse;
  assert.equal(groups.length, 1); // same event+matcher bucket
  assert.equal(groups[0].matcher, "Bash");
  assert.deepEqual(groups[0].hooks.map((h: any) => h.command), ["run-a", "run-b"]);
});

test("different matchers stay in separate buckets", () => {
  const a = mkHook({ slug: "a", name: "A", command: "run-a", matcher: "Bash" });
  const b = mkHook({ slug: "b", name: "B", command: "run-b", matcher: "Edit|Write" });
  const { settings } = buildSettings([a, b]);
  assert.equal((settings.hooks as any).PreToolUse.length, 2);
});

test("dedupes identical commands with a warning", () => {
  const a = mkHook({ slug: "a", name: "A", command: "same" });
  const b = mkHook({ slug: "b", name: "B", command: "same" });
  const { settings, warnings } = buildSettings([a, b]);
  assert.equal(warnings.length, 1);
  assert.equal((settings.hooks as any).PreToolUse[0].hooks.length, 1);
});

test("flags multiple blocking hooks on the same event+matcher", () => {
  const a = mkHook({ slug: "a", name: "A", command: "a", failureMode: "block" });
  const b = mkHook({ slug: "b", name: "B", command: "b", failureMode: "block" });
  const { warnings } = buildSettings([a, b]);
  assert.ok(warnings.some((w) => w.includes("Multiple blocking hooks")));
});

test("preserves pre-existing settings and never drops entries", () => {
  const existing = {
    model: "opus",
    hooks: { PreToolUse: [{ matcher: "Bash", hooks: [{ type: "command", command: "mine" }] }] },
  };
  const a = mkHook({ slug: "a", name: "A", command: "run-a" });
  const { settings } = buildSettings([a], existing);
  assert.equal(settings.model, "opus");
  const bucket = (settings.hooks as any).PreToolUse[0];
  assert.deepEqual(bucket.hooks.map((h: any) => h.command), ["mine", "run-a"]);
  // existing object not mutated
  assert.equal((existing.hooks.PreToolUse[0].hooks as any[]).length, 1);
});

test("no-matcher hooks merge into the no-matcher bucket", () => {
  const a = mkHook({ slug: "a", name: "A", command: "run-a", event: "Stop", matcher: undefined });
  const { settings } = buildSettings([a]);
  const groups = (settings.hooks as any).Stop;
  assert.equal(groups.length, 1);
  assert.equal(groups[0].matcher, undefined);
  assert.equal(groups[0].hooks[0].command, "run-a");
});

test("parseExistingSettings validates input", () => {
  assert.ok(parseExistingSettings("").settings);
  assert.ok(parseExistingSettings("{}").settings);
  assert.ok(parseExistingSettings("{nope").error);
  assert.ok(parseExistingSettings("[1]").error);
});
