import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import indexnow from 'astro-indexnow';
import fs from 'node:fs';
import path from 'node:path';

// Leer fechas de blog posts para lastmod del sitemap
const blogDir = './src/content/blog';
const blogDates = {};
if (fs.existsSync(blogDir)) {
  fs.readdirSync(blogDir).forEach(file => {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const updatedMatch = content.match(/updatedDate:\s*"([^"]+)"/);
      const publishedMatch = content.match(/publishedDate:\s*"([^"]+)"/);
      const slug = file.replace('.md', '');
      blogDates[slug] = updatedMatch?.[1] || publishedMatch?.[1];
    }
  });
}

// https://astro.build/config
export default defineConfig({
  site: 'https://tramitia.es',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/gracias'),
      serialize(item) {
        // Homepage - highest priority
        if (item.url === 'https://tramitia.es/' || item.url === 'https://tramitia.es') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        // Blog index
        else if (item.url.endsWith('/blog/') || item.url.endsWith('/blog')) {
          item.priority = 0.8;
          item.changefreq = 'daily';
        }
        // Blog posts (check BEFORE /apostilla- to avoid misclassification)
        else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
          const slug = item.url.match(/\/blog\/([^/]+)/)?.[1];
          if (slug && blogDates[slug]) {
            item.lastmod = new Date(blogDates[slug]).toISOString();
          }
        }
        // Country landing pages - high priority money pages
        else if (item.url.includes('/apostilla-')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Service landing pages - high priority money pages
        else if (
          item.url.includes('/nacionalidad-espanola-tramites') ||
          item.url.includes('/residencia-y-permisos-online') ||
          item.url.includes('/declaracion-renta-extranjeros') ||
          item.url.includes('/gestoria-tributaria') ||
          item.url.includes('/asesoria-contable-autonomos')
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Legal pages - lowest priority
        else if (item.url.includes('politica-') || item.url.includes('aviso-')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
          item.lastmod = new Date('2025-01-01').toISOString();
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
    indexnow({ key: '78c4e2d5997c971a60a468796a185178', enabled: !!process.env.CF_PAGES }),
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
