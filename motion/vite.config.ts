import path from "node:path";
import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// Every top-level .html file is its own page (gallery index + standalone demos),
// so register them all as build inputs; otherwise `vite build` only emits index.html.
const pages = Object.fromEntries(
  readdirSync(__dirname)
    .filter((f) => f.endsWith(".html"))
    .map((f) => [f.replace(/\.html$/, ""), path.resolve(__dirname, f)]),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: pages } },
  server: {
    // Port is assigned by the launcher via PORT; fall back to Vite's default.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    strictPort: Boolean(process.env.PORT),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
