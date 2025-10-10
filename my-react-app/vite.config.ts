import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // bind to all interfaces so the container is reachable from host
    host: '0.0.0.0',
    // HMR settings: force the client to connect to localhost (host machine)
    hmr: {
      // host.docker.internal resolves to the host machine from inside Docker Desktop on Windows
      host: 'host.docker.internal',
      protocol: 'ws',
      clientPort: 5173,
    },
    // use polling to make file change events reliable on Docker for Windows
    watch: {
      usePolling: true,
      // lower interval to make file changes detected faster
      interval: 50,
    },
  },
})
