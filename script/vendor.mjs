// script/vendor.mjs — build ask-ui-kit and sync the bundle into consumer
// apps (Rails importmap pattern: public/ask-ui-kit.js + a ?v= cache-buster
// pin). Kills the manual copy-and-bump drift between consumers.
//
// Usage:
//   node script/vendor.mjs [path/to/app ...]   # defaults to known consumers
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const version = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).version;

const DEFAULTS = [
  "/Users/kaka/Code/MyrrLabs/myrrlabs",
  "/Users/kaka/Code/kawibot/kawibot",
];
const targets = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULTS;

execSync("npm run build", { cwd: root, stdio: "inherit" });

for (const app of targets) {
  const src = path.join(root, "dist", "index.js");
  const dest = path.join(app, "public", "ask-ui-kit.js");
  if (!existsSync(dest)) {
    console.warn(`skip ${app}: no public/ask-ui-kit.js`);
    continue;
  }
  copyFileSync(src, dest);
  console.log(`copied ask-ui-kit@${version} -> ${path.relative(process.cwd(), dest)}`);

  const importmap = path.join(app, "config", "importmap.rb");
  if (!existsSync(importmap)) {
    console.warn(`skip ${app}: no config/importmap.rb`);
    continue;
  }
  const rb = readFileSync(importmap, "utf8");
  const pinRe = /pin "ask-ui-kit", to: "\/ask-ui-kit\.js\?v=[^"]+"/;
  if (!pinRe.test(rb)) {
    console.warn(`skip ${app}: no ask-ui-kit pin found in importmap`);
    continue;
  }
  const next = rb.replace(pinRe, `pin "ask-ui-kit", to: "/ask-ui-kit.js?v=${version}"`);
  if (next !== rb) {
    writeFileSync(importmap, next);
    console.log(`bumped ?v=${version} in ${path.relative(process.cwd(), importmap)}`);
  } else {
    console.log(`pin already at ?v=${version} (${app})`);
  }
}
