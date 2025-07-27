# React + Vite + Hono Workers (SSR Edition)

Small but batteries-included template for building modern Cloudflare Workers apps.

• **Front-end:** React 19 + Vite 6  
• **Edge backend:** [Hono](https://hono.dev/) running inside Workers – `/api/*` routes ready  
• **SSR glue:** [vite-ssr-components](https://github.com/yusukebe/vite-ssr-components) (written by Hono’s author)  
• **Complete markdown tech-stack guide for ai agents and tooling list:** see [`tech-stack.md`](./tech-stack.md)
• **Remote D1 / R2 bindings in `npm run dev`:** powered by Wrangler ≥4.20 & Cloudflare Vite plugin ([beta discussion](https://github.com/cloudflare/workers-sdk/discussions/9660)).


* **AI-agent friendly** → clear module boundaries, deterministic file paths, zero config.
* **Ready to use** → React Front end lives in `src/react-app`, Back end hono Worker in `src/worker`; both running workered via cloudflare vite plugin.

---

## Quick start

1. Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
```

2. Clone & install deps

```bash
git clone https://github.com/<you>/my-app.git
cd my-app
npm install
```

3. Dev server (React HMR **&** Workers SSR)

```bash
npm run dev     # vite + wrangler in one process
```

4. Production build + deploy

```bash
npm run build   # compiles client & server bundles
npm run deploy  # wrangler deploy
```

Open http://localhost:5173, edit `src/react-app/App.tsx`, watch it hot-reload even though the page came from the server.

---

## How the SSR works (30 sec version)

* `src/worker/index.tsx` streams an HTML shell containing `<ViteClient/>`, `<Script/>`, etc.
* In dev these components inject `/@vite/client` and React Fast Refresh.
* On `npm run build` the plugin scans JSX, auto-adds every referenced script/style to Vite’s build input and rewrites the tags to hashed assets.
* Net result: no manual entry lists, no “unexpected token <” HMR bugs, fully Cloudflare-compatible bundles.

For deeper internals read the annotated source or jump to [`tech-stack.md`](./tech-stack.md).

---

## Remote bindings (local dev)

`npm run dev` starts your Worker with **remote D1 & R2 bindings** so you can develop against real data—no local seeding, instant feedback.

**How to enable**
1. Open `wrangler.json(c)`.
2. Add `"experimental_remote": true` to any binding you want to reach in the cloud.
3. Run `npm run dev`.

Example:
```json
// wrangler.json (excerpt)
{
  "d1_databases": [
    {
      "binding": "DB",          // accessible as env.DB
      "database_name": "my_db",
      "experimental_remote": true
    }
  ],
  "r2_buckets": [
    {
      "binding": "ASSETS",      // accessible as env.ASSETS
      "bucket_name": "assets-bucket",
      "experimental_remote": true
    }
  ]
}
```

For the full list of unsupported binding types and caveats see [`tech-stack.md`](./tech-stack.md#remote-bindings) or the [Workers docs](https://developers.cloudflare.com/workers/development-testing/#using-vite-with-remote-bindings).

### Current Unsupported remote bindings
Certain bindings are **not** supported for remote connections during local development (`experimental_remote: true`). These always use local simulations or throw an error if flagged remote.  (See the [official list](https://developers.cloudflare.com/workers/development-testing/#using-vite-with-remote-bindings)).

- **Durable Objects** – may be supported later, currently always local.
- **Environment Variables (`vars`)** – meant to differ between envs; use `.dev.vars` locally.
- **Secrets** – same rationale as vars.
- **Static Assets** – always served from local disk for speed.
- **Version Metadata** – not applicable to local code.
- **Analytics Engine** – local sessions don’t send prod analytics.
- **Hyperdrive** – work in progress.
- **Rate Limiting** – local runs shouldn’t affect prod limits.

---

Template evolved from Cloudflare’s [vite-react-template](https://github.com/cloudflare/templates/tree/main/vite-react-template) and the official SSR demo by [@yusukebe](https://github.com/yusukebe/vite-ssr-components).

Happy shipping 🚀
