"use client";

import { useMemo, useState } from "react";
import type { Hook } from "@/lib/hooks/schema";
import { buildSettings, parseExistingSettings } from "@/lib/hooks/merge";

export default function GeneratorClient({ hooks }: { hooks: Hook[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [existingText, setExistingText] = useState("");
  const [copied, setCopied] = useState(false);

  const chosen = useMemo(() => hooks.filter((h) => selected.has(h.slug)), [hooks, selected]);
  const { settings: parsedExisting, error: parseError } = useMemo(
    () => parseExistingSettings(existingText),
    [existingText],
  );
  const { settings, warnings } = useMemo(
    () => buildSettings(chosen, parsedExisting ?? null),
    [chosen, parsedExisting],
  );
  const json = useMemo(() => JSON.stringify(settings, null, 2), [settings]);

  const toggle = (slug: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const needsScripts = chosen.filter((h) => h.scriptBody);

  return (
    <div className="grid2">
      <div>
        <h2 style={{ marginTop: 0 }}>1. Pick hooks</h2>
        {hooks.map((h) => (
          <label key={h.slug} className={`gen-item ${selected.has(h.slug) ? "sel" : ""}`}>
            <input type="checkbox" checked={selected.has(h.slug)} onChange={() => toggle(h.slug)} />
            <span style={{ flex: 1 }}>
              <strong>{h.name}</strong>
              <span style={{ display: "block", fontSize: 12, color: "var(--muted)" }}>
                {h.event}
                {h.matcher ? ` / ${h.matcher}` : ""} - {h.oneLine}
              </span>
            </span>
          </label>
        ))}

        <h2>2. Existing settings (optional)</h2>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>
          Paste your current settings.json to merge without losing anything. Parsed locally in your browser - never uploaded.
        </p>
        <textarea
          rows={6}
          placeholder='{"hooks": { ... }}'
          value={existingText}
          onChange={(e) => setExistingText(e.target.value)}
        />
        {parseError && <div className="notice">{parseError}</div>}
      </div>

      <div>
        <h2 style={{ marginTop: 0 }}>3. Export</h2>
        {warnings.length > 0 && (
          <div className="notice">
            {warnings.map((w, i) => <div key={i} className="warnlist">{w}</div>)}
          </div>
        )}
        <pre style={{ maxHeight: 420, overflow: "auto" }}><code>{json}</code></pre>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="btn small"
            onClick={async () => {
              await navigator.clipboard.writeText(json);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy settings.json"}
          </button>
          <button
            className="btn small secondary"
            onClick={() => {
              const blob = new Blob([json], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "settings.json";
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            Download
          </button>
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
          Save as <code>.claude/settings.json</code> in your project (checked into the repo
          to share, or not), or <code>~/.claude/settings.json</code> to apply the hooks to every project.
          User-scope hooks and project hooks both run; project hooks add to user ones.
        </p>
        {needsScripts.length > 0 && (
          <div className="notice" style={{ borderColor: "var(--accent-2)", color: "var(--text)" }}>
            <strong>{needsScripts.length} selected hook{needsScripts.length > 1 ? "s" : ""} need{needsScripts.length > 1 ? "" : "s"} a script file.</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {needsScripts.map((h) => (
                <li key={h.slug} style={{ fontSize: 13 }}>
                  <code>{h.scriptPath}</code> - copy it from the <a href={`/hooks/${h.slug}`}>{h.name}</a> page and chmod +x it.
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
