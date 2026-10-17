import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, any request starting with /api is forwarded to the
// Express server. That means the frontend can call "/api/jobs" without CORS
// problems and without hardcoding the server URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
