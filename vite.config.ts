import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src/",
  appType: "mpa",
  build: {
    outDir: "../dist",      // ← збирати в корневий dist
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
    fs: {
      allow: ["..", "../dist"],
    },
  },
  publicDir: "public",
});