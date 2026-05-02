import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src/",
  appType: "mpa",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:           resolve(__dirname, "src/index.html"),
        cart:           resolve(__dirname, "src/html/cart.html"),
        catalog:        resolve(__dirname, "src/html/catalog.html"),
        about:          resolve(__dirname, "src/html/about.html"),
        contact:        resolve(__dirname, "src/html/contact.html"),
        productDetails: resolve(__dirname, "src/html/product-details.html"),
      },
    },
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
  publicDir: "assets",
});