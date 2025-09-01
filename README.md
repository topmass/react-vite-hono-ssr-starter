# 🚀 The Simplest Full-Stack Template

**React + Hono + Cloudflare Workers** = **Full-Stack Perfection**

```
📱 Frontend (React)     🔧 Backend (Hono)      ☁️ Edge (Cloudflare)
react-frontend/         workers-backend/        D1 + R2 + Workers
```

## ⚡ Start in 3 Commands

```bash
npm install    # Install everything
npm run dev    # Start → localhost:5173  
npm run deploy # Go live
```

## 🎯 Why This Template?

- **📄 Add pages** in 30 seconds
- **🔌 Add APIs** in 1 minute  
- **💾 Database ready** (D1)
- **📦 Storage ready** (R2)
- **🔥 SSR included** 
- **⚡ Edge deploy** with one command

## 📚 Quick Examples

### Add a Page
```tsx
// 1. Create: pages/About.tsx
export default function About() {
  return <h1>About Us</h1>;
}

// 2. Export: pages/index.ts  
export { default as About } from './About';

// 3. Route: App.tsx
<Route path="/about" element={<About />} />
```

### Add an API
```tsx
// 1. Create: routes/api/hello.ts
import { Hono } from 'hono';
const hello = new Hono();
hello.get('/', (c) => c.json({ message: 'Hello!' }));
export default hello;

// 2. Export + Mount (see .CLAUDE.md for full details)
```

## 📂 Clean Structure

```
src/
├── react-frontend/     ← Your React app
│   ├── pages/         ← Add pages here
│   ├── components/    ← Reusable components  
│   └── App.tsx       ← Router lives here
└── workers-backend/   ← Your API
    ├── routes/api/   ← Add APIs here
    ├── functions/    ← Serverless functions
    └── index.tsx     ← Main server
```

## 🚀 Deploy to Production

```bash
npm run build   # Build everything
npm run deploy  # Deploy to Cloudflare Workers
```

Your app goes live at `https://your-worker.workers.dev` instantly.

---

**📖 Need help adding pages/APIs?** See `.CLAUDE.md` for step-by-step guides!