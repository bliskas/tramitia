// Generadores de Schema.org JSON-LD

const siteUrl = 'https://tramitia.es';
const siteName = 'Tramitia';

// Schema para WebSite (importante para sitelinks y AEO)
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: 'Apostillas y tramites de documentos latinoamericanos desde Espana',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Schema para Organization (página principal)
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Servicios de apostilla y legalización de documentos latinoamericanos para uso internacional.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34-XXX-XXX-XXX',
      contactType: 'customer service',
      availableLanguage: ['Spanish'],
    },
    sameAs: [
      // Añadir redes sociales
    ],
  };
}

// Schema para LocalBusiness (si aplica)
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    url: siteUrl,
    telephone: '+34-XXX-XXX-XXX',
    email: 'hola@tramitia.es',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  };
}

// Schema para Service (páginas de servicio)
export function getServiceSchema(service: {
  name: string;
  description: string;
  price?: string;
  deliveryTime: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Spain',
    },
    serviceType: 'Document Legalization',
    url: `${siteUrl}/servicios/${service.slug}`,
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'EUR',
      },
    }),
  };
}

// Schema para FAQ (muy importante para SEO)
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Schema para HowTo (guías paso a paso)
export function getHowToSchema(howTo: {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: { value: string; currency: string };
  steps: Array<{ name: string; text: string; image?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    ...(howTo.totalTime && { totalTime: howTo.totalTime }),
    ...(howTo.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: howTo.estimatedCost.currency,
        value: howTo.estimatedCost.value,
      },
    }),
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
  };
}

// Schema para Breadcrumb
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

// Schema para Article (posts de blog)
export function getArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  updatedDate?: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/blog/${article.slug}`,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author || siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`,
      },
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${article.slug}`,
    },
  };
}

// Genera sitemap entries
export function generateSitemapEntry(
  url: string,
  lastmod: string,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.7
) {
  return {
    url: url.startsWith('http') ? url : `${siteUrl}${url}`,
    lastmod,
    changefreq,
    priority,
  };
}
