# google-form-filler

Bun + TypeScript tool that parses Google Forms internal metadata JSON into a structured form schema and generates pre-filled Google Forms URLs. Includes a web interface.

## Setup

```bash
bun install
```

## Web interface (recommended)

```bash
bun run server.ts
# or: npm start style alias
# bun run start
```

Open http://localhost:3000. Paste the form metadata, fill the table (one row per submission), import/export CSV, and generate pre-filled URLs.

**Getting the metadata:** open the Google Form in a browser, open the console (F12), and run:

```js
copy(JSON.stringify(FB_PUBLIC_LOAD_DATA_))
```

Paste the clipboard contents into the web UI (or use the `examples/` JSON files).

## CLI

```bash
bun run index.ts --metadata examples/form-metadata-1.json
```

Prints the parsed `FormSchema` (form id, form name, and each section's id, options, and required status).

## How it works

- `lib/parse.ts` — parses the raw metadata (deeply nested arrays) into a typed `FormSchema`.
- `lib/urls.ts` — builds the pre-filled URL base (`https://docs.google.com/forms/d/{FORM_ID}/viewform`) and entry query params (`?usp=pp_url&entry.{id}={value}`).
- `server.ts` — serves the web UI and a POST `/api/parse` endpoint.
- `public/index.html` — the single-file web interface (no build step).
