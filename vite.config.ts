/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig({
  root: 'src',
  publicDir: path.resolve(__dirname, 'public'), // public 디렉토리 경로 지정
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment({
      CANISTER_ID_BACKEND: process.env.CANISTER_ID_BACKEND,
      CANISTER_ID_FRONTEND: process.env.CANISTER_ID_FRONTEND,
      CANISTER_ID_EVM_RPC: process.env.CANISTER_ID_EVM_RPC,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: 'setupTests.ts',
    cache: { dir: '../node_modules/.vitest' },
  },
});
