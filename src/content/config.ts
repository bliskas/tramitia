import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    updatedDate: z.string().optional(),
    author: z.string().default('Tramitia'),
    image: z.string().optional(),
    category: z.enum([
      'apostillas',
      'documentos',
      'tramites',
      'guias',
      'noticias',
    ]),
    keywords: z.array(z.string()).default([]),
    // Para SEO programático
    country: z.string().optional(), // argentina, colombia, etc.
    documentType: z.string().optional(), // partida-nacimiento, antecedentes, etc.
    targetCountry: z.string().optional(), // españa, italia, etc.
    draft: z.boolean().default(false),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    price: z.string().optional(),
    deliveryTime: z.string(),
    country: z.string(),
    documentType: z.string(),
    requirements: z.array(z.string()),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  services: servicesCollection,
};
