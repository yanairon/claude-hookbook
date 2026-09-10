import type { Metadata } from "next";
import { getAllHooks } from "@/lib/hooks/load";
import GeneratorClient from "@/components/GeneratorClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "settings.json generator",
  description: "Compose reviewed Claude Code hooks into one valid settings.json, with merge warnings and script checklists.",
};

export default function GeneratorPage() {
  return (
    <>
      <h1>Build your settings.json</h1>
      <p className="lede">
        Pick hooks, optionally paste your existing settings, export one merged JSON.
        Everything runs in your browser - nothing is uploaded.
      </p>
      <GeneratorClient hooks={getAllHooks()} />
    </>
  );
}
