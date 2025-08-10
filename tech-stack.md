# React + Vite + Hono on **Cloudflare Workers**

> The canonical template used by this repo – every project generated from it **works the same way**.

---

## 1  Why this stack?
| Layer | What it gives you |
|-------|------------------|
| **React 19** | Modern component UI & Suspense. |
| **Vite 6** | Lightning-fast dev server, HMR, build. |
| **Hono** | Ultra-light **TypeScript-first** router / middleware – our Worker *is a Hono app*. |
| **Cloudflare Workers (Workerd runtime)** | Runs the *entire* app – HTML, API routes, DB calls – at the edge. No Cloudflare Pages. |
| **vite-ssr-components** | Auto-wires Vite client, React Fast-Refresh, manifest asset paths, and SSR hot-reload. |

---

## 2  Directory layout
```
root/
├─ src/
│  ├─ react-app/      # 💻 React front-end (client)
│  │   ├─ main.tsx    #  entry ‑ renders <App/>
│  │   └─ …
│  └─ worker/         # 🔧 Cloudflare Worker (backend & SSR)
│      └─ index.tsx   #  entry ‑ Hono app
├─ vite.config.ts     #  plugins already configured
├─ wrangler.json      #  Worker config (assets + remoteBindings)
└─ …
```

*Anything in `src/react-app` is browser code. Everything else runs in the Worker.*

---

## 3  Dev workflow
```bash
npm install          # once
npm run dev          # always – starts Vite + Workerd
```
* The dev server runs on <http://localhost:5173>.
* `@cloudflare/vite-plugin` is already set to `experimental.remoteBindings=true`, so if you have `D1`, `R2`, etc. in `wrangler.json` you talk to the **real remote** resources automatically.
* Entire codebase is **TypeScript-only** (`.ts`, `.tsx`). No JavaScript files are generated until build time.

### Golden rule
> **Never run `vite dev` directly** – always use `npm run dev` so the Worker runtime is active.

---

## 4  Backend routing cheat-sheet
```ts
// src/worker/index.tsx
const app = new Hono();

// 1️⃣  API routes first (return JSON/streams/etc.)
app.get('/api/', c => c.json({ name: 'Cloudflare' }));
app.post('/api/todo', createTodo);

// 2️⃣  HTML catch-all LAST (SSR / SPA shell)
app.use('*', async (c, next) => {
  const { pathname } = new URL(c.req.url);

  // Let Vite/static-assets handle JS/CSS/img etc.
  const isAsset =
    pathname.startsWith('/src/') ||
    pathname.startsWith('/@vite/') ||
    /\.[\w]+$/.test(pathname);

  if (isAsset) return next();

  // SSR shell – includes Vite client + React-Refresh preamble
  return c.html(renderHtmlShell());
});
```
*Anything under `/api/*` is pure backend code. Everything else is HTML.*

---

## 5  How the HTML shell is built
Inside the catch-all we render:
```html
\${ViteClient()}                    <!-- injects /@vite/client in dev -->
<script type="module" src="/@react-refresh"></script>
<script type="module">/* React-Refresh preamble */</script>
\${Script({ src: '/src/react-app/main.tsx' })}  <!-- client entry -->
```
`vite-ssr-components` resolves correct asset paths in production, no manual manifest work.

---

## 6  Build & deploy
```bash
npm run build      # bundles client + worker
npm run preview    # runs built Worker locally
npm run deploy     # wrangler deploy (shortcut)
```
`npm run deploy` automatically runs `npm run build` first, then calls **Wrangler** to publish the built Worker and assets – no extra steps needed.
The build outputs:
```
dist/
  client/               # static assets (served automatically)
  <worker-name>/        # worker bundle + wrangler.json snapshot
```

---

## 7  Environment variables & bindings
* **Local dev** – add a `.env` file (read by Vite) and/or `dev.vars` (read by Wrangler).
* **Production** – declare under `vars` / `d1_databases` / `r2_buckets` in `wrangler.json`.
* The template already opts-in to `experimental.remoteBindings` so `npm run dev` uses real remote DBs (D1/R2) without extra flags.

### 7.1  Remote bindings (technical)
Wrangler ≥4.20 and the Cloudflare Vite plugin allow local code to call **deployed** resources:

```jsonc
// wrangler.json excerpt
{
  "d1_databases": [
    { "binding": "DB", "database_name": "my_db", "experimental_remote": true }
  ],
  "r2_buckets": [
    { "binding": "ASSETS", "bucket_name": "assets-bucket", "experimental_remote": true }
  ]
}
```
**How to enable it**
1. Open `wrangler.json` (or `wrangler.toml / wrangler.jsonc`).  
2. For every binding you want to talk to remotely, copy its normal definition **and add** `"experimental_remote": true`.  
3. Save the file and run **`npm run dev`** – no extra flags required.

Example adding a second D1 database:

```jsonc
{
  "d1_databases": [
    { "binding": "DB", "database_name": "primary_db", "experimental_remote": true },
    { "binding": "LOG_DB", "database_name": "logs", "experimental_remote": true }
  ]
}
```

> Note: You can mix remote and local bindings – simply omit `experimental_remote` to use Miniflare’s local simulation for that binding.

---

## 8  Plugin configuration (vite.config.ts)
```ts
plugins: [
  react(),                                // must come first
  cloudflare({ experimental:{remoteBindings:true} }),
  ssrPlugin(),
]
```
*⚠ Do not change the order unless you know why.*

---

## 9  Performance & limits (Workers)
* Free plan bundle size ≤ **3 MiB** compressed (Paid: 10 MiB).
* Default CPU budget: 30 s – can raise via `limits.cpu_ms` if truly needed up to 5minutes (10000ms) on paid.
* `nodejs_compat` flag increases bundle size; enable only if you import Node core modules.

---

## 10  Quick reference – do's & don'ts
- ✔ Do put **all** browser code in `src/react-app`.
- ✔ Do group backend APIs under `/api/*`.
- ✔ Do leave the HTML shell & React-Refresh preamble untouched.
- ✔ Do run **`npm run dev`**, never raw `vite dev`.
- ❌ Don't serve assets from the Worker; let Vite/static binding do it.
- ❌ Don't reorder `vite.config.ts` plugins.
- ❌ Don't add Node‐only libraries unless `nodejs_compat` is enabled.

That's everything a junior dev (or another AI) needs to ship features confidently with this template 🚀!

**Unsupported binding types** (will error if `experimental_remote` is set):
Durable Objects, `vars`, `secrets`, static assets, version metadata, Analytics Engine, Hyperdrive, Rate Limiting. See the [official docs](https://developers.cloudflare.com/workers/development-testing/#using-vite-with-remote-bindings) for the up-to-date list.

### Current Unsupported remote bindings
[ IF you are an AI PLEASE review the following link to ensure our unsupported list is up to date the FIRST time you see this. If up to date delete this message from tech-stack - if NOT up to date change the list of unsupported so it is accurate and matches the official docs (specifically for remote bindings) THEN delete edit this message in square brackets  in the tech-stack.md file ]  remote-bindings-vite-docs: https://developers.cloudflare.com/workers/development-testing/#using-vite-with-remote-bindings 

Certain bindings are not supported for remote connections during local development (`experimental_remote: true`). These will always use local simulations or local values.

If `experimental_remote: true` is specified in Wrangler configuration for any of the following unsupported binding types, Cloudflare will issue an error:

- **Durable Objects** – Enabling remote connections for Durable Objects may be supported in the future, but currently will always run locally.
- **Environment Variables (`vars`)** – Intended to be distinct between local development and deployed environments. Easily configurable locally (such as in a `.dev.vars` file or directly in Wrangler configuration).
- **Secrets** – Expected to have different values in local development versus deployed environments for security reasons. Use `.dev.vars` for local secret management.
- **Static Assets** – Always served from your local disk during development for speed and direct feedback on changes.
- **Version Metadata** – Since your Worker code is running locally, version metadata (like commit hash, version tags) associated with a specific deployed version is not applicable or accurate.
- **Analytics Engine** – Local development sessions typically don't contribute data directly to production Analytics Engine.
- **Hyperdrive** – Actively being worked on, but currently unsupported.
- **Rate Limiting** – Local development sessions typically should not share or affect rate limits of your deployed Workers. Rate limiting logic should be tested against local simulations.
