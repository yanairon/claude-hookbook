import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Claude Hookbook", template: "%s - Claude Hookbook" },
  description:
    "Production-ready Claude Code hooks you can understand, combine, and export.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="wrap">
            <Link href="/" className="brand">
              Claude <span>Hookbook</span>
            </Link>
            <nav style={{ display: "flex", gap: 18 }}>
              <Link href="/hooks">Hooks</Link>
              <Link href="/generator">Generator</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>
        <main>
          <div className="wrap">{children}</div>
        </main>
        <footer className="site">
          <div className="wrap">
            Claude Hookbook - reviewed hooks for Claude Code. Hooks run code on
            your machine; read a hook before you install it. Not affiliated with
            Anthropic.
          </div>
        </footer>
      </body>
    </html>
  );
}
