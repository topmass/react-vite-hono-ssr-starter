import { Hono } from 'hono'
import { html } from 'hono/html'
import { Script, ViteClient } from 'vite-ssr-components/hono'

/**
 * Hono application that:
 *  1. Lets Vite (during `npm run dev`) or the static-asset handler (in production)
 *     serve every request that looks like an asset/module ("/src/...", "/@vite/...", files with an extension, etc.).
 *  2. Renders the HTML shell for top-level navigation requests.
 *
 * This keeps the dev server working (no more HTML served as JS) while still
 * allowing us to add API routes under `/api/*` or any other backend logic.
 */
const app = new Hono()

// Simple JSON API for demo – same as original template
app.get('/api/', (c) => c.json({ name: 'Cloudflare' }));

// Catch-all handler – but bail out early if the request is clearly for an asset
app.use('*', async (c, next) => {
  const { pathname } = new URL(c.req.url)

  // Simple heuristic: if the path starts with typical asset prefixes or has a
  // file-extension, or is an API call, hand it off to the next handler
  // (Vite / other routes).
  const isAssetRequest =
    pathname.startsWith('/src/') ||
    pathname.startsWith('/@vite/') ||
    pathname.startsWith('/api/') ||
    /\.[\w]+$/.test(pathname)

  if (isAssetRequest) return await next()

  // Otherwise, treat it as a navigation and return the HTML shell.
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React</title>
        ${ViteClient()}
        <!-- React Fast Refresh runtime & preamble -->
        <script type="module" src="/@react-refresh"></script>
        <script type="module">
          import RefreshRuntime from '/@react-refresh';
          RefreshRuntime.injectIntoGlobalHook(window);
          window.$RefreshReg$ = () => {};
          window.$RefreshSig$ = () => (type) => type;
          window.__vite_plugin_react_preamble_installed__ = true;
        </script>

        ${Script({ src: '/src/react-app/main.tsx' })}
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `)
})

export default app