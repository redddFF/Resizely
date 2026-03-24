/**
 * Dynamic Sitemap Generation
 * 
 * This file generates a complete sitemap.xml that includes:
 * - All 150+ image format pages
 * - All ~13 PDF tool pages
 * - Category landing pages
 * - Main navigation pages
 * 
 * Benefits:
 * - Automatic inclusion of all 163+ pages
 * - Proper priority hierarchy (homepage > categories > tools)
 * - Change frequency indicators for search engines
 * - Last modified dates for cache invalidation
 * - Helps Google discover and index new pages
 * 
 * Sitemap is accessible at:
 * https://resizelab.io/sitemap.xml
 */

import { MetadataRoute } from 'next';
import { formats } from '@/lib/formats';
import { pdfTools } from '@/data/pdfTools';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://resizelab.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0];

  // 1. Main navigation pages (highest priority)
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 2. Tool category landing pages (high priority)
  const categories = new Set<string>();
  formats.forEach((format) => categories.add(format.category));
  pdfTools.forEach((tool) => {
    if (tool.category) categories.add(tool.category);
  });

  const categoryPages: MetadataRoute.Sitemap = Array.from(categories).map((category) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[&\/]/g, '');
    return {
      url: `${baseUrl}/tools/${categorySlug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    };
  });

  // 3. Image format pages (150+ pages)
  const imageFormatPages: MetadataRoute.Sitemap = formats.map((format) => ({
    url: `${baseUrl}/resize/${format.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 4. PDF tool pages (~13 pages)
  const pdfToolPages: MetadataRoute.Sitemap = pdfTools.map((tool) => ({
    url: `${baseUrl}/pdf/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 5. Category-specific tool pages (optional - for better linking structure)
  const categoryToolPages: MetadataRoute.Sitemap = [];

  formats.forEach((format) => {
    const categorySlug = format.category
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[&\/]/g, '');
    categoryToolPages.push({
      url: `${baseUrl}/tools/${categorySlug}/${format.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  });

  pdfTools.forEach((tool) => {
    const categorySlug = (tool.category || 'pdf-tools')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[&\/]/g, '');
    categoryToolPages.push({
      url: `${baseUrl}/tools/${categorySlug}/${tool.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Combine all pages
  // Total: ~1 (homepage) + 4 (main) + 10-15 (categories) + 150 (formats) + 13 (PDF) + 163 (category-specific) = ~350+
  return [
    ...mainPages,
    ...categoryPages,
    ...imageFormatPages,
    ...pdfToolPages,
    ...categoryToolPages,
  ];
}

/**
 * Performance Notes
 * 
 * Sitemap Generation:
 * - All pages generated at build time
 * - Revalidated when formats.ts or pdfTools.ts changes
 * - File size ~50-100KB (well within limits)
 * - Gzipped ~5-10KB for efficient delivery
 * 
 * Google Sitemap Requirements:
 * - Max 50,000 URLs per file (we have ~350)
 * - Max 50MB uncompressed (we have <100KB)
 * - Update frequency recommendations followed
 * - Priority hierarchy (0.0-1.0) properly structured
 * 
 * Submission:
 * 1. Add to robots.txt: Sitemap: https://resizelab.io/sitemap.xml
 * 2. Submit to Google Search Console
 * 3. Submit to Bing Webmaster Tools
 * 4. Resubmit after major updates
 */
