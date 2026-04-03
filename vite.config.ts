import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function env(name: string): string | undefined {
  const p = (
    globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env?.[name];
  return typeof p === "string" ? p : undefined;
}

/** GitHub Pages: project site = /<repo>/, user/org site (repo named *.github.io) = / */
function pagesBase(): string {
  const b = env("GITHUB_PAGES_BASE")?.trim();
  if (!b || b === "/") return "/";
  return b.endsWith("/") ? b : `${b}/`;
}

export default defineConfig({
  base: pagesBase(),
  plugins: [react()],
});
