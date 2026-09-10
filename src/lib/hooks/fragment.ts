import type { Hook } from "./schema.ts";

export interface HookHandler {
  type: "command";
  command: string;
  timeout?: number;
  async?: boolean;
}

export interface HookEntry {
  matcher?: string;
  hooks: HookHandler[];
}

// The exact settings.json fragment a hook contributes, built from the
// canonical fields so the SEO page and the generator can never drift.
// Isomorphic: no node builtins, safe for client bundles.
export function configFragmentFor(hook: Hook): { event: Hook["event"]; entry: HookEntry } {
  const handler: HookHandler = {
    type: "command",
    command: hook.command,
  };
  if (hook.timeout !== undefined) handler.timeout = hook.timeout;
  if (hook.async !== undefined) handler.async = hook.async;
  const entry: HookEntry = { hooks: [handler] };
  if (hook.matcher) entry.matcher = hook.matcher;
  return { event: hook.event, entry };
}
