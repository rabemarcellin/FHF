import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
      /*       "Cross-Origin-Resource-Policy": "cross-origin"
       */
    },
  },
  plugins: [react(), crossOriginIsolation()],
});
