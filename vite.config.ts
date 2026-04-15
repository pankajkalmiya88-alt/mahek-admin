import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4200, // same as your old setup
  },
  build: {
    // CKEditor alone is ~720 kB minified; we lazy-load it, but keep the warning
    // threshold slightly higher to avoid blocking CI/builds on this known chunk.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // Keep very large libs from bloating the main/vendor chunk.
          if (id.includes('node_modules/ckeditor5') || id.includes('node_modules/@ckeditor')) return 'editor-ckeditor'
          if (id.includes('node_modules/lexical') || id.includes('node_modules/@lexical')) return 'editor-lexical'
          if (id.includes('node_modules/@tiptap')) return 'editor-tiptap'
          if (id.includes('node_modules/recharts')) return 'charts'
          if (id.includes('node_modules/@cloudinary') || id.includes('node_modules/cloudinary')) return 'cloudinary'
          if (id.includes('node_modules/@radix-ui')) return 'radix'
          if (id.includes('node_modules/@tanstack')) return 'tanstack'

          // Default: keep the rest together to avoid lots of tiny/empty chunks.
          return 'vendor'
        },
      },
    },
  },
})
