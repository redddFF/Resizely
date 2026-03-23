export interface FAQPageSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface WebApplicationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  offers: {
    '@type': string;
    price: string;
  };
}

export interface ImageObjectSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
}

/**
 * Generate FAQ Schema from FAQs array
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  baseUrl: string = ''
): FAQPageSchema {
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

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>,
  baseUrl: string = ''
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      ...(breadcrumb.url && { item: `${baseUrl}${breadcrumb.url}` }),
    })),
  };
}

/**
 * Generate WebApplication Schema (for homepage)
 */
export function generateWebApplicationSchema(baseUrl: string): WebApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Resizelab - Free Image Resizer',
    description: 'Free online image resizer for 150+ social media, ad, and web formats. Resize images instantly with no watermark or sign-up required.',
    url: baseUrl,
    applicationCategory: 'Productivity',
    offers: {
      '@type': 'Offer',
      price: '0',
    },
  };
}

/**
 * Generate Product/ImageObject Schema
 */
export function generateImageObjectSchema(
  name: string,
  description: string,
  image: string,
  baseUrl: string = ''
): ImageObjectSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name,
    description,
    image,
  };
}

/**
 * Render schema as JSON-LD script tag (for use in components)
 */
export function renderJSONLD(schema: Record<string, any>): string {
  return JSON.stringify(schema);
}
