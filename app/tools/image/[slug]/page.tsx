/**
 * Image Tool Route Handler
 * 
 * Dynamically generates tool pages for image conversions from formats.ts data
 * 
 * Routes Created:
 * - /tools/image/resize
 * - /tools/image/compress
 * - /tools/image/convert
 * 
 * Each route fetches tool data from formats.ts and renders ImageToolPage
 * with appropriate API endpoint configuration
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formats } from '@/lib/formats';
import ImageToolPage from '@/components/tools/ImageToolPage';

// Map tool slugs to their API endpoints and types
const toolConfig = {
  resize: {
    name: 'Resize Image',
    category: 'Image Tools',
    apiEndpoint: '/api/convert-image/resize',
    toolType: 'resize' as const,
  },
  compress: {
    name: 'Compress Image',
    category: 'Image Tools',
    apiEndpoint: '/api/convert-image/compress',
    toolType: 'compress' as const,
  },
  convert: {
    name: 'Convert Image',
    category: 'Image Tools',
    apiEndpoint: '/api/convert-image/convert',
    toolType: 'convert' as const,
  },
};

// Generate static paths for all image tools
export async function generateStaticParams() {
  return Object.keys(toolConfig).map((slug) => ({
    slug,
  }));
}

// Generate SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug as keyof typeof toolConfig;
  const config = toolConfig[slug];

  if (!config) {
    return {};
  }

  return {
    title: `${config.name} | Resizely`,
    description: `Free online ${config.name.toLowerCase()} tool. ${config.name} your images instantly without losing quality.`,
    openGraph: {
      title: config.name,
      description: `Free online ${config.name.toLowerCase()} tool`,
      type: 'website',
    },
  };
}

export default async function ImageToolRoute({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug as keyof typeof toolConfig;
  const config = toolConfig[slug];

  if (!config) {
    notFound();
  }

  // Create tool object with API configuration
  const tool = {
    id: slug,
    name: config.name,
    slug,
    description: `Professional ${config.name.toLowerCase()} tool for web and digital media. Compress, resize, and convert images in seconds.`,
    seoContent: `Our ${config.name.toLowerCase()} tool makes it easy to process images without any coding or technical knowledge. Perfect for designers, photographers, and content creators.`,
    category: config.category,
    features: [
      'Fast processing',
      'No quality loss',
      'Batch processing support',
      'Free to use',
      'No registration required',
    ],
    faqs: [
      {
        question: `What formats does the ${config.name.toLowerCase()} support?`,
        answer: 'Our tool supports PNG, JPEG, WebP, GIF, BMP and SVG formats.',
      },
      {
        question: 'Is my file secure?',
        answer: 'Yes, all processing happens on your device. Files are never stored on our servers.',
      },
      {
        question: 'What is the file size limit?',
        answer: 'We support files up to 50MB in size.',
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No, our tool is completely free and requires no registration.',
      },
    ],
  };

  return (
    <ImageToolPage
      tool={tool}
      toolType={config.toolType}
      apiEndpoint={config.apiEndpoint}
    />
  );
}
