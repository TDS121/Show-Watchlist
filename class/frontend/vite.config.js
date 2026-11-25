import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// adapted from 333FullToDo cs333-main/vite.config.js - the /api proxy
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // On your laptop, anything the page fetches from /api/ is sent to the
    // back end on port 3000, with the /api taken off (/api/auth/me -> /auth/me).
    // On the server, nginx's location /api/ block does the same job (lab 6).
    // The browser only ever sees one site, so the login cookie just works.
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
