# AGENTS.md

## Project overview

Bun + TypeScript project that parses Google Form metadata JSON and generates pre-filled form URLs. **Serverless**: the web app is a single static HTML file that runs entirely in the browser (parser is inlined in `public/index.html`), deployed to GitHub Pages. Bun/TS source (`lib/`, `index.ts`, `server.ts`) is only for local dev/CLI. No tests, no lint, no CI (besides the Pages deploy workflow).

## Commands

```bash
bun install          # install deps
bun run server.ts    # optional local static server at http://localhost:3000 (PORT env to override)
bun run start        # alias for bun run server.ts
bun run index.ts --metadata examples/form-metadata-1.json   # CLI: print parsed FormSchema
bunx tsc --noEmit    # typecheck (no tsconfig compile; noEmit is set)
```

No `lint` or `test` targets exist.

## Key files

- `public/index.html` — the ENTIRE deployed web UI (vanilla JS + CSS, no build step). Contains an inline copy of the metadata parser + CSV/table/URL logic. This is the single file GitHub Pages serves.
- `lib/parse.ts` — TypeScript parser `parseFormMetadata` + `QuestionType` type map; **source of truth** for the parsing logic
- `lib/urls.ts` — prefill base URL + entry query param builders
- `index.ts` — CLI entry (Node/Bun only)
- `server.ts` — optional local static file server
- `.github/workflows/deploy-pages.yml` — GitHub Actions that publishes `public/` to GitHub Pages on push to `main`
- `examples/form-metadata-1.json`, `examples/form-metadata-2.json` — sample metadata (deeply nested arrays)
- `tsconfig.json` — strict mode, `noUncheckedIndexedAccess: true`, `noEmit`

## Important: two copies of the parser

The parsing logic exists **twice**: typed in `lib/parse.ts` (TS) and inlined as plain JS in `public/index.html` (because the static site has no bundler). **If you change parsing, update BOTH** or the deployed site and the CLI/API will diverge.

## Gotchas

- The metadata JSON is a raw Google Forms internal format (nested arrays with magic indices). Field access like `[14]` (form id path, e.g. `e/1FAIpQLS...`), `[3]` (form name), `entry[3]` (question type), `entry[4]?.[0]` (detail: id, options, isRequired) maps to specific positions — do not restructure without understanding the schema. Keep magic-index access only in `lib/parse.ts` and the inline copy in `public/index.html`.
- `QuestionType` values (from metadata `entry[3]`): `9` = `date`, `10` = `time`, `2`/`3` = choice, `5` = linear_scale, etc. The UI renders `<input type="date">` for `date`, `<input type="time">` for `time`, a `<select>` when `options` exist, else a text input.
- `verbatimModuleSyntax: true` in tsconfig — imports must use full `.ts` extensions to match runtime.
- The deployed site (`public/index.html`) inherits the type map statically; keep `TYPE_MAP` in sync with `typeMap` in `lib/parse.ts`.
- Metadata comes from the browser console via `copy(JSON.stringify(FB_PUBLIC_LOAD_DATA_))` (shown in the UI).
- `req.json()` in Bun returns `unknown`; cast the body before indexing (relevant if re-adding an API).
