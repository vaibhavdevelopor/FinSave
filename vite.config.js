import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT || 5173,
    host: true,
    allowedHosts: ["*"], // ✅ allow all hosts
  },
});
