// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://zainmhaq.com',
  markdown: {
    shikiConfig: {
      // Dual themes so code blocks follow the site's light/dark toggle.
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
    },
  },
});
