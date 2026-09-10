import type { Metadata } from "next";
import { getAllHooks } from "@/lib/hooks/load";
import LibraryClient from "@/components/LibraryClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Hook library",
  description: "Search and browse reviewed Claude Code hooks by event, category, and risk.",
};

export default function HooksPage() {
  return (
    <>
      <h1>Hook library</h1>
      <p className="lede">Every hook lists its event, matcher, risk, and test status. Blocking hooks come with a recovery note.</p>
      <LibraryClient hooks={getAllHooks()} />
    </>
  );
}
