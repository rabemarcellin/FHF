import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ngrok } from "vite-plugin-ngrok";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  plugins: [
    react(),

    /* crossOriginIsolation(), */
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
});
