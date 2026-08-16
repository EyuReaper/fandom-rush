import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * Clue imagePaths in fandomClues.ts are raw "/src/assets/..." string literals
 * (never import-ed through Vite's module graph), so they don't get emitted into
 * the bundle. This plugin copies src/assets/ → dist/src/assets/ on write so the
 * paths resolve identically in dev and production (nginx serves dist/).
 */
function copyClueAssets(): Plugin {
  return {
    name: "copy-clue-assets",
    async writeBundle() {
      const srcDir = resolve(__dirname, "src/assets");
      const outDir = resolve(__dirname, "dist");
      if (!existsSync(srcDir)) return;
      const copyDir = (from: string, to: string) => {
        mkdirSync(to, { recursive: true });
        for (const entry of readdirSync(from)) {
          const srcPath = join(from, entry);
          const destPath = join(to, entry);
          if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      };
      copyDir(srcDir, join(outDir, "src/assets"));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copyClueAssets(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "pwa-icons/icon-192.png",
        "pwa-icons/icon-512.png",
        "pwa-icons/apple-touch-icon.png",
      ],
      manifest: {
        name: "Fandom Rush",
        short_name: "Fandom Rush",
        description: "An arcade guessing game — test your pop-culture trivia knowledge.",
        theme_color: "#0a0a1a",
        background_color: "#0a0a1a",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // The 166 clue images are too large (several MB each) to precache —
        // runtime-cache them instead, and never precache the assets tree.
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        globIgnores: ["src/assets/**", "**/src/assets/**"],
        runtimeCaching: [
          {
            urlPattern: /\/src\/assets\/.*\.png$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "clue-images",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
