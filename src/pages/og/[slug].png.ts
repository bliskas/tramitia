import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const categories: Record<string, string> = {
  apostillas: 'Apostillas',
  documentos: 'Documentos',
  tramites: 'Trámites',
  guias: 'Guías',
  noticias: 'Noticias',
};

const countryLabels: Record<string, string> = {
  venezuela: 'Venezuela',
  argentina: 'Argentina',
  colombia: 'Colombia',
  ecuador: 'Ecuador',
  peru: 'Perú',
  bolivia: 'Bolivia',
};

// Load fonts once at module level
const fontsDir = join(process.cwd(), 'node_modules/@fontsource/inter/files');
const interRegular = readFileSync(join(fontsDir, 'inter-latin-400-normal.woff'));
const interSemiBold = readFileSync(join(fontsDir, 'inter-latin-600-normal.woff'));
const interBold = readFileSync(join(fontsDir, 'inter-latin-700-normal.woff'));

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

function buildBadges(categoryLabel: string, countryLabel: string | null) {
  const badges: any[] = [
    {
      type: 'span',
      props: {
        style: {
          backgroundColor: '#ed5823',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '16px',
          fontWeight: 600,
        },
        children: categoryLabel,
      },
    },
  ];

  if (countryLabel) {
    badges.push({
      type: 'span',
      props: {
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.85)',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '16px',
          fontWeight: 600,
        },
        children: countryLabel,
      },
    });
  }

  return badges;
}

export async function GET({ props }: APIContext) {
  const { post } = props as any;
  const { title, category, country } = post.data;

  const categoryLabel = categories[category] || category;
  const countryLabel = country ? countryLabels[country] || country : null;
  const fontSize = title.length > 70 ? 36 : title.length > 50 ? 42 : 48;

  const element = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#23265a',
        backgroundImage: 'linear-gradient(135deg, #23265a 0%, #1a1d4a 50%, #2d1f3d 100%)',
        fontFamily: 'Inter',
      },
      children: [
        // Decorative circle — bottom-right (absolute)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              bottom: '-120px',
              right: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '200px',
              backgroundColor: 'rgba(237, 88, 35, 0.12)',
            },
          },
        },
        // Decorative circle — top-right (absolute)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: '-40px',
              right: '180px',
              width: '160px',
              height: '160px',
              borderRadius: '80px',
              backgroundColor: 'rgba(237, 88, 35, 0.06)',
            },
          },
        },
        // Content wrapper
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
              padding: '60px 64px',
            },
            children: [
              // Top: category + country badges
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  },
                  children: buildBadges(categoryLabel, countryLabel),
                },
              },
              // Center: title
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    justifyContent: 'center',
                    paddingRight: '40px',
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        color: 'white',
                        fontSize: `${fontSize}px`,
                        fontWeight: 700,
                        lineHeight: '1.25',
                        letterSpacing: '-0.02em',
                      },
                      children: title,
                    },
                  },
                },
              },
              // Bottom: accent bar + branding
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          width: '80px',
                          height: '4px',
                          backgroundColor: '#ed5823',
                          borderRadius: '2px',
                        },
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '22px',
                          fontWeight: 400,
                        },
                        children: 'tramitia.es',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' as const },
      { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' as const },
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' as const },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
