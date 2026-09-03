import { parseFormMetadata } from "./lib/parse.ts";

const PUBLIC_DIR = `${import.meta.dir}/public`;

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/api/parse") {
      try {
        const body = (await req.json()) as Record<string, unknown>;
        const metadata = body.metadata ?? body.json;
        if (metadata === undefined) {
          return Response.json({ error: "Missing metadata" }, { status: 400 });
        }
        const parsed =
          typeof metadata === "string" ? JSON.parse(metadata) : metadata;
        const form = parseFormMetadata(parsed);
        return Response.json(form);
      } catch (err: any) {
        return Response.json(
          { error: `Failed to parse metadata: ${err.message}` },
          { status: 400 },
        );
      }
    }

    if (req.method === "GET") {
      const path = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = Bun.file(`${PUBLIC_DIR}${path}`);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
