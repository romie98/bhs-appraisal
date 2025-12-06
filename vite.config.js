import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_API_URL__: JSON.stringify(process.env.VITE_API_BASE_URL),
  }
});


