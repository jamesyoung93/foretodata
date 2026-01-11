import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://foretodata.com',
  base: '/foretodata',
  integrations: [react(), tailwind()],
  output: 'static',
});
