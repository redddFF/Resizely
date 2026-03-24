import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formats } from '@/lib/formats';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const metadata: Metadata = {
  title: 'Blog & Website Image Sizes: Perfect Dimensions for WordPress & More',
  description: 'Complete guide to blog and website image dimensions. Get perfect sizes for featured images, hero banners, blog thumbnails, and more.',
  keywords: 'blog image size, WordPress featured image, website hero image dimensions',
  openGraph: {
    title: 'Blog & Website Image Sizes Guide',
    description: 'Complete guide to image sizes for blogs, websites, and content publishing platforms.',
    type: 'website',
    url: `${baseUrl}/blog-image-sizes`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
      },
    ],
  },
};

export default function BlogImageSizesPage() {
  const blogFormats = formats.filter((f) => f.category === 'Web & Blog' || f.category === 'Email & Marketing');

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Blog & Website Image Sizes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Blog & Website Image Sizes Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Master the perfect dimensions for WordPress featured images, hero banners, newsletter headers, and all your web content. Improve SEO and user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm dark:prose-invert">
          <h2>Why Image Sizing Matters for Websites and Blogs</h2>
          <p>
            Website performance directly impacts user experience and SEO rankings. Properly sized images load faster, reduce bounce rates, and improve conversion rates. Google's Core Web Vitals now include image loading performance, making optimization essential for search ranking.
          </p>

          <h2>WordPress Featured Image Best Practices</h2>
          <p>
            WordPress themes typically display featured images at 1200 x 627 pixels (1.91:1 aspect ratio). This size offers the best balance between visual impact and file size, ensuring fast page loads while maintaining clarity on all devices.
          </p>

          <h2>Website Hero Image Dimensions</h2>
          <p>
            Hero images are the first visual element visitors see. Recommended dimensions are 1920 x 1080 pixels (16:9 aspect ratio) for desktop, with responsive scaling for mobile. High-quality hero images significantly impact first impressions and click-through rates.
          </p>

          <h2>Blog Post Thumbnail Optimization</h2>
          <p>
            Blog thumbnails appearing in listings should be 1200 x 627 pixels. This size works perfectly for social sharing (OpenGraph), email newsletters, and blog archives. Consistent thumbnail dimensions across your blog creates a professional, polished appearance.
          </p>

          <h2>Email Newsletter Banner Sizes</h2>
          <p>
            Email newsletters visualize best at 600 x 200 pixels (3:1 aspect ratio) for headers and 1200 x 400 pixels for wider banners. Most email clients display at 600px width, so images optimized for this width ensure compatibility across all email platforms.
          </p>

          <h2>Responsive Image Strategy</h2>
          <ul>
            <li><strong>Mobile First:</strong> Design for mobile screens first, then scale up for desktop</li>
            <li><strong>Scaling:</strong> Use CSS to scale images responsively without changing dimensions</li>
            <li><strong>Lazy Loading:</strong> Implement lazy loading for below-the-fold images</li>
            <li><strong>Optimization:</strong> Compress images to reduce file size without sacrificing quality</li>
            <li><strong>Formats:</strong> Use WebP for faster loading when browser support is available</li>
          </ul>

          <h2>SEO Best Practices for Blog Images</h2>
          <ul>
            <li><strong>Alt Text:</strong> Always include descriptive alt text for accessibility and SEO</li>
            <li><strong>File Names:</strong> Use descriptive file names (blog-seo-tips.jpg, not IMG_001.jpg)</li>
            <li><strong>Captions:</strong> Add captions to featured images for additional keyword context</li>
            <li><strong>Structured Data:</strong> Use ImageObject schema markup for rich snippets</li>
            <li><strong>Sitemap:</strong> Include images in XML sitemaps to improve discoverability</li>
          </ul>

          <h2>Performance Optimization Tips</h2>
          <ul>
            <li>Start with high-quality source images (minimum 72 DPI)</li>
            <li>Use modern compression tools to reduce file size</li>
            <li>Implement next/image in Next.js for automatic optimization</li>
            <li>Test page load times with Google PageSpeed Insights</li>
            <li>Monitor Core Web Vitals in Google Search Console</li>
          </ul>

          <h2>Common Website Image Mistakes</h2>
          <ul>
            <li>Using oversized images that load slowly</li>
            <li>Uploading high-resolution images without compression</li>
            <li>Neglecting mobile image optimization</li>
            <li>Missing alt text on images</li>
            <li>Using inconsistent image dimensions across pages</li>
          </ul>
        </div>
      </section>

      {/* Formats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-6">Blog & Website Image Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogFormats.map((format) => (
              <Link key={format.slug} href={`/resize-image/${format.slug}`}>
                <Card className="p-5 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{format.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format.width} × {format.height} px • {format.aspectRatio}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{format.description}</p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                      Resize Now
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Optimize Your Blog Images Now</h2>
          <p className="text-muted-foreground text-lg">
            Resize images with exact dimensions for WordPress, blogs, and websites.
          </p>
          <Link href="/resize-image/blog-thumbnail">
            <Button size="lg">
              Start Resizing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
