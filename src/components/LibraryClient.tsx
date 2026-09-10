"use client";

import { useMemo, useState } from "react";
import HookCard from "./HookCard";
import { CATEGORY_META, type Hook, type HookCategory } from "@/lib/hooks/schema";

export default function LibraryClient({ hooks }: { hooks: Hook[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [event, setEvent] = useState<string>("");
  const [risk, setRisk] = useState<string>("");

  const events = useMemo(() => [...new Set(hooks.map((h) => h.event))].sort(), [hooks]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return hooks.filter((h) => {
      if (cat && !h.category.includes(cat as HookCategory)) return false;
      if (event && h.event !== event) return false;
      if (risk && h.risk !== risk) return false;
      if (!needle) return true;
      return [h.name, h.oneLine, h.description, h.event, h.matcher ?? "", ...h.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [hooks, q, cat, event, risk]);

  return (
    <>
      <input
        type="search"
        placeholder="Search hooks (prettier, secrets, notify, test...)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 480 }}
      />
      <div className="filters">
        <div>
          <label>Category</label>
          <div className="chips" style={{ margin: 0 }}>
            <button className={`chip ${cat === "" ? "on" : ""}`} onClick={() => setCat("")}>All</button>
            {Object.entries(CATEGORY_META).map(([slug, meta]) => (
              <button key={slug} className={`chip ${cat === slug ? "on" : ""}`} onClick={() => setCat(slug)}>
                {meta.title}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label>Event</label>
          <select value={event} onChange={(e) => setEvent(e.target.value)}>
            <option value="">All</option>
            {events.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label>Risk</label>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option value="">All</option>
            <option value="low">low</option>
            <option value="review">review</option>
            <option value="blocking">blocking</option>
          </select>
        </div>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>{filtered.length} of {hooks.length} hooks</p>
      <div className="cards">
        {filtered.map((h) => <HookCard key={h.slug} hook={h} />)}
      </div>
    </>
  );
}
