import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import ssrPlugin from "vite-ssr-components/plugin";

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      experimental: { remoteBindings: true },
    }),
    ssrPlugin(),
  ],
});
