import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Sparkles, Shield } from 'lucide-react';
import { formats, getPopularFormats } from '@/lib/formats';
import { RecentlyUsedSection } from '@/components/RecentlyUsedSection';
import { SmartResolutionSearch } from '@/components/SmartResolutionSearch';

const popularFormats = getPopularFormats(8);

// Group formats by category
const groupedFormats = formats.reduce(
  (acc, format) => {
    if (!acc[format.category]) {
      acc[format.category] = [];
    }
    acc[format.category].push(format);
    return acc;
  },
  {} as Record<string, typeof formats>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Resizelab: Free Image Resizer for Every Platform
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Resize images instantly for Instagram, YouTube, LinkedIn, Facebook, TikTok, Pinterest, and 150+ other formats. No watermarks, no sign-up required.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/resize-image/${formats[0].slug}`}>
                <Button size="lg">
                  Start Resizing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <SmartResolutionSearch />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">
            Why Choose Our Image Resizer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
              <Zap className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Resize images instantly in your browser. No uploads to servers, no waiting.
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
              <Sparkles className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">50+ Formats</h3>
              <p className="text-muted-foreground">
                Support for all major social media platforms and content formats.
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">100% Private</h3>
              <p className="text-muted-foreground">
                Your images never leave your device. Complete privacy guaranteed.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Recently Used Section */}
      <RecentlyUsedSection />

      {/* Popular Tools Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">
            Popular Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularFormats.map((format) => (
              <Link
                key={format.slug}
                href={`/resize-image/${format.slug}`}
                className="group"
              >
                <Card className="p-5 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {format.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format.width} × {format.height} px • {format.aspectRatio}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {format.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                      Resize
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section id="popular-tools" className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">
            Browse All Formats
          </h2>
          {Object.entries(groupedFormats).map(([category, categoryFormats]) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFormats.map((format) => (
                  <Link
                    key={format.slug}
                    href={`/resize-image/${format.slug}`}
                    className="group"
                  >
                    <Card className="p-5 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {format.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format.width} × {format.height} px • {format.aspectRatio}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {format.description}
                        </p>
                        <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                          Resize
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Image',
                description: 'Drag and drop or click to select your image',
              },
              {
                step: '2',
                title: 'Choose Format',
                description: 'Select your target platform or enter custom dimensions',
              },
              {
                step: '3',
                title: 'Adjust Settings',
                description: 'Fine-tune quality and other image settings',
              },
              {
                step: '4',
                title: 'Download',
                description: 'Get your perfectly resized image instantly',
              },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to resize your images?
          </h2>
          <p className="text-lg text-muted-foreground">
            Start resizing images for free. No account needed, no watermarks, completely private.
          </p>
          <Link href={`/resize-image/${formats[0].slug}`}>
            <Button size="lg">
              Start Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
