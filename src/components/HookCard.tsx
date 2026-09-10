import Link from "next/link";
import type { Hook } from "@/lib/hooks/schema";
import Badges from "./Badges";

export default function HookCard({ hook }: { hook: Hook }) {
  return (
    <div className="card">
      <h3>
        <Link href={`/hooks/${hook.slug}`} style={{ color: "inherit" }}>
          {hook.name}
        </Link>
      </h3>
      <p>{hook.oneLine}</p>
      <Badges hook={hook} />
    </div>
  );
}
