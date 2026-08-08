# jeevan-website

Personal single-page portfolio for **Jeevan Gowda** — software engineer & SDET.
Dark + amber theme, framer-motion animation, sections for hero, about, tech-stack
showcase, selected work, and contact (Vite + React 19 + TypeScript).

## Structure

- `src/App.tsx` — page shell composing the section components.
- `src/components/` — `Nav`, `Hero`, `About`, `TechStack`, `Work`, `Contact`, plus the
  shared `Reveal` scroll-in wrapper.
- `src/data/content.ts` — all editable content: tech groups, projects, socials, roles.
- `src/lib/motion.ts` — shared easing token.
- `src/index.css` — design tokens + all component styles.

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended)
- [Yarn](https://yarnpkg.com/) (this repo uses Yarn 4; see `packageManager` in `package.json`)

## TypeScript config

The repo uses the usual Vite split: root [`tsconfig.json`](tsconfig.json) references [`tsconfig.app.json`](tsconfig.app.json) (app sources) and [`tsconfig.node.json`](tsconfig.node.json) (Vite config). This supports `tsc -b` in the build script.

## Fonts

Body / UI uses **[Inter](https://fonts.google.com/specimen/Inter)** (Google Fonts). Technical
accents (brand, eyebrows, code-style labels) use **[JetBrains Mono](https://www.jetbrains.com/lp/mono/) SemiBold**
via [`public/fonts/JetBrainsMono-SemiBold.woff2`](public/fonts/JetBrainsMono-SemiBold.woff2)
(SIL OFL: [`public/fonts/OFL.txt`](public/fonts/OFL.txt)). To change fonts, update the imports
and `--font-ui` / `--font-mono` tokens in [`src/index.css`](src/index.css).

## Tech stack showcase

The grouped tech grid and marquee ribbon are driven by `TECH_GROUPS` in
[`src/data/content.ts`](src/data/content.ts). Edit that file to add/remove tools or swap
icon URLs (point them at files under `public/` if you prefer to self-host).

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
