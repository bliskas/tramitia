import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://tramitia.es',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/gracias'),
      serialize(item) {
        // Homepage - highest priority
        if (item.url === 'https://tramitia.es/' || item.url === 'https://tramitia.es') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        // Country/service landing pages
        else if (item.url.includes('/apostilla-')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Blog index
        else if (item.url.endsWith('/blog/') || item.url.endsWith('/blog')) {
          item.priority = 0.8;
          item.changefreq = 'daily';
        }
        // Blog posts
        else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        // Legal pages - lowest priority
        else if (item.url.includes('politica-') || item.url.includes('aviso-')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        // Default
        else {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  // Optimización de build
  build: {
    inlineStylesheets: 'auto',
  },
  // Prefetch para navegación rápida
  prefetch: {
    prefetchAll: true,
  },
});
