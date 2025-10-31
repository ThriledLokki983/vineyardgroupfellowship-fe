import { defineConfig } from 'vite';
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';
// import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
    //     navigateFallback: null, // Disable navigation fallback in dev
    //     cleanupOutdatedCaches: true, // ✅ Automatically cleanup old caches
    //     skipWaiting: true, // ✅ Force new SW to activate immediately
    //     clientsClaim: true, // ✅ Take control of all clients immediately
    //     cacheId: 'Vineyard Group Fellowship-v2', // ✅ New cache ID to force refresh
    //   },
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'Vineyard Group Fellowship - Recovery & Wellness',
    //     short_name: 'Vineyard Group Fellowship',
    //     description: 'A comprehensive addiction recovery and wellness platform',
    //     theme_color: '#603000',
    //     background_color: '#F8F5F0',
    //     display: 'standalone',
    //     scope: '/',
    //     start_url: '/',
    //     orientation: 'portrait-primary',
    //     icons: [
    //       {
    //         src: 'icons/icon-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'icons/icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'icons/icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   },
    //   devOptions: {
    //     enabled: false  // ✅ DISABLE PWA in development to avoid caching issues
    //   }
    // })
  ],
  resolve: {
    alias: [
      { find: 'assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: 'components', replacement: path.resolve(__dirname, './src/components') },
      { find: 'configs', replacement: path.resolve(__dirname, './src/configs') },
      { find: 'contexts', replacement: path.resolve(__dirname, './src/contexts') },
      { find: 'data', replacement: path.resolve(__dirname, './src/data') },
      { find: 'helpers', replacement: path.resolve(__dirname, './src/helpers') },
      { find: 'hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: 'pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: 'styles', replacement: path.resolve(__dirname, './src/styles') },
      { find: 'signals', replacement: path.resolve(__dirname, './src/signals') },
      { find: 'services', replacement: path.resolve(__dirname, './src/services') },
      { find: 'src', replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    port: 3000,
    strictPort: true // Fail if port 3000 is not available
  },
  preview: {
    port: 3000
  },
  build: {
    target: 'es2022',
    sourcemap: true
  }
})
