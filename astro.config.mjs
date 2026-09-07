import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update this once the domain is live so RSS/sitemap URLs are correct.
export default defineConfig({
  site: 'https://rngdev.net',
  integrations: [sitemap()],
});
