import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

// https://vitejs.dev/config/
export default defineConfig({
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
  },
  plugins: [react(), crossOriginIsolation()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"], // Add ffmpeg.js or the related worker here
  },
});
