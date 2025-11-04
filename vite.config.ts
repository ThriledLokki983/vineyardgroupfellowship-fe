import { defineConfig } from 'vite';
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
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
      { find: 'schemas', replacement: path.resolve(__dirname, './src/schemas') },
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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],

          // React Router
          'router': ['react-router-dom'],

          // React Aria Components (large UI library)
          'react-aria': [
            'react-aria',
            'react-aria-components',
            '@react-aria/utils',
            '@react-aria/focus',
            '@react-aria/interactions'
          ],

          // TanStack Query
          'query': ['@tanstack/react-query'],

          // Preact Signals
          'signals': ['@preact/signals-react', '@preact/signals-core'],

          // Google Maps
          'maps': ['@vis.gl/react-google-maps'],

          // Form validation
          'validation': ['zod'],
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase from 500KB to 600KB
  }
})
