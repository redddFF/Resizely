import { MetadataRoute } from 'next';
import { formats } from '@/lib/formats';
import { pdfTools } from '@/data/pdfTools';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quicktoolhub.tech';

const imageToolSlugs = ['resize', 'compress', 'convert'];
const pdfToolRouteSlugs = ['merge', 'split', 'pdf-to-image', 'pdf-to-word'];

function makeEntry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    makeEntry('', now, 'weekly', 1.0),
    makeEntry('/about', now, 'monthly', 0.7),
    makeEntry('/privacy', now, 'yearly', 0.5),
    makeEntry('/terms', now, 'yearly', 0.5),
    makeEntry('/ad-image-sizes', now, 'weekly', 0.75),
    makeEntry('/blog-image-sizes', now, 'weekly', 0.75),
    makeEntry('/ecommerce-image-sizes', now, 'weekly', 0.75),
    makeEntry('/social-media-image-sizes', now, 'weekly', 0.75),
    makeEntry('/tools/pdf', now, 'weekly', 0.85),
    makeEntry('/pdf/merge', now, 'weekly', 0.85),
    makeEntry('/pdf/split', now, 'weekly', 0.85),
    makeEntry('/pdf/jpg-to-pdf', now, 'weekly', 0.85),
    makeEntry('/pdf/pdf-to-jpg', now, 'weekly', 0.85),
    makeEntry('/pdf/pdf-to-image', now, 'weekly', 0.85),
  ];

  const imageFormatPages: MetadataRoute.Sitemap = formats.flatMap((format) => [
    makeEntry(`/resize-image/${format.slug}`, now, 'weekly', 0.9),
    // Keep legacy SEO pages indexed while primary canonical points to /resize-image.
    makeEntry(`/resize/${format.slug}`, now, 'monthly', 0.65),
  ]);

  const pdfToolPages: MetadataRoute.Sitemap = pdfTools.map((tool) =>
    makeEntry(`/pdf/${tool.slug}`, now, 'weekly', 0.85)
  );

  const converterToolPages: MetadataRoute.Sitemap = [
    ...imageToolSlugs.map((slug) => makeEntry(`/tools/image/${slug}`, now, 'weekly', 0.8)),
    ...pdfToolRouteSlugs.map((slug) => makeEntry(`/tools/pdf/${slug}`, now, 'weekly', 0.8)),
  ];

  const entries = [
    ...staticPages,
    ...imageFormatPages,
    ...pdfToolPages,
    ...converterToolPages,
  ];

  // Deduplicate by URL in case static and dynamic lists overlap.
  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
  entries.forEach((entry) => {
    uniqueEntries.set(entry.url, entry);
  });

  return Array.from(uniqueEntries.values());
}
