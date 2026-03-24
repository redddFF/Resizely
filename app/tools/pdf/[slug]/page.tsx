/**
 * PDF Tool Route Handler
 * 
 * Dynamically generates tool pages for PDF operations from pdfTools.ts data
 * 
 * Routes Created:
 * - /tools/pdf/merge
 * - /tools/pdf/split
 * 
 * Each route fetches tool data from pdfTools.ts and renders PDFToolPage
 * with appropriate API endpoint configuration
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pdfTools } from '@/data/pdfTools';
import PDFToolPage from '@/components/tools/PDFToolPage';
import { buildPdfToolMetadata } from '@/lib/toolSeo';

// Map tool slugs to their API endpoints and types
const toolConfig = {
  merge: {
    name: 'Merge PDF',
    category: 'PDF Tools',
    apiEndpoint: '/api/convert-pdf/merge',
    toolType: 'merge' as const,
  },
  split: {
    name: 'Split PDF',
    category: 'PDF Tools',
    apiEndpoint: '/api/convert-pdf/split',
    toolType: 'split' as const,
  },
  'pdf-to-image': {
    name: 'PDF to Image',
    category: 'PDF Tools',
    apiEndpoint: '/api/convert-pdf/pdf-to-image',
    toolType: 'pdfToImage' as const,
  },
  'pdf-to-word': {
    name: 'PDF to Word',
    category: 'PDF Tools',
    apiEndpoint: '/api/convert-pdf/pdf-to-word',
    toolType: 'pdfToWord' as const,
  },
};

// Generate static paths for all PDF tools
export async function generateStaticParams() {
  return Object.keys(toolConfig).map((slug) => ({
    slug,
  }));
}

// Generate SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug as keyof typeof toolConfig;
  const config = toolConfig[slug];

  if (!config) {
    return {};
  }

  return buildPdfToolMetadata(
    {
      name: config.name,
      slug,
      description: `Free online ${config.name.toLowerCase()} tool. ${config.name} your PDF files instantly.`,
      category: config.category,
    },
    `/tools/pdf/${slug}`
  );
}

export default async function PDFToolRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug as keyof typeof toolConfig;
  const config = toolConfig[slug];

  if (!config) {
    notFound();
  }

  // Create tool object with API configuration
  const tool = {
    id: slug,
    name: config.name,
    slug,
    description: `Professional ${config.name.toLowerCase()} tool for PDF documents. ${config.toolType === 'merge' ? 'Combine multiple PDF files into one' : 'Extract specific pages from your PDF'} instantly.`,
    seoContent: `Our ${config.name.toLowerCase()} tool makes it easy to manage PDF documents without any coding or technical knowledge. Perfect for students, professionals, and content creators.`,
    category: config.category,
    features: [
      'Fast processing',
      'No quality loss',
      'Support for large files',
      'Free to use',
      'No registration required',
    ],
    faqs: [
      {
        question: `How does ${config.name.toLowerCase()} work?`,
        answer: `Simply upload your PDF file(s), configure the ${config.toolType === 'merge' ? 'merge order' : 'pages to extract'}, and click process. Your file will be processed instantly.`,
      },
      {
        question: 'What is the file size limit?',
        answer: `We support individual files up to 100MB. ${config.toolType === 'merge' ? 'Total size for merging up to 500MB.' : ''}`,
      },
      {
        question: 'Is my file secure?',
        answer: 'Yes, all processing happens on your device. Files are never stored on our servers.',
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No, our tool is completely free and requires no registration.',
      },
    ],
  };

  return (
    <PDFToolPage
      tool={tool}
      toolType={config.toolType}
      apiEndpoint={config.apiEndpoint}
      currentPath={`/tools/pdf/${slug}`}
    />
  );
}
