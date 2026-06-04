import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

createServer((request, response) => {
  const path = normalize(decodeURIComponent(request.url?.split("?")[0] || "/"));
  const requested = resolve(join(root, path === "/" ? "index.html" : path));
  if (!requested.startsWith(root) || !existsSync(requested) || !statSync(requested).isFile()) {
    response.writeHead(404).end("Não encontrado");
    return;
  }
  response.writeHead(200, { "Content-Type": mime[extname(requested)] || "application/octet-stream" });
  createReadStream(requested).pipe(response);
}).listen(4181, "127.0.0.1", () => console.log("Demo em http://127.0.0.1:4181"));
