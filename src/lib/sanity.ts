import { createClient } from '@sanity/client';

// Cliente de Sanity
// Configurar con tus credenciales de Sanity
export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'tu-project-id',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // true para producción, false para desarrollo
});

// Tipos de contenido
export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  body: any[]; // Portable Text
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  category: string;
  keywords: string[];
  country?: string;
  documentType?: string;
}

// Queries GROQ
export const queries = {
  // Todos los posts publicados
  allPosts: `*[_type == "post" && !draft] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    publishedAt,
    updatedAt,
    author,
    "mainImage": mainImage.asset->url,
    category,
    keywords,
    country,
    documentType
  }`,

  // Post individual por slug
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    body,
    publishedAt,
    updatedAt,
    author,
    "mainImage": mainImage.asset->url,
    category,
    keywords,
    country,
    documentType
  }`,

  // Posts por categoría
  postsByCategory: `*[_type == "post" && category == $category && !draft] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    publishedAt,
    "mainImage": mainImage.asset->url,
    category
  }`,

  // Posts por país
  postsByCountry: `*[_type == "post" && country == $country && !draft] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    publishedAt,
    "mainImage": mainImage.asset->url,
    category
  }`,

  // Posts recientes (para sidebar/footer)
  recentPosts: `*[_type == "post" && !draft] | order(publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    publishedAt,
    category
  }`,

  // Servicios
  allServices: `*[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    price,
    deliveryTime,
    country,
    documentType
  }`,
};

// Funciones helper
export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(queries.allPosts);
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch(queries.postBySlug, { slug });
}

export async function getPostsByCategory(category: string): Promise<SanityPost[]> {
  return sanityClient.fetch(queries.postsByCategory, { category });
}

export async function getPostsByCountry(country: string): Promise<SanityPost[]> {
  return sanityClient.fetch(queries.postsByCountry, { country });
}

export async function getRecentPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(queries.recentPosts);
}
