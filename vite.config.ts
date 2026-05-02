import { defineConfig } from "vite";

export default defineConfig({
  root: "./src/",
  appType:"mpa",
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
  resolve: {
    alias: {
      "/dist": "/../dist",
    },
  },
});
