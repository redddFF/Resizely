/**
 * SEO & Metadata Utilities
 * 
 * This file contains helper functions for generating:
 * - Meta tags (title, description, keywords, OG tags)
 * - JSON-LD structured data for rich snippets
 * - Canonical URLs
 * - Long-tail keywords
 * 
 * Used by all dynamic pages to ensure consistent, optimized SEO.
 */

import { Metadata } from 'next';

export interface ToolData {
  name: string;
  slug: string;
  description: string;
  seoContent: string;
  category?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

/**
 * Generate long-tail keywords based on tool name and category
 * Creates variations like:
 * - "tool name free online"
 * - "how to use tool name"
 * - "best tool name"
 */
export function generateLongTailKeywords(toolName: string, category?: string): string[] {
  const keywords: string[] = [];
  const baseTerm = toolName.toLowerCase();
  
  // Basic variations
  keywords.push(`${baseTerm} free`);
  keywords.push(`${baseTerm} online`);
  keywords.push(`free ${baseTerm} tool`);
  keywords.push(`${baseTerm} online tool`);
  keywords.push(`best ${baseTerm}`);
  
  // How-to variations
  keywords.push(`how to ${baseTerm}`);
  keywords.push(`how to use ${baseTerm}`);
  keywords.push(`${baseTerm} tutorial`);
  
  // Action-based variations
  if (baseTerm.includes('convert')) {
    keywords.push(`convert to ${baseTerm.split(' ')[1]}`);
    keywords.push(`${baseTerm} without signup`);
  }
  if (baseTerm.includes('merge')) {
    keywords.push(`${baseTerm} easily`);
    keywords.push(`${baseTerm} free online`);
  }
  if (baseTerm.includes('split')) {
    keywords.push(`${baseTerm} pages`);
    keywords.push(`${baseTerm} online`);
  }
  
  // Category-based variations
  if (category) {
    keywords.push(`${category} ${baseTerm}`);
    keywords.push(`${category} tool`);
  }
  
  // Question format (common in voice search)
  keywords.push(`what is ${baseTerm}`);
  keywords.push(`why use ${baseTerm}`);
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate Meta title (optimized for Google - 50-60 characters)
 * Pattern: "[Tool Name] - [Benefit] | [Brand]"
 */
export function generateMetaTitle(toolName: string, category?: string, seoContent?: string): string {
  // Extract benefits from seoContent or use defaults
  let benefit = 'Free Online Tool';
  
  if (toolName.toLowerCase().includes('convert')) {
    benefit = 'Fast Conversion';
  } else if (toolName.toLowerCase().includes('merge')) {
    benefit = 'Instant Merge';
  } else if (toolName.toLowerCase().includes('split')) {
    benefit = 'Easy Split';
  } else if (toolName.toLowerCase().includes('compress')) {
    benefit = 'Size Reduction';
  } else if (toolName.toLowerCase().includes('extract')) {
    benefit = 'Quick Extract';
  }
  
  return `${toolName} - ${benefit} | Resizelab`;
}

/**
 * Generate Meta description (optimized for Google - 150-160 characters)
 * Using provided description or generating one
 */
export function generateMetaDescription(
  toolName: string,
  description: string,
  category?: string
): string {
  let metaDesc = description;
  
  // Ensure proper length
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + '...';
  } else if (metaDesc.length < 120) {
    // Pad with additional info
    if (category) {
      metaDesc = `${description} Explore our ${category} tools for professionals.`;
    } else {
      metaDesc = `${description} Free online tool with instant results.`;
    }
  }
  
  return metaDesc;
}

/**
 * Generate complete Metadata object for Next.js
 * Includes title, description, OpenGraph, Twitter cards
 */
export function generateMetadata(
  tool: ToolData,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
): Metadata {
  const slug = tool.slug;
  const route = routeType === 'image' ? `/resize/${slug}` : `/pdf/${slug}`;
  const fullUrl = `${baseUrl}${route}`;
  
  const title = generateMetaTitle(tool.name, tool.category);
  const description = generateMetaDescription(tool.name, tool.description, tool.category);
  const keywords = generateLongTailKeywords(tool.name, tool.category);
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    
    // Open Graph (Facebook, LinkedIn, Pinterest)
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: 'website',
      siteName: 'Resizelab',
      images: [
        {
          url: `${baseUrl}/og-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: tool.name,
          type: 'image/jpeg',
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/twitter-${slug}.jpg`],
      creator: '@Resizelab',
    },
    
    // Alternative URLs
    alternates: {
      canonical: fullUrl,
      languages: {
        en: `${fullUrl}?lang=en`,
      },
    },
    
    // Robots directives
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

/**
 * Generate JSON-LD structured data for SoftwareApplication schema
 * Improves rich snippets in search results
 */
export function generateSoftwareApplicationSchema(
  tool: ToolData,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
) {
  const route = routeType === 'image' ? `/resize/${tool.slug}` : `/pdf/${tool.slug}`;
  const url = `${baseUrl}${route}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    image: `${baseUrl}/og-${tool.slug}.jpg`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'Resizelab',
      url: baseUrl,
    },
    // Ratings (can be dynamic based on reviews)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2500',
    },
  };
}

/**
 * Generate JSON-LD BreadcrumbList schema
 * Helps with site navigation in search results
 */
export function generateBreadcrumbSchema(
  toolName: string,
  slug: string,
  category?: string,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
) {
  const route = routeType === 'image' ? '/resize' : '/pdf';
  
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: `${routeType === 'image' ? 'Image' : 'PDF'} Tools`,
      item: `${baseUrl}${route}`,
    },
  ];
  
  // Add category if provided
  if (category) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: category,
      item: `${baseUrl}${route}?category=${category.toLowerCase().replace(/\s/g, '-')}`,
    });
  }
  
  // Add current page
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: toolName,
    item: `${baseUrl}${route}/${slug}`,
  });
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Generate JSON-LD FAQ schema
 * Shows FAQs directly in search results
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }> | undefined) {
  if (!faqs || faqs.length === 0) {
    return null;
  }
  
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
 * Generate JSON-LD WebApplication schema
 * Better for tools/apps that function entirely in browser
 */
export function generateWebApplicationSchema(
  tool: ToolData,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
) {
  const route = routeType === 'image' ? `/resize/${tool.slug}` : `/pdf/${tool.slug}`;
  const url = `${baseUrl}${route}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url,
    image: `${baseUrl}/og-${tool.slug}.jpg`,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Resizelab',
      logo: `${baseUrl}/logo.png`,
      url: baseUrl,
    },
  };
}

/**
 * Generate all structured data for a page
 * Returns all relevant JSON-LD schemas as a combined object
 */
export function generateAllStructuredData(
  tool: ToolData,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
) {
  const schemas = [
    generateSoftwareApplicationSchema(tool, baseUrl, routeType),
    generateBreadcrumbSchema(tool.name, tool.slug, tool.category, baseUrl, routeType),
    generateFAQSchema(tool.faqs),
  ];
  
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.filter((schema) => schema !== null),
  };
}

/**
 * Generate 301 redirect mapping for old URLs
 * Useful when restructuring site without losing SEO value
 */
export function generateRedirectMap(oldSlug: string, newSlug: string, type: 'image' | 'pdf') {
  const route = type === 'image' ? '/resize' : '/pdf';
  return {
    source: `${route}/${oldSlug}`,
    destination: `${route}/${newSlug}`,
    permanent: true,
  };
}

/**
 * Generate canonical URL
 * Prevents duplicate content issues
 */
export function generateCanonicalUrl(
  slug: string,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
): string {
  const route = routeType === 'image' ? '/resize' : '/pdf';
  return `${baseUrl}${route}/${slug}`;
}

/**
 * Analyze content quality for SEO
 * Returns metrics on:
 * - Word count
 * - Readability
 * - Keyword usage
 */
export function analyzeSEOContent(content: string, primaryKeyword: string) {
  const words = content.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Calculate keyword density
  const keywordLower = primaryKeyword.toLowerCase();
  const keywordCount = content.toLowerCase().split(keywordLower).length - 1;
  const keywordDensity = ((keywordCount / wordCount) * 100).toFixed(2);
  
  // Estimate reading time (average 200 words per minute)
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  // Count headings
  const headingPattern = /^#{1,6}\s/gm;
  const headingCount = (content.match(headingPattern) || []).length;
  
  // Count paragraphs
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);
  
  return {
    wordCount,
    keywordCount,
    keywordDensity: `${keywordDensity}%`,
    readingTimeMinutes,
    headingCount,
    paragraphCount: paragraphs.length,
    seoScore: calculateSEOScore(wordCount, Number(keywordDensity), headingCount),
  };
}

/**
 * Calculate SEO score (0-100)
 * Based on content metrics
 */
function calculateSEOScore(wordCount: number, keywordDensity: number, headingCount: number): number {
  let score = 0;
  
  // Word count: 300-800 words is ideal
  if (wordCount >= 300 && wordCount <= 800) {
    score += 30;
  } else if (wordCount > 800) {
    score += 25;
  } else if (wordCount >= 200) {
    score += 15;
  }
  
  // Keyword density: 0.5-2% is ideal
  if (keywordDensity >= 0.5 && keywordDensity <= 2) {
    score += 30;
  } else if (keywordDensity > 2 && keywordDensity <= 3) {
    score += 20;
  } else if (keywordDensity < 0.5) {
    score += 10;
  }
  
  // Headings: 3-10 headings is good
  if (headingCount >= 3 && headingCount <= 10) {
    score += 40;
  } else if (headingCount >= 2) {
    score += 20;
  }
  
  return Math.min(score, 100);
}

/**
 * Generate sitemap URLs for all tools
 * Used in sitemap generation
 */
export function generateSitemapEntry(
  tool: ToolData,
  baseUrl: string = 'https://resizelab.io',
  routeType: 'image' | 'pdf' = 'image'
) {
  const route = routeType === 'image' ? '/resize' : '/pdf';
  const url = `${baseUrl}${route}/${tool.slug}`;
  
  return {
    url,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: routeType === 'image' ? 0.8 : 0.85,
  };
}
