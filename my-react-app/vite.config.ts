import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // bind to all interfaces so the container is reachable from host
    host: '0.0.0.0',
    port: 5173,
    // HMR settings
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 5173,
    },
    // use polling to make file change events reliable on Docker for Windows
    watch: {
      usePolling: true,
      // lower interval to make file changes detected faster
      interval: 50,
    },
  },
})
