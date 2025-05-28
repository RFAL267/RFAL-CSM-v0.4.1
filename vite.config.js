// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
    port: 5000,
    allowedHosts: ["dc48-84-54-71-210.ngrok-free.app"],
}

})
