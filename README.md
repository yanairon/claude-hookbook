# Claude Hookbook

Production-ready Claude Code hooks you can understand, combine, and export.

A static Next.js site: a reviewed hooks library (`/hooks`, `/hooks/[slug]`,
`/hooks/category/[slug]`) plus an in-browser settings.json generator
(`/generator`). Content lives in `content/hooks/*.json` - one file per hook,
validated at build time by the Zod schema in `src/lib/hooks/schema.ts`.

## Develop

```bash
npm install
npm run dev
npm run build   # validates every content file against the schema
```

## Content model

Each hook JSON carries: identity (slug/name/oneLine/description), routing
(event, matcher, category, tags), the canonical command plus optional companion
script (scriptPath/scriptBody), operational facts (timeout, async, scope,
platforms, requires, risk, failureMode), prose (installSteps, testSteps,
recoveryNote), provenance (sources with checkedAt, verifiedAgainst), and the
test badge (testStatus: tested | needs-manual-check).

The single-hook page and the generator both build the settings fragment from
the same canonical fields (`configFragmentFor`), so they cannot drift.

Editorial rule: `tested` only after a real install + positive/negative trigger
run against the current Claude Code release. Until then a hook ships as
`needs-manual-check` with test steps on its page.

## Waitlist

The Pro Pack waitlist card is dormant unless
`NEXT_PUBLIC_WAITLIST_ENDPOINT` is set to a form endpoint (Buttondown,
Formspree, or your own API). No backend ships in v1.

## Deploy

Static-friendly (all routes `force-static`, `generateStaticParams` for dynamic
pages). Deploys on Vercel with zero config.
