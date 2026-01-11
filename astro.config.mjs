import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://jamesyoung93.github.io',
  base: '/foretodata',
  integrations: [react(), tailwind()],
  output: 'static',
});
