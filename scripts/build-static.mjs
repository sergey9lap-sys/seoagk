import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

const entries = [
  "index.html",
  "404.html",
  "assets",
  "programs",
  "events",
  "method-club",
  "visioners",
  "methodist",
  "business360",
  "strategy-session",
  "about",
  "cases",
  "articles",
  "social",
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const entry of entries) {
  const source = join(root, entry);
  if (!existsSync(source)) continue;

  cpSync(source, join(dist, entry), { recursive: true });
}

console.log("Static site copied to dist/");
