# Vike Multi Render

A small example app demonstrating multiple render modes (SSR, SPA/CSR, SSG, and HTML-only) using Vike with React and a custom Fastify server. It showcases:

- Per-page render modes via +renderMode.js
- Server-side rendering streams and head management
- A custom Fastify server for dev and prod
- Vite + SWC React plugin and Tailwind CSS v4

See also: RENDER-MODES.md for a deeper dive into the render modes used in this repo.

## Tech stack

- Language: JavaScript (ESM)
- Frameworks/Libraries:
  - React 19
  - Vike and vike-react
  - Fastify 5 (custom server)
  - react-streaming (SSR streaming)
  - Tailwind CSS v4
  - Vite 7 with @vitejs/plugin-react-swc
- Package manager: Yarn 4 (Berry) — packageManager set to yarn@4.9.4

## Requirements

- Node.js 18+ recommended (required by modern Vite and many dependencies) — TODO: confirm minimum Node version for your environment
- Yarn 4 (or use Corepack: `corepack enable`)

## Getting started

1. Install dependencies

- If using Corepack (recommended):
  - Enable once: `corepack enable`
  - Then install: `yarn install`
- Otherwise ensure you have Yarn 4 and run: `yarn install`

2. Start in development

There are two dev flows — pick one:

- Vike dev server only (no Fastify wrappers):
  - `yarn dev:vike`
  - Starts Vike’s dev server with HMR on 127.0.0.1.

- Custom Fastify server in dev (Vite middleware embedded):
  - `yarn dev:server`
  - Boots Fastify at 127.0.0.1:3000 by default and mounts Vike dev middleware with HMR.

3. Build for production

- `yarn build`
- Produces client and server bundles under `dist/` using Vike/Vite.

4. Preview the built app

- Option A: Vike’s preview server: `yarn preview`
- Option B: Run the Fastify server in production mode: `yarn start`
  - Equivalent to `NODE_ENV=production node server.js`

## Available scripts

- `yarn dev:vike` — Run Vike’s dev server (`vike dev --host 127.0.0.1`).
- `yarn dev:server` — Run the custom Fastify server in development with Vite dev middleware.
- `yarn build` — Build the app with Vike/Vite.
- `yarn preview` — Preview the production build using Vike’s preview server.
- `yarn start` — Start the custom Fastify server in production.
- `yarn format` — Format source using Prettier.
- `yarn test` — Run Vitest unit tests.
- `yarn deploy` — Build and start the app using PM2.

## Environment variables

These are read by the server or renderer. All are optional unless noted.

- PORT — Port for the Fastify server. Default: 3000. Used in server.js.
- HMR_PORT — Port for Vite HMR websocket when running the custom dev server. Default: 24678. Used in server.js.
- NODE_ENV — Standard Node environment flag. Used to toggle dev/prod paths in server.js and reactStrictMode in pages/+config.js.
- PUBLIC_ENV\_\_APP_ID — Used by the renderer to select the root element id for mounting/hydration (default `root`). This is read via `import.meta.env` in the client/renderer code. TODO: Document how/where this env var is injected in your deployment setup.

## Project structure

High-level overview of important files and folders:

- server.js — Custom Fastify server integrating Vike (dev middleware in development and static serving in production)
- vite.config.js — Vite config with Vike, React SWC plugin, Tailwind, and path aliases (e.g. @components, @pages)
- pages/ — Vike file-based routing and per-page configs
  - pages/+config.js — App-level Vike config extending vike-react (Layout, onRender hooks, prerender settings)
  - pages/index/+Page.jsx — Home page
  - pages/index/+config.js — Page-level config (prerender true)
  - pages/index/+renderMode.js — Sets render mode (e.g., 'SSR')
  - pages/client-side/+Page.jsx — Client-side example (CSR/SPA style)
  - pages/client-side/+config.js — `prerender: false`
  - pages/server-side/+Page.jsx — Server-side example (data used on server)
  - pages/server-side/+config.js — `prerender: false`
  - pages/server-side/+data.js — Data loader used by the server-rendered page
  - pages/html/+Page.jsx — HTML-only example with no client hydration code
  - pages/html/+config.js — `prerender: true`
  - pages/html/+renderMode.js — Sets 'SSG' for static generation
- renderer/ — App rendering hooks used by Vike
  - renderer/index.js — Exports onRenderHtml and onRenderClient
  - renderer/onRenderHtml.jsx — Builds HTML, handles head elements, SSR streaming options
  - renderer/onRenderClient.jsx — Client React mount/hydration logic
- hooks/
  - hooks/usePageContext.jsx — React context bridge for `pageContext`
  - hooks/index.js — Barrel export
- layouts/
  - layouts/MainLayout.jsx — Minimal layout importing global styles
  - layouts/index.js — Barrel export
- styles/global.css — Tailwind CSS v4 import
- RENDER-MODES.md — Detailed explanation of render modes and configuration
- public/ — Static assets (served at the root). TODO: Populate/confirm contents if needed.

Note on path aliases: see vite.config.js for aliases like `@components`, `@helpers`, etc.

## Render modes overview

This repo demonstrates multiple render strategies per page using Vike’s config and +renderMode.js files:

- SSR (Server-Side Rendering): initial HTML on server, then hydrate on client.
- SPA/CSR (Client-Side Rendering): render entirely on the client.
- SSG (Static Site Generation): pre-rendered at build time.
- HTML-only: static HTML without shipping client JS for that page.

See RENDER-MODES.md for concrete examples and when to use each mode.

## Styling

Tailwind CSS v4 is wired in via `@tailwindcss/vite` and imported once in `layouts/MainLayout.jsx` through `styles/global.css`.

## Testing

This repo uses Vitest for unit tests.

- Build app: `yarn build`
- Start app: `yarn start`
- Run all tests: `yarn test`

## Deployment (PM2)

- `yarn build`
- `pm2 start ecosystem.config.cjs`

Ensure `NODE_ENV=production` and set `PORT` as needed. If using custom proxies/CDN, verify HMR only applies in development.
