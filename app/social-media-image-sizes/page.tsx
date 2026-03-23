import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formats } from '@/lib/formats';
import { generateBreadcrumbSchema, renderJSONLD } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Social Media Image Sizes & Dimensions Guide 2024',
  description: 'Complete guide to social media image sizes for Instagram, Facebook, TikTok, LinkedIn, YouTube, and more. Get perfect dimensions for every platform.',
  keywords: 'social media image sizes, Instagram dimensions, Facebook image size, Twitter image size, social media posts',
  openGraph: {
    title: 'Social Media Image Sizes & Dimensions Guide 2024',
    description: 'Complete guide to social media image sizes for Instagram, Facebook, TikTok, LinkedIn, YouTube, and more.',
    type: 'website',
  },
};

export default function SocialMediaImageSizesPage() {
  // Group all social media formats by platform
  const socialMediaFormats = formats.filter((f) => f.category.includes('Social Media'));

  const platforms = [
    ...new Set(socialMediaFormats.map((f) => f.category).filter((c) => c.includes('Social Media'))),
  ].sort();

  return (
    <main className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-social"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJSONLD(
            generateBreadcrumbSchema(
              [
                { name: 'Home', url: '/' },
                { name: 'Social Media Image Sizes' },
              ],
              process.env.NEXT_PUBLIC_BASE_URL || 'https://resizelab.io'
            )
          ),
        }}
      />
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Social Media Image Sizes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Social Media Image Sizes & Dimensions Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Perfect image dimensions for Instagram, Facebook, TikTok, LinkedIn, YouTube, Twitter, and Pinterest. Maximize engagement with properly sized images on every platform.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm dark:prose-invert">
          <h2>Why Social Media Image Sizes Matter</h2>
          <p>
            Social media platforms have specific image size requirements to ensure your content displays perfectly across all devices. Using the correct dimensions prevents cropping, blurriness, and layout shifts that can reduce engagement and click-through rates.
          </p>
          <p>
            Each platform compresses images differently, and the resolution you upload directly impacts how your posts appear to followers. Oversized images consume more bandwidth, while undersized images may appear pixelated or blurry, damaging your professional image.
          </p>

          <h2>Instagram Image Sizes</h2>
          <p>
            Instagram is one of the most image-centric social platforms, supporting multiple format types. The platform automatically scales images based on aspect ratio, but recommendations are:
          </p>
          <ul>
            <li><strong>Feed Posts:</strong> 1080 x 1080 px (1:1 square) - standard format</li>
            <li><strong>Stories:</strong> 1080 x 1920 px (9:16 vertical) - full-screen display</li>
            <li><strong>Reels:</strong> 1080 x 1920 px (9:16 vertical) - video cover</li>
            <li><strong>Portrait Posts:</strong> 1080 x 1350 px (4:5) - for vertical content</li>
          </ul>

          <h2>Facebook Image Dimensions</h2>
          <p>
            Facebook offers the most diverse image formats and placements. Key dimensions include feed posts (1200 x 630 px), stories (1080 x 1920 px), and ads (1200 x 628 px). Facebook's algorithm rewards native content, so following specifications improves organic reach.
          </p>

          <h2>YouTube Thumbnail & Banner Sizes</h2>
          <p>
            YouTube thumbnails (1280 x 720 px) are crucial for click-through rates. Many creators overlook channel artwork (2560 x 1440 px), which significantly impacts brand perception. YouTube Shorts (1080 x 1920 px) are growing in popularity and require vertical aspect ratios.
          </p>

          <h2>LinkedIn Professional Imaging</h2>
          <p>
            LinkedIn users value professional content. Posts should be 1200 x 627 px, while company banners are 1500 x 500 px. LinkedIn engagement typically increases with compelling visuals that follow these dimensions.
          </p>

          <h2>TikTok Video & Cover Sizes</h2>
          <p>
            TikTok exclusively uses vertical (9:16) aspect ratio at 1080 x 1920 px. This mobile-first approach is optimized for the TikTok algorithm, ensuring maximum visibility across the For You Page.
          </p>

          <h2>Pinterest Pin Dimensions</h2>
          <p>
            Pinterest recommends 1000 x 1500 px (2:3 aspect ratio) for maximum visibility. Tall pins generate more engagement and are more likely to be repinned by users discovering your content.
          </p>

          <h2>Twitter/X Image Specifications</h2>
          <p>
            Twitter supports 1024 x 512 px (2:1) for standard posts and 1500 x 500 px (3:1) for profile headers. Optimizing for these dimensions ensures your content stands out in feeds.
          </p>

          <h2>Pro Tips for Social Media Imaging</h2>
          <ul>
            <li>Always export at the recommended dimensions to avoid platform compression</li>
            <li>Use high-quality source images (at least 72 DPI) for clarity</li>
            <li>Test your images across multiple devices before uploading</li>
            <li>Consider platform-specific design guidelines and brand consistency</li>
            <li>Use our free image resizer to quickly adapt your content to any platform</li>
          </ul>
        </div>
      </section>

      {/* Format Categories */}
      {platforms.map((platform) => {
        const platformFormats = socialMediaFormats.filter((f) => f.category === platform);
        return (
          <section key={platform} className="py-12 border-b border-border">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold text-foreground mb-6">{platform}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformFormats.map((format) => (
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
        );
      })}

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Resize for Social Media?</h2>
          <p className="text-muted-foreground text-lg">
            Use our free image resizer to quickly adjust your images to perfect dimensions for any social platform.
          </p>
          <Link href="/resize-image/instagram-post">
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
