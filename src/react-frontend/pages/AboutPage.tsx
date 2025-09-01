import "../App.css";

function AboutPage() {
  return (
    <div className="card">
      <h1>About This Template</h1>
      <p>
        This is the ultimate full-stack template featuring:
      </p>
      <ul style={{ textAlign: 'left', margin: '1rem auto', maxWidth: '500px' }}>
        <li><strong>React 19</strong> - Modern component UI with Suspense</li>
        <li><strong>Vite 6</strong> - Lightning-fast dev server and HMR</li>
        <li><strong>Hono</strong> - Ultra-light TypeScript-first router</li>
        <li><strong>Cloudflare Workers</strong> - Edge runtime for the entire app</li>
        <li><strong>SSR</strong> - Server-side rendering with vite-ssr-components</li>
        <li><strong>React Router</strong> - Easy client-side routing</li>
        <li><strong>D1 & R2 Remote Bindings</strong> - Local dev with real remote resources</li>
      </ul>
      
      <div className="card">
        <h2>Adding New Pages</h2>
        <p>
          To add a new page:
        </p>
        <ol style={{ textAlign: 'left', margin: '1rem auto', maxWidth: '400px' }}>
          <li>Create a new component in <code>src/react-frontend/pages/</code></li>
          <li>Export it from <code>src/react-frontend/pages/index.ts</code></li>
          <li>Add the route in <code>src/react-frontend/App.tsx</code></li>
        </ol>
      </div>

      <div className="card">
        <h2>Adding API Routes</h2>
        <p>
          To add new API endpoints:
        </p>
        <ol style={{ textAlign: 'left', margin: '1rem auto', maxWidth: '400px' }}>
          <li>Create route handlers in <code>src/workers-backend/routes/api/</code></li>
          <li>Import and use them in <code>src/workers-backend/index.tsx</code></li>
          <li>All routes under <code>/api/*</code> are backend-only</li>
        </ol>
      </div>
    </div>
  );
}

export default AboutPage;