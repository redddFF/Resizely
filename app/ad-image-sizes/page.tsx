import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formats } from '@/lib/formats';

export const metadata: Metadata = {
  title: 'Ad Image Sizes: Google, Facebook, Instagram & More - Complete Guide',
  description: 'Complete guide to advertising image dimensions. Get the right sizes for Google Display Ads, Facebook ads, Instagram ads, LinkedIn ads, and more.',
  keywords: 'ad image sizes, Google Display ad sizes, Facebook ad dimensions, Instagram ad size',
  openGraph: {
    title: 'Ad Image Sizes: Google, Facebook, Instagram & More',
    description: 'Complete guide to advertising image dimensions for all major platforms.',
    type: 'website',
  },
};

export default function AdImageSizesPage() {
  const adCategories = ['Ads - Google', 'Ads - Meta', 'Ads - LinkedIn', 'Ads - X', 'Ads - Pinterest', 'Ads - Snapchat'];
  const adFormats = formats.filter((f) => adCategories.includes(f.category));
  const groupedByCategory = adCategories.map((cat) => ({
    name: cat,
    formats: adFormats.filter((f) => f.category === cat),
  }));

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
            <span className="text-foreground font-medium">Ad Image Sizes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Complete Ad Image Sizes & Specifications Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Maximize ad performance with the perfect image dimensions for Google Ads, Facebook, Instagram, LinkedIn, and more. High-converting ad sizes for every platform.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm dark:prose-invert">
          <h2>Why Ad Image Specifications Matter</h2>
          <p>
            Ad performance directly correlates with proper image sizing. Ads that meet platform specifications achieve higher click-through rates, lower cost-per-click, and better conversion rates. Platforms like Google and Facebook reward compliance with their technical guidelines through improved ad rotation and placement.
          </p>

          <h2>Google Display Network Ad Sizes</h2>
          <p>
            Google Display Network supports multiple ad formats. The most effective sizes are:
          </p>
          <ul>
            <li><strong>Medium Rectangle:</strong> 300 x 250 px - highest performing standard ad unit</li>
            <li><strong>Leaderboard:</strong> 728 x 90 px - header/footer placement</li>
            <li><strong>Skyscraper:</strong> 160 x 600 px - sidebar placements</li>
            <li><strong>Half-page:</strong> 300 x 600 px - high-impact premium placement</li>
            <li><strong>Billboard:</strong> 970 x 250 px - premium above-the-fold position</li>
          </ul>
          <p>
            Using these standard sizes ensures maximum inventory availability across the Google Display Network, reaching millions of websites and apps.
          </p>

          <h2>Facebook & Instagram Ad Dimensions</h2>
          <p>
            Meta platforms support multiple ad placements with specific dimension recommendations. Feed ads should be square (1080 x 1080 px), while Story ads are vertical (1080 x 1920 px). Carousel ads follow the same square format for each card, allowing for compelling multi-image storytelling.
          </p>

          <h2>LinkedIn Advertising Specifications</h2>
          <p>
            LinkedIn ads targeting professionals and B2B audiences use 1200 x 627 px dimensions. This 1.91:1 ratio ensures optimal display across desktop and mobile, maximizing visibility in professional feeds.
          </p>

          <h2>Performance Tips for Ad Creatives</h2>
          <ul>
            <li>Use bold, contrasting colors to stand out in crowded feeds</li>
            <li>Include clear calls-to-action (CTA) buttons in your design</li>
            <li>Test multiple image variations to identify top performers</li>
            <li>Ensure text takes up no more than 20% of the image</li>
            <li>Resize images precisely to avoid platform compression artifacts</li>
            <li>Use high-resolution source images (minimum 72 DPI)</li>
          </ul>

          <h2>Common Ad Mistakes to Avoid</h2>
          <ul>
            <li>Using incorrect dimensions leading to auto-cropping</li>
            <li>Uploading low-resolution images that appear pixelated</li>
            <li>Exceeding Facebook's 20% text rule, which reduces ad delivery</li>
            <li>Using inappropriate file formats or sizes</li>
            <li>Ignoring platform-specific design guidelines</li>
          </ul>
        </div>
      </section>

      {/* Ad Platforms */}
      {groupedByCategory.map((group) => (
        group.formats.length > 0 && (
          <section key={group.name} className="py-12 border-b border-border">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold text-foreground mb-6">{group.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.formats.map((format) => (
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
        )
      ))}

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Resize Your Ad Images Now</h2>
          <p className="text-muted-foreground text-lg">
            Use our free image resizer to prepare ad creatives with exact dimensions for any platform.
          </p>
          <Link href="/resize-image/google-display-300x250">
            <Button size="lg">
              Start Resizing Ads
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
