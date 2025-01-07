// vite.config.js
import { defineConfig } from "file:///C:/Users/marcellin/Desktop/user/FHF/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/marcellin/Desktop/user/FHF/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"]
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
      }
    }
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYXJjZWxsaW5cXFxcRGVza3RvcFxcXFx1c2VyXFxcXEZIRlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWFyY2VsbGluXFxcXERlc2t0b3BcXFxcdXNlclxcXFxGSEZcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL21hcmNlbGxpbi9EZXNrdG9wL3VzZXIvRkhGL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFtcIkBmZm1wZWcvZmZtcGVnXCIsIFwiQGZmbXBlZy91dGlsXCJdLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIC8qIGNyb3NzT3JpZ2luSXNvbGF0aW9uKCksICovXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6IFwiY29uZmlndXJlLXJlc3BvbnNlLWhlYWRlcnNcIixcclxuICAgICAgY29uZmlndXJlU2VydmVyOiAoc2VydmVyKSA9PiB7XHJcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgoX3JlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeVwiLCBcInJlcXVpcmUtY29ycFwiKTtcclxuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeVwiLCBcInNhbWUtb3JpZ2luXCIpO1xyXG4gICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLG9CQUFvQjtBQUNwVSxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGtCQUFrQixjQUFjO0FBQUEsRUFDNUM7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLElBRU47QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLGlCQUFpQixDQUFDLFdBQVc7QUFDM0IsZUFBTyxZQUFZLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUztBQUMxQyxjQUFJLFVBQVUsZ0NBQWdDLGNBQWM7QUFDNUQsY0FBSSxVQUFVLDhCQUE4QixhQUFhO0FBQ3pELGVBQUs7QUFBQSxRQUNQLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
