import { MetadataRoute } from 'next';
import { formats } from '@/lib/formats';

// Get your actual domain - adjust this for your deployment
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  const formatUrls: MetadataRoute.Sitemap = formats.map((format) => ({
    url: `${baseUrl}/resize-image/${format.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...formatUrls];
}
