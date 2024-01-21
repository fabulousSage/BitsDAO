import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'events': 'events', // Alias 'events' to the installed package
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
});
