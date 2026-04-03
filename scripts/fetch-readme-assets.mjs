#!/usr/bin/env node
/**
 * Reads docs/github-profile-readme-fragment.html, fetches unique http(s) img/src URLs,
 * writes files under public/readme-assets/, and writes docs/github-profile-readme-local.html.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcPath = join(root, "docs/github-profile-readme-fragment.html");
const outDir = join(root, "public/readme-assets");
const outHtml = join(root, "docs/github-profile-readme-local.html");

const html = await readFile(srcPath, "utf8");
const re = /src\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
const urls = new Set();
let m;
while ((m = re.exec(html)) !== null) {
  const u = (m[1] || m[2] || m[3] || "").trim();
  if (/^https?:\/\//i.test(u)) urls.add(u);
}

await mkdir(outDir, { recursive: true });

const map = new Map();

for (const url of urls) {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 16);
  let ext = ".bin";
  try {
    const path = new URL(url).pathname;
    const base = path.split("/").pop() || "asset";
    const dot = base.lastIndexOf(".");
    if (dot >= 0) {
      const e = base.slice(dot).replace(/[^a-z0-9.]/gi, "");
      if (e.length <= 8 && e.startsWith(".")) ext = e;
    }
  } catch {
    /* ignore */
  }
  const filename = `${hash}${ext}`;
  const localPath = join(outDir, filename);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "jeevan-website-asset-fetch/1.0",
        Accept: "image/*,*/*",
      },
    });
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(localPath, buf);
    map.set(url, `/readme-assets/${filename}`);
    console.log("ok", url, "->", filename);
  } catch (e) {
    console.warn("skip", url, e.message || e);
  }
}

let patched = html;
for (const [remote, local] of map) {
  patched = patched.split(remote).join(local);
}
await writeFile(outHtml, patched, "utf8");
console.log("Wrote", outHtml);
