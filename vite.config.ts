import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const basePath = process.env.basePath ?? '/';
console.log(`vite build base path: ${basePath}`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: basePath,
});
