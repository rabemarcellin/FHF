import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"],
  },
  server: {
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
        next();
      });
    },
  },
  plugins: [react(), crossOriginIsolation()],
});
