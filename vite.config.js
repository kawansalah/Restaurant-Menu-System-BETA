import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Security headers plugin
    {
      name: "security-headers",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Content Security Policy
          res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
          );
          // Prevent clickjacking
          res.setHeader("X-Frame-Options", "DENY");
          // Prevent MIME type sniffing
          res.setHeader("X-Content-Type-Options", "nosniff");
          // Enable XSS protection
          res.setHeader("X-XSS-Protection", "1; mode=block");
          // Enforce HTTPS
          res.setHeader(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains"
          );
          // Referrer Policy
          res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
          // Permissions Policy
          res.setHeader(
            "Permissions-Policy",
            "geolocation=(), microphone=(), camera=()"
          );
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    https: false, // Set to true in production with proper certificates
  },
});
