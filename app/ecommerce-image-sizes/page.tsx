import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formats } from '@/lib/formats';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const metadata: Metadata = {
  title: 'E-commerce Product Image Sizes: Shopify, Amazon, Etsy & More',
  description: 'Complete guide to e-commerce product image dimensions for Shopify, Amazon, Etsy, eBay, WooCommerce. Optimize product photos for maximum conversions.',
  keywords: 'product image size, Shopify image dimensions, Amazon product image specs, Etsy listing image',
  openGraph: {
    title: 'E-commerce Product Image Sizes Guide',
    description: 'Get the right dimensions for product images on every major e-commerce platform.',
    type: 'website',
    url: `${baseUrl}/ecommerce-image-sizes`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
      },
    ],
  },
};

export default function EcommerceImageSizesPage() {
  const ecommerceFormats = formats.filter((f) => f.category === 'E-commerce');

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
            <span className="text-foreground font-medium">E-commerce Image Sizes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              E-commerce Product Image Sizes Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Optimize product images for Shopify, Amazon, Etsy, eBay, WooCommerce, and more. Increase conversions with perfectly sized product photography.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm dark:prose-invert">
          <h2>Why Product Image Size Matters for E-commerce</h2>
          <p>
            Product image quality directly impacts conversion rates. Well-optimized images that load quickly and display clearly across all devices can increase sales by 20-40%. Proper sizing ensures your products look their best, building customer confidence and reducing return rates.
          </p>

          <h2>Shopify Product Image Specifications</h2>
          <p>
            Shopify recommends product images of 2048 x 2048 pixels for maximum clarity. This high-resolution format ensures sharp display on desktop, tablet, and mobile devices. Shopify automatically creates thumbnails and optimizes for different screen sizes, but starting with large images ensures best results.
          </p>

          <h2>Amazon A9 Algorithm and Image Requirements</h2>
          <p>
            Amazon's A9 algorithm heavily considers image quality. Main product images should be 2000 x 2000 pixels minimum, with white background recommended. High-quality, well-lit product photos featuring multiple angles significantly improve search ranking and customer purchase decisions.
          </p>

          <h2>Etsy Shop Optimization</h2>
          <p>
            Etsy shop success depends on eye-catching product thumbnails. Etsy displays product images at multiple sizes, so uploading 2000 x 2000 px images ensures clarity at all zoom levels. Proper lighting and staging in your photos can increase shop traffic from Etsy search and social sharing.
          </p>

          <h2>eBay Product Photography</h2>
          <p>
            eBay sellers should upload product images at 1600 x 1600 pixels minimum. High-resolution main photos increase buyer confidence, particularly for luxury items. Multiple angles and detailed close-ups showing item condition naturally lead to higher selling prices and faster sales.
          </p>

          <h2>Pro Tips for E-commerce Product Images</h2>
          <ul>
            <li><strong>Lighting:</strong> Use professional lighting to show product details and true colors</li>
            <li><strong>Background:</strong> Use consistent, clean backgrounds (white or light gray recommended)</li>
            <li><strong>Multiple Angles:</strong> Provide 360-degree views or multiple product angles</li>
            <li><strong>Zoom Quality:</strong> Users expect to zoom in to see fine details</li>
            <li><strong>Consistency:</strong> Maintain consistent styling and dimensions across all product listings</li>
            <li><strong>File Optimization:</strong> Compress images for fast loading without sacrificing quality</li>
            <li><strong>Mobile Optimization:</strong> Ensure images display well on smartphones and tablets</li>
          </ul>

          <h2>How Image Quality Affects Sales</h2>
          <p>
            Research shows that high-quality product images reduce return rates by up to 22%. Customers feel more confident making purchases when they can see clear, well-lit, detailed photos. Large, high-resolution images also rank better in search engines, driving more organic traffic to your listings.
          </p>

          <h2>Common E-commerce Image Mistakes</h2>
          <ul>
            <li>Using low-resolution images that appear pixelated when zoomed</li>
            <li>Poor lighting that fails to show product details or true colors</li>
            <li>Inconsistent image sizes across product listings</li>
            <li>Not providing multiple product angles or views</li>
            <li>Using overly filtered or heavily edited images</li>
            <li>Failing to optimize file sizes, causing slow page loads</li>
          </ul>
        </div>
      </section>

      {/* Formats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-6">All E-commerce Image Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ecommerceFormats.map((format) => (
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
          <h2 className="text-3xl font-bold text-foreground">Optimize Your E-commerce Images Today</h2>
          <p className="text-muted-foreground text-lg">
            Use our free resizer to prepare product images with exact dimensions for your store.
          </p>
          <Link href="/resize-image/shopify-product-image">
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
