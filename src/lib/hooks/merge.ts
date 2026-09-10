import { configFragmentFor, type HookEntry } from "./fragment.ts";
import type { Hook } from "./schema.ts";

export type ExistingSettings = Record<string, unknown>;

// Merge selected recipes under the single top-level `hooks` object:
// group by event, then by matcher; preserve multiple handlers; dedupe
// identical commands; never drop pre-existing entries from a pasted config.
export function buildSettings(
  selected: Hook[],
  existing?: ExistingSettings | null,
): { settings: ExistingSettings; warnings: string[] } {
  const warnings: string[] = [];
  const settings: ExistingSettings = existing ? structuredClone(existing) : {};
  const hooksRoot = (settings.hooks ?? {}) as Record<string, HookEntry[]>;
  settings.hooks = hooksRoot;

  const seenCommands = new Map<string, string>(); // command -> first hook name

  for (const hook of selected) {
    const { event, entry } = configFragmentFor(hook);
    const matcher = entry.matcher;
    const handler = entry.hooks[0];
    const command = handler.command;

    const prev = seenCommands.get(command);
    if (prev) {
      warnings.push(`"${hook.name}" adds the same command as "${prev}" - kept once.`);
      continue;
    }
    seenCommands.set(command, hook.name);

    const list = (hooksRoot[event] ??= []);
    let bucket = list.find((e) => (e.matcher ?? undefined) === matcher);
    if (!bucket) {
      bucket = matcher ? { matcher, hooks: [] } : { hooks: [] };
      list.push(bucket);
    }
    if (bucket.hooks.some((h) => h.command === command)) {
      warnings.push(`"${hook.name}" was already present under ${event} - kept once.`);
      continue;
    }
    bucket.hooks.push(handler);
  }

  // Flag contradictory blocking recipes on the same event+matcher.
  const byEventMatcher = new Map<string, Hook[]>();
  for (const hook of selected) {
    if (hook.failureMode !== "block") continue;
    const key = `${hook.event}::${hook.matcher ?? ""}`;
    byEventMatcher.set(key, [...(byEventMatcher.get(key) ?? []), hook]);
  }
  for (const [key, group] of byEventMatcher) {
    if (group.length > 1) {
      warnings.push(
        `Multiple blocking hooks on ${key.replace("::", " / ")} (${group
          .map((h) => h.name)
          .join(", ")}). They run in order; the first block wins.`,
      );
    }
  }

  return { settings, warnings };
}

export function parseExistingSettings(text: string): { settings?: ExistingSettings; error?: string } {
  if (!text.trim()) return { settings: {} };
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { error: "Settings must be a JSON object." };
    }
    return { settings: parsed as ExistingSettings };
  } catch (e) {
    return { error: `Invalid JSON: ${(e as Error).message}` };
  }
}
