import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap'],
            xterm: ['@xterm/xterm', '@xterm/addon-fit'],
          },
        },
      },
    },
  },
});
