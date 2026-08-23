import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  // GitHub Pages 部署在子路径 /from-minimind-to-more/ 下,资源引用必须带前缀。
  // 根路径部署(如 Cloudflare Pages)时用 VITE_BASE=/ npm run build 覆盖。
  base: process.env.VITE_BASE || '/from-minimind-to-more/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    port: 5173,
    open: true,
  },
});
