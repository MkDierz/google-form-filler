# google-form-filler

Serverless web tool that parses Google Forms internal metadata JSON into a structured form schema and generates pre-filled Google Forms URLs. The entire app runs in the browser — no backend required — so it can be hosted on GitHub Pages (or any static host).

## Use it

Serve `public/index.html` as a static page (see deployment below), or run locally:

```bash
bun run server.ts     # optional local static server
```

Open http://localhost:3000. Paste the form metadata, fill the table (one row per submission), import/export CSV, and generate pre-filled URLs.

**Getting the metadata:** open the Google Form in a browser, open the console (F12), and run:

```js
copy(JSON.stringify(FB_PUBLIC_LOAD_DATA_))
```

Paste the clipboard contents into the web UI (or use the `examples/` JSON files).

## Deploy to GitHub Pages

A workflow (`.github/workflows/deploy-pages.yml`) publishes the `public/` directory to GitHub Pages on every push to `main`.

1. Push to GitHub.
2. In the repo → **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually via Actions → Deploy to GitHub Pages → Run workflow). The site is served at `https://<user>.github.io/<repo>/`.

Because the app needs no server, it works fully serverless.

## CLI (optional)

`lib/parse.ts` is TypeScript; for the CLI:

```bash
bun run index.ts --metadata examples/form-metadata-1.json
```

Prints the parsed `FormSchema` (form id, form name, and each section's id, type, options, and required status).

## Project layout

- `public/index.html` — the single-file web interface (vanilla JS, no build step). Contains the in-browser parser; this is what GitHub Pages serves.
- `lib/parse.ts` — the TypeScript parser (`parseFormMetadata`) + `QuestionType` types (source of truth for the parsing logic).
- `lib/urls.ts` — pre-fill base URL (`https://docs.google.com/forms/d/{FORM_ID}/viewform`) + entry query param builders.
- `index.ts` — CLI entry (Node/Bun only, not part of the static site).
- `server.ts` — optional local static file server (not needed for deployment).
- `examples/` — sample Google Form metadata.

> Note: `lib/*.ts`, `index.ts`, and `server.ts` require Bun/TS tooling and are only for local dev/CLI. The deployed static site is `public/index.html` alone.
