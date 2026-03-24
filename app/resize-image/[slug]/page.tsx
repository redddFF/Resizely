import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResizeImagePage } from '@/components/ResizeImagePage';
import { StructuredData } from '@/components/StructuredData';
import {
  getFormatBySlug,
  getAllFormatSlugs,
  getRelatedFormats,
} from '@/lib/formats';
import { buildImageFormatMetadata } from '@/lib/toolSeo';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const format = getFormatBySlug(slug);

  if (!format) {
    return {
      title: 'Format Not Found',
    };
  }

  return buildImageFormatMetadata(
    {
      ...format,
      width: format.width,
      height: format.height,
    },
    `/resize-image/${slug}`
  );
}

export async function generateStaticParams() {
  return getAllFormatSlugs().map((slug) => ({
    slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const format = getFormatBySlug(slug);

  if (!format) {
    notFound();
  }

  const relatedFormats = getRelatedFormats(slug, 5);

  return (
    <main className="min-h-screen bg-background">
      <StructuredData format={format} baseUrl={baseUrl} />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <ResizeImagePage format={format} relatedFormats={relatedFormats} />
      </div>
    </main>
  );
}
