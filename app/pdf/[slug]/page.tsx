/**
 * Dynamic PDF Tool Page Route
 * 
 * This route automatically generates all PDF tool pages at build time using SSG.
 * 
 * How it works:
 * 1. At build time, Next.js calls generateStaticParams()
 * 2. This function returns all { slug } combinations from pdfTools.ts
 * 3. For each slug, a static HTML page is pre-rendered
 * 4. At runtime, users get instant static pages with zero processing
 * 5. Add new tools to pdfTools.ts, and pages auto-generate at next build
 * 
 * Benefits:
 * - 163+ pages built once at deploy time
 * - ~0ms load time (static CDN delivery)
 * - Massive SEO advantages (pre-rendered HTML)
 * - No runtime database queries needed
 * - Perfect for Vercel deployment
 * 
 * URL Structure: /pdf/[slug]
 * Examples:
 * - /pdf/merge-pdf
 * - /pdf/compress-pdf
 * - /pdf/pdf-to-jpg
 * 
 * Vercel ISR (Incremental Static Regeneration):
 * Pages can be updated on-demand via webhook without full rebuild
 * Add `revalidate: 3600` for hourly regeneration
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { pdfTools } from '@/data/pdfTools';
import { generateMetadata as generateMetadataUtil } from '@/utils/seo';

function getPdfActionHref(slug: string): string | null {
  const exactMatches: Record<string, string> = {
    'merge-pdf': '/tools/pdf/merge',
    'split-pdf': '/tools/pdf/split',
    'pdf-to-word': '/tools/pdf/pdf-to-word',
    'pdf-to-image': '/tools/pdf/pdf-to-image',
    'pdf-to-jpg': '/tools/pdf/pdf-to-image',
    'jpg-to-pdf': '/pdf/jpg-to-pdf',
    'jpeg-to-pdf': '/pdf/jpg-to-pdf',
    'png-to-pdf': '/pdf/jpg-to-pdf',
    'webp-to-pdf': '/pdf/jpg-to-pdf',
    'bmp-to-pdf': '/pdf/jpg-to-pdf',
    'gif-to-pdf': '/pdf/jpg-to-pdf',
    'image-to-pdf': '/pdf/jpg-to-pdf',
  };

  if (exactMatches[slug]) {
    return exactMatches[slug];
  }

  if (slug.includes('merge')) {
    return '/tools/pdf/merge';
  }

  if (slug.includes('split') || slug.includes('extract') || slug.includes('remove-pages')) {
    return '/tools/pdf/split';
  }

  if (slug.includes('to-word') || slug.includes('pdf-to-doc') || slug.includes('pdf-to-docx')) {
    return '/tools/pdf/pdf-to-word';
  }

  if (
    slug.includes('pdf-to-image') ||
    slug.includes('pdf-to-jpg') ||
    slug.includes('pdf-to-jpeg') ||
    slug.includes('pdf-to-png') ||
    slug.includes('pdf-to-webp')
  ) {
    return '/tools/pdf/pdf-to-image';
  }

  if (slug.includes('to-pdf') && (slug.includes('jpg') || slug.includes('jpeg') || slug.includes('png') || slug.includes('webp') || slug.includes('gif') || slug.includes('bmp') || slug.includes('image'))) {
    return '/pdf/jpg-to-pdf';
  }

  return null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate all possible static pages at build time
 * Returns array of { slug } objects for each PDF tool
 * 
 * Example output:
 * [
 *   { slug: 'merge-pdf' },
 *   { slug: 'split-pdf' },
 *   { slug: 'compress-pdf' },
 *   ...
 * ]
 */
export async function generateStaticParams() {
  // Return all PDF tool slugs for static generation
  return pdfTools.map((tool) => ({
    slug: tool.slug,
  }));
}

/**
 * Generate dynamic metadata for each page
 * Called at build time for each slug from generateStaticParams()
 * 
 * Next.js creates:
 * - <title> tag
 * - <meta name="description"> tag
 * - <meta name="og:*"> tags
 * - Canonical URL
 * - Twitter cards
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const tool = pdfTools.find((t) => t.slug === params.slug);

  if (!tool) {
    return {
      title: 'PDF Tool Not Found',
      description: 'The PDF tool you are looking for could not be found.',
    };
  }

  return generateMetadataUtil(tool, 'https://resizelab.io', 'pdf');
}

/**
 * Page component for individual PDF tool
 * Receives the slug from URL and finds matching tool
 * Renders ToolPageTemplate with tool data
 */
export default async function PDFToolPage(props: PageProps) {
  const params = await props.params;

  // Find the tool that matches the slug
  const tool = pdfTools.find((t) => t.slug === params.slug);

  // If tool not found, return 404
  if (!tool) {
    notFound();
  }

  // Find related tools in the same category
  // Exclude current tool, show 3-4 related tools
  const relatedTools = pdfTools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3)
    .map((t) => ({
      name: t.name,
      slug: t.slug,
      category: t.category,
    }));

  const specificActionHref = getPdfActionHref(tool.slug);
  const actionHref = specificActionHref ?? '/tools/pdf';
  const actionLabel = specificActionHref ? 'Open Converter' : 'Browse PDF Tools';

  return (
    <ToolPageTemplate
      tool={tool}
      routeType="pdf"
      relatedTools={relatedTools}
      actionHref={actionHref}
      actionLabel={actionLabel}
    />
  );
}

/**
 * Revalidation Configuration for ISR (Incremental Static Regeneration)
 * 
 * NOTE: Uncomment for Vercel ISR support
 * Pages will be regenerated every 24 hours (86400 seconds)
 * This allows updating pages without full rebuild
 * 
 * export const revalidate = 86400; // 24 hours
 * 
 * For on-demand regeneration, set up a webhook:
 * https://vercel.com/docs/functions/edge-middleware/middleware-api#revalidatepath
 */

/**
 * Performance Hints for Next.js Cache
 * 
 * These are already optimized:
 * - generateStaticParams() - builds all 163+ pages at deploy time ✓
 * - generateMetadata() - creates unique SEO tags per page ✓
 * - notFound() - returns proper 404 for invalid slugs ✓
 * - async/await - uses proper async data fetching ✓
 * 
 * Monitoring:
 * - Check build logs to verify all pages generate
 * - ~163 pages should build in <30 seconds
 * - Each page is ~15-20KB (gzipped ~3-4KB)
 */
