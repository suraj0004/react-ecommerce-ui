import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [
      "localhost",
      "b99bdb07-b371-465b-9ffb-9bd6dbaacaca-00-30ravi7djgrcy.pike.replit.dev",
      "https://suraj0004.github.io/",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  base: "./",
});
