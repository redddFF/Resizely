import { MetadataRoute } from 'next';

// Get your actual domain - adjust this for your deployment
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quicktoolhub.tech';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
