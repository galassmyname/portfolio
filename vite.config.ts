import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Path the site is served from: "/" at a domain root, or e.g. "/portfolio/"
  // for a project page on GitHub Pages. Must start and end with "/".
  const base = `/${(env.VITE_BASE_PATH ?? '').replace(/^\/+|\/+$/g, '')}/`.replace(/\/{2,}/g, '/');

  return {
    plugins: [react()],
    base,
  };
});
