# jeevan-website

Personal site: gradient hero, floating tech-stack icons, and a staggered **Jeevan Gowda** name animation (Vite + React + TypeScript).

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended)
- [Yarn](https://yarnpkg.com/) (this repo uses Yarn 4; see `packageManager` in `package.json`)

## TypeScript config

The repo uses the usual Vite split: root [`tsconfig.json`](tsconfig.json) references [`tsconfig.app.json`](tsconfig.app.json) (app sources) and [`tsconfig.node.json`](tsconfig.node.json) (Vite config). This supports `tsc -b` in the build script.

## Hero display font

The animated name uses **[JetBrains Mono](https://www.jetbrains.com/lp/mono/) SemiBold** via [`public/fonts/JetBrainsMono-SemiBold.woff2`](public/fonts/JetBrainsMono-SemiBold.woff2) (SIL OFL: [`public/fonts/OFL.txt`](public/fonts/OFL.txt)). To change fonts, update `@font-face` and `--font-name` in [`src/index.css`](src/index.css).

## Floating tech icons

All **Tech Stack** icons from your README table are listed in [`src/data/techStackFloatUrls.ts`](src/data/techStackFloatUrls.ts) and rendered as `<img>`. Edit that file to swap URLs or point to files under `public/` (e.g. `/icons/...`).

## GitHub README HTML fragment

Your full README-style markup is saved as [`docs/github-profile-readme-fragment.html`](docs/github-profile-readme-fragment.html) (remote images unchanged). To mirror those `img` URLs into `public/readme-assets/` and generate a local-path copy, run `node scripts/fetch-readme-assets.mjs` (see [`docs/README.md`](docs/README.md)).

## Commands

| Command | Description |
|--------|-------------|
| `yarn` | Install dependencies |
| `yarn dev` | Start dev server (with hot reload) |
| `yarn build` | Typecheck and produce static output in `dist/` |
| `yarn preview` | Serve the production build locally |
| `yarn lint` | Run ESLint |

## Deploy

`yarn build` emits static files under `dist/`. Host that folder on any static host.

**GitHub Pages:** push to `main` and use **Settings → Pages → GitHub Actions** (see [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml)).
