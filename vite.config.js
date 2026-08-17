import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    
  ],build: {
    rollupOptions: {
      output: {
        // تجزئة المكتبات الكبيرة الموجودة في node_modules إلى ملفات منفصلة
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})