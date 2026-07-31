import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".map": "application/json",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === "/" ? "/tests/fixtures/index.html" : req.url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end();
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try with .js extension for module specifiers (bare import fix)
      if (!ext) {
        const jsPath = filePath + ".js";
        fs.readFile(jsPath, (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end("Not found: " + req.url);
            return;
          }
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(data2);
        });
        return;
      }
      res.writeHead(404);
      res.end("Not found: " + req.url);
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

const PORT = 4173;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});
