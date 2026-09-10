import { z } from "zod";

export const HOOK_EVENTS = [
  "PreToolUse",
  "PostToolUse",
  "PostToolUseFailure",
  "Notification",
  "SessionStart",
  "Stop",
  "SubagentStop",
  "TaskCompleted",
] as const;

export const CATEGORIES = [
  "formatting",
  "safety",
  "testing",
  "notifications",
  "context",
  "workflow",
] as const;

export const hookSourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  type: z.enum(["official-docs", "official-repo", "community", "original"]),
  checkedAt: z.string(), // ISO date the source was last re-checked
});

export const hookParameterSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
  default: z.string(),
  // allowlisted validation: simple regex the generator applies before emitting
  validateRegex: z.string().optional(),
});

export const hookSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  oneLine: z.string(),
  description: z.string(),
  category: z.array(z.enum(CATEGORIES)).min(1),
  tags: z.array(z.string()).default([]),
  event: z.enum(HOOK_EVENTS),
  // Omit where the event does not support matchers. Never fake an empty one.
  matcher: z.string().optional(),
  handlerType: z.literal("command"),
  // Canonical command emitted into settings.json. For script-backed hooks this
  // is the invocation of scriptPath; the script itself lives in scriptBody.
  command: z.string(),
  scriptPath: z.string().optional(), // e.g. .claude/hooks/protect-env.sh
  scriptBody: z.string().optional(),
  timeout: z.number().int().positive().optional(),
  async: z.boolean().optional(),
  scope: z.enum(["project", "user", "either"]),
  platforms: z.array(z.enum(["macos", "linux", "windows"])).min(1),
  requires: z.array(z.string()).default([]), // external binaries: jq, prettier...
  risk: z.enum(["low", "review", "blocking"]),
  failureMode: z.enum(["observe", "warn", "block"]),
  parameters: z.array(hookParameterSchema).default([]),
  installSteps: z.array(z.string()).min(1),
  testSteps: z.array(z.string()).min(1),
  recoveryNote: z.string().optional(), // required for blocking hooks
  sources: z.array(hookSourceSchema).min(1),
  verifiedAgainst: z.string(), // docs version/date the event semantics were checked against
  testStatus: z.enum(["tested", "needs-manual-check"]),
  lastTestedAt: z.string().optional(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  relatedHooks: z.array(z.string()).default([]),
});

export type Hook = z.infer<typeof hookSchema>;
export type HookEvent = (typeof HOOK_EVENTS)[number];
export type HookCategory = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<HookCategory, { title: string; blurb: string }> = {
  formatting: { title: "Formatting", blurb: "Run formatters on files right after Claude edits them." },
  safety: { title: "Safety", blurb: "Block destructive commands, protect secrets, and keep writes inside the repo." },
  testing: { title: "Testing", blurb: "Run tests and typechecks around edits and task completion." },
  notifications: { title: "Notifications", blurb: "Get pinged when Claude needs input or finishes." },
  context: { title: "Context", blurb: "Re-inject project state at session start and after compaction." },
  workflow: { title: "Workflow", blurb: "Audit trails, failure logs, and session bookkeeping." },
};
