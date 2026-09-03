const PUBLIC_DIR = `${import.meta.dir}/public`;

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
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
