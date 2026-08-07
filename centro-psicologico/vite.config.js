import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command }) => {
  return {
    server: {
      host: true,
      allowedHosts: 'all',
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    },
    plugins: [
      react(),
      // El plugin PWA solo se activa en build (producción)
      command === "build" ? VitePWA({
        registerType: "autoUpdate",
        manifest: {
          short_name: "CentroPsicologico",
          name: "Centro Psicológico Centenario",
          icons: [
            {
              src: "logo192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "logo512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          start_url: "./",
          display: "standalone",
          theme_color: "#286672",
          background_color: "#ffffff"
        }
      }) : null
    ]
  };
});
