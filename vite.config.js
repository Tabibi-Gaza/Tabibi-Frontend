import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) {
<<<<<<< HEAD
              return 'react-vendor';
            }
            if (id.includes('fontawesome') || id.includes('@fortawesome')) {
              return 'icons-fontawesome';
            }
            if (id.includes('lucide') || id.includes('react-icons')) {
              return 'icons-other';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts';
            }
            if (id.includes('html2canvas') || id.includes('jspdf')) {
              return 'pdf-tools';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            if (id.includes('axios') || id.includes('@tanstack') || id.includes('signalr')) {
              return 'data-fetching';
=======
              return 'react-core';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            if (id.includes('axios') || id.includes('signalr')) {
              return 'networking';
>>>>>>> c2862d0 (Replace frame-by-frame animation with hero-bg.webm video, fix specializations lookup API 404 (case-sensitive URL), optimize QueryClient defaults and vite chunk splitting)
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
<<<<<<< HEAD
=======
            if (id.includes('framer-motion')) {
              return 'animation';
            }
>>>>>>> c2862d0 (Replace frame-by-frame animation with hero-bg.webm video, fix specializations lookup API 404 (case-sensitive URL), optimize QueryClient defaults and vite chunk splitting)
            return 'vendor';
          }
        }
      }
    }
  }
})
