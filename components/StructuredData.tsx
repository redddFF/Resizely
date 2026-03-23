'use client';

import Script from 'next/script';
import { generateFAQSchema, generateBreadcrumbSchema, renderJSONLD } from '@/lib/structuredData';
import type { ImageFormat } from '@/lib/formats';

interface StructuredDataProps {
  format: ImageFormat;
  baseUrl?: string;
}

export function StructuredData({ format, baseUrl = 'https://resizelab.io' }: StructuredDataProps) {
  const faqSchema = generateFAQSchema(format.faqs, baseUrl);

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: format.category, url: '/resize-image' },
      { name: format.name },
    ],
    baseUrl
  );

  return (
    <>
      {/* FAQ Schema */}
      <Script
        id={`faq-schema-${format.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJSONLD(faqSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <Script
        id={`breadcrumb-schema-${format.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJSONLD(breadcrumbSchema),
        }}
      />
    </>
  );
}
