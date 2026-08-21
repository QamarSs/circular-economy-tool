import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // For GitHub Pages deployment under a repo subpath, set base to '/<repo-name>/'
  base: "./",
});
