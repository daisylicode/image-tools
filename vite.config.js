import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'index': resolve(__dirname, 'index.html'),
        'tools/crop': resolve(__dirname, 'tools/crop/index.html'),
        'tools/merge': resolve(__dirname, 'tools/merge/index.html'),
        'tools/remove-object': resolve(__dirname, 'tools/remove-object/index.html'),
        'tools/black-image': resolve(__dirname, 'tools/black-image/index.html'),
        'tools/compress': resolve(__dirname, 'tools/compress/index.html'),
        'tools/resize': resolve(__dirname, 'tools/resize/index.html')
      },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: '/index.html'
  },
  preview: {
    port: 4173,
    host: true
  },
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'scripts/core'),
      '@ui': resolve(__dirname, 'scripts/ui'),
      '@workers': resolve(__dirname, 'workers'),
      '@styles': resolve(__dirname, 'styles'),
      '@assets': resolve(__dirname, 'assets')
    }
  }
})