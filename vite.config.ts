import { defineConfig } from "vite";

export default defineConfig({
  root: "./src/",
  appType: "mpa",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
  },
});