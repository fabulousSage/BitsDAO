import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'], // Injecting Buffer
    }),
  ],
  resolve: {
    alias: {
      'events': 'events', // Alias 'events' to the installed package
      'stream': 'vite-compatible-readable-stream', // Alias 'stream' to 'vite-compatible-readable-stream'
      'util': 'util', // Alias 'util' to the installed package
      'assert': 'assert', // Alias 'assert' to the installed package
      'buffer': 'buffer', // Alias 'buffer' to the installed package
      'http': 'stream-http', // Alias 'http' to 'stream-http'
      'https': 'https-browserify', // Alias 'https' to 'https-browserify'
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false,
        }),
        commonjs(),
      ],
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'], // Include 'buffer' and 'process' in optimized dependencies
  },
  define: {
    'process.env': {}, // Define 'process.env' for the browser environment
    global: 'window', // Define 'global' as 'window' for the browser environment
  },
});
