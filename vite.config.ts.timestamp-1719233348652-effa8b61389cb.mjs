// vite.config.ts
import react from "file:///Users/jowooseok/Desktop/dev/ic/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///Users/jowooseok/Desktop/dev/ic/node_modules/vite/dist/node/index.js";
import environment from "file:///Users/jowooseok/Desktop/dev/ic/node_modules/vite-plugin-environment/dist/index.js";
import dotenv from "file:///Users/jowooseok/Desktop/dev/ic/node_modules/dotenv/lib/main.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/jowooseok/Desktop/dev/ic";
dotenv.config();
var vite_config_default = defineConfig({
  root: "src",
  publicDir: path.resolve(__vite_injected_original_dirname, "public"),
  // public 디렉토리 경로 지정
  build: {
    outDir: "../dist",
    emptyOutDir: true
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    environment({
      CANISTER_ID_BACKEND: process.env.CANISTER_ID_BACKEND,
      CANISTER_ID_FRONTEND: process.env.CANISTER_ID_FRONTEND,
      CANISTER_ID_EVM_RPC: process.env.CANISTER_ID_EVM_RPC
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "setupTests.ts",
    cache: { dir: "../node_modules/.vitest" }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvam93b29zZW9rL0Rlc2t0b3AvZGV2L2ljXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvam93b29zZW9rL0Rlc2t0b3AvZGV2L2ljL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qb3dvb3Nlb2svRGVza3RvcC9kZXYvaWMvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZW52aXJvbm1lbnQgZnJvbSAndml0ZS1wbHVnaW4tZW52aXJvbm1lbnQnO1xuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcm9vdDogJ3NyYycsXG4gIHB1YmxpY0RpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYycpLCAvLyBwdWJsaWMgXHVCNTE0XHVCODA5XHVEMUEwXHVCOUFDIFx1QUNCRFx1Qjg1QyBcdUM5QzBcdUM4MTVcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICcuLi9kaXN0JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGRlZmluZToge1xuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjQ5NDMnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGVudmlyb25tZW50KHtcbiAgICAgIENBTklTVEVSX0lEX0JBQ0tFTkQ6IHByb2Nlc3MuZW52LkNBTklTVEVSX0lEX0JBQ0tFTkQsXG4gICAgICBDQU5JU1RFUl9JRF9GUk9OVEVORDogcHJvY2Vzcy5lbnYuQ0FOSVNURVJfSURfRlJPTlRFTkQsXG4gICAgICBDQU5JU1RFUl9JRF9FVk1fUlBDOiBwcm9jZXNzLmVudi5DQU5JU1RFUl9JRF9FVk1fUlBDLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICdzZXR1cFRlc3RzLnRzJyxcbiAgICBjYWNoZTogeyBkaXI6ICcuLi9ub2RlX21vZHVsZXMvLnZpdGVzdCcgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxVQUFVO0FBTGpCLElBQU0sbUNBQW1DO0FBT3pDLE9BQU8sT0FBTztBQUVkLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFdBQVcsS0FBSyxRQUFRLGtDQUFXLFFBQVE7QUFBQTtBQUFBLEVBQzNDLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsTUFDVixxQkFBcUIsUUFBUSxJQUFJO0FBQUEsTUFDakMsc0JBQXNCLFFBQVEsSUFBSTtBQUFBLE1BQ2xDLHFCQUFxQixRQUFRLElBQUk7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osT0FBTyxFQUFFLEtBQUssMEJBQTBCO0FBQUEsRUFDMUM7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
