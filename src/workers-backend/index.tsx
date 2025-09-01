import { Hono } from 'hono'
import { html } from 'hono/html'
import { Script, ViteClient } from 'vite-ssr-components/hono'
import { users, files } from './routes'

/**
 * 🚀 Main Hono App - The Brain of Your Backend
 * 
 * This handles 3 things:
 * 1. 🔌 API Routes (/api/*) - Your backend endpoints  
 * 2. 📄 SSR Pages (everything else) - Serves React app with server-side rendering
 * 3. 📦 Assets (JS/CSS/images) - Lets Vite handle static files
 */
const app = new Hono()

// 🔌 API ROUTES - Add your backend endpoints here
// ===============================================

// Main API info endpoint
app.get('/api/', (c) => c.json({ 
  name: 'Cloudflare',
  message: 'Ultimate Full-Stack Template API',
  version: '1.0.0',
  features: ['React Router', 'D1 Database', 'R2 Storage', 'SSR']
}));

// 🚀 Mount API route handlers (from routes/ folder)
app.route('/api/users', users);  // Handles /api/users/*
app.route('/api/files', files);  // Handles /api/files/*

/*
  💡 To add new API routes:
  1. Create: routes/api/newroute.ts
  2. Export: routes/index.ts  
  3. Import above and add: app.route('/api/newroute', newroute);
*/

// 📄 SSR HANDLER - Serves your React app for page visits
// =====================================================
app.use('*', async (c, next) => {
  const { pathname } = new URL(c.req.url)

  // 📦 Skip if this is an asset (JS, CSS, images) or API call
  const isAssetRequest =
    pathname.startsWith('/src/') ||      // Vite modules
    pathname.startsWith('/@vite/') ||    // Vite internal
    pathname.startsWith('/api/') ||      // API calls  
    /\.[\w]+$/.test(pathname)           // Files with extensions

  if (isAssetRequest) return await next()

  // 🎨 Otherwise, serve the React app with SSR magic!
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ultimate Full-Stack Template</title>
        
        ${ViteClient()}  <!-- 🔥 Vite dev tools -->
        
        <!-- ⚡ React Fast Refresh (hot reloading magic) -->
        <script type="module" src="/@react-refresh"></script>
        <script type="module">
          import RefreshRuntime from '/@react-refresh';
          RefreshRuntime.injectIntoGlobalHook(window);
          window.$RefreshReg$ = () => {};
          window.$RefreshSig$ = () => (type) => type;
          window.__vite_plugin_react_preamble_installed__ = true;
        </script>

        ${Script({ src: '/src/react-frontend/main.tsx' })}  <!-- 🚀 Your React app -->
      </head>
      <body>
        <div id="root"><!-- React mounts here --></div>
      </body>
    </html>
  `)
})

export default app