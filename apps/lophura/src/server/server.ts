import http from "node:http";
import { config } from "dotenv";
import next from "next";

config({ path: ".env" });
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbopack: dev });
const handle = app.getRequestHandler();

void app.prepare().then(async () => {
  try {
    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(PORT);
    console.log(`> Ready on http://localhost:${PORT}`);
  } catch (e) {
    console.error("Main server error", e);
  }
});
