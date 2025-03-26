import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  server: {
    proxy: {
      // Note that your Express routes must start with /api 
      // for the proxy to work
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split the biggest deps - https://stackoverflow.com/questions/76220621/is-it-possible-to-split-the-react-dom-package-when-using-vite
        manualChunks(id){
          if (id.includes('react-dom')) {
            return 'react-dom'
          }
          if (id.includes('react')) {
            return 'react';
          }
          if (id.includes('three')) {
            return 'three'
          }
        }
      }
    }
  }
});
