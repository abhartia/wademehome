import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  // Tailwind v4's `@tailwindcss/postcss` plugin is declared in `postcss.config.mjs`
  // using Next.js' string-form syntax, which postcss-load-config (used by Vite)
  // can't instantiate. Component unit tests don't need CSS processed — short-circuit
  // the loader with an inline empty config.
  css: {
    postcss: { plugins: [] },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", "tests/e2e/**"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
