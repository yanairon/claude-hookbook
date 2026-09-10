import type { Hook } from "@/lib/hooks/schema";

export default function Badges({ hook }: { hook: Hook }) {
  return (
    <span className="badges">
      <span className="badge event">{hook.event}</span>
      {hook.matcher && <span className="badge">{hook.matcher}</span>}
      <span className={`badge ${hook.risk}`}>{hook.risk} risk</span>
      <span className={`badge ${hook.testStatus}`}>
        {hook.testStatus === "tested" ? "tested" : "needs manual check"}
      </span>
    </span>
  );
}
