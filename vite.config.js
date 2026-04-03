import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
function env(name) {
    const p = globalThis.process?.env?.[name];
    return typeof p === "string" ? p : undefined;
}
/** GitHub Pages: project site = /<repo>/, user/org site (repo named *.github.io) = / */
function pagesBase() {
    const b = env("GITHUB_PAGES_BASE")?.trim();
    if (!b || b === "/")
        return "/";
    return b.endsWith("/") ? b : `${b}/`;
}
export default defineConfig({
    base: pagesBase(),
    plugins: [react()],
});
