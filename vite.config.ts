import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import { viteStaticCopy } from "vite-plugin-static-copy";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node"
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";

//@ts-expect-error ts being ts
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: `${baremuxPath}/**/*`.replace(/\\/g, "/"),
          dest: "baremux",
          overwrite: false,
        },
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false,
        },
        {
          src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
          dest: "epoxy",
          overwrite: false,
        },
      ]
    }),],
  server: {
    headers: {
      "X-Frame-Options": "SAMEORIGIN"
    },
    proxy: {
      "/cdn/src": {
        target: "http://localhost:1111",
        changeOrigin: true
      },
      "/game-assets": {
        target: "http://localhost:1111",
        changeOrigin: true
      },
      "/w/": {
        target: "http://localhost:1111/",
        rewrite: (p) => p.replace(/^\/w/, ""),
        ws: true,
      },
    }
  },
  preview: {
    proxy: {
      "/cdn/src": {
        target: "http://localhost:1111",
        changeOrigin: true
      },
      "/game-assets": {
        target: "http://localhost:1111",
        changeOrigin: true
      },
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          icons: ["react-icons"],
        }
      }
    }
  }
})
