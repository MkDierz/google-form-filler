# AGENTS.md

## Project overview

Bun + TypeScript tool that parses Google Form metadata JSON and generates pre-filled form URLs. Has a web interface (Bun server + single-file HTML frontend). No tests, no lint, no CI.

## Commands

```bash
bun install          # install deps
bun run server.ts    # start web UI at http://localhost:3000 (PORT env to override)
bun run start        # alias for bun run server.ts
bun run index.ts --metadata examples/form-metadata-1.json   # CLI: print parsed FormSchema
bunx tsc --noEmit    # typecheck (no tsconfig compile; noEmit is set)
```

No `lint` or `test` targets exist.

## Key files

- `index.ts` — CLI entry; reads metadata via `--metadata`, prints the parsed `FormSchema`
- `lib/parse.ts` — the parser (`parseFormMetadata`); `FormSchema`/`Section` interfaces live here (shared by CLI + server)
- `lib/urls.ts` — prefill base URL + entry query param builders
- `server.ts` — Bun server serving `public/` and POST `/api/parse` (body: `{ metadata: <json> }` or `{ json: <string> }`)
- `public/index.html` — the entire web UI (vanilla JS + CSS, no build step)
- `examples/form-metadata-1.json`, `form-metadata-2.json` — sample Google Form metadata (deeply nested arrays, not typed)
- `tsconfig.json` — strict mode, `noUncheckedIndexedAccess: true`, `noEmit`

## Gotchas

- The metadata JSON is a raw Google Forms internal format (nested arrays with magic indices). Field access like `[14]` (form id path, e.g. `e/1FAIpQLS...`), `[3]` (form name), `entry[4]?.[0]` maps to specific positions — do not restructure without understanding the schema. Keep all magic-index access inside `lib/parse.ts`; consumers only see the typed `FormSchema`.
- `verbatimModuleSyntax: true` in tsconfig — imports must match runtime behavior (use full `.ts` extensions).
- `req.json()` in Bun returns `unknown`; cast the body before indexing.
- The `FORM_ID` from metadata `[14]` already includes the `e/` prefix, so the base URL is `https://docs.google.com/forms/d/{formId}/viewform`.
- Metadata comes from the browser console via `copy(JSON.stringify(FB_PUBLIC_LOAD_DATA_))` (shown in the UI).
