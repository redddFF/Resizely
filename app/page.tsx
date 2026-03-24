import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { formats, getPopularFormats } from '@/lib/formats';
import { pdfTools } from '@/data/pdfTools';
import { RecentlyUsedSection } from '@/components/RecentlyUsedSection';
import { SmartResolutionSearch } from '@/components/SmartResolutionSearch';
import { PopularToolsSection } from '@/components/PopularToolsSection';
import { ToolsByCategorySection } from '@/components/ToolsByCategorySection';
import { SEOContentBlock } from '@/components/SEOContentBlock';
import { FAQSection } from '@/components/FAQSection';
import { AdPlaceholder } from '@/components/AdPlaceholder';

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

const totalFormats = formats.length;
const categoryCount = Object.keys(groupedFormats).length;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

const getImageTool = (slug: string, label?: string) => {
  const format = formats.find((item) => item.slug === slug);
  if (!format) return null;

  return {
    name: label || format.name,
    slug: format.slug,
    href: `/resize-image/${format.slug}`,
  };
};

const getPdfTool = (slug: string, label?: string) => {
  const tool = pdfTools.find((item) => item.slug === slug);
  if (!tool) return null;

  const href = slug === 'merge-pdf' ? '/pdf/merge' : `/pdf/${tool.slug}`;

  return {
    name: label || tool.name,
    slug: tool.slug,
    href,
  };
};

const imageToolsCategory = [
  getImageTool('instagram-post', 'Instagram Post Resizer'),
  getImageTool('youtube-thumbnail'),
  getImageTool('linkedin-post'),
  getImageTool('facebook-cover', 'Facebook Cover Photo'),
  getImageTool('pinterest-pin'),
  getImageTool('twitter-header', 'Twitter/X Header'),
].filter((tool): tool is { name: string; slug: string; href: string } => Boolean(tool));

const pdfToolsCategory = [
  getPdfTool('merge-pdf', 'Merge PDF'),
  getPdfTool('jpg-to-pdf', 'JPG to PDF'),
  getPdfTool('pdf-to-jpg', 'PDF to JPG'),
  getPdfTool('compress-pdf', 'Compress PDF'),
  getPdfTool('split-pdf', 'PDF Splitter'),
  getPdfTool('add-watermark', 'PDF Watermark'),
].filter((tool): tool is { name: string; slug: string; href: string } => Boolean(tool));

const converterToolsCategory = [
  getPdfTool('pdf-to-text', 'Extract Text from PDF'),
  getPdfTool('jpg-to-pdf', 'JPG to PDF'),
  getPdfTool('pdf-to-excel', 'PDF to Excel'),
  getPdfTool('pdf-to-jpg', 'PDF to JPG'),
  getPdfTool('pdf-to-word', 'PDF to Word'),
].filter((tool): tool is { name: string; slug: string; href: string } => Boolean(tool));

const homepageStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${baseUrl}/#webpage`,
      url: `${baseUrl}/`,
      name: 'Free Online Image Resizer, PDF Tools and File Converter',
      description:
        'Resize images for social media, merge PDF files, and convert formats online for free with private browser-based processing.',
      inLanguage: 'en-US',
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      primaryImageOfPage: `${baseUrl}/og-image.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: `${baseUrl}/`,
      name: 'QuickToolHub',
      description:
        'Free browser-based image resizer, PDF tools, and file converter for creators, marketers, and businesses.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/resize-image/{search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ItemList',
      name: 'Popular Image Resize Tools',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: popularFormats.length,
      itemListElement: popularFormats.map((format, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: format.name,
        url: `${baseUrl}/resize-image/${format.slug}`,
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: 'Free Online Image Resizer, PDF Tools and File Converter | QuickToolHub',
  description:
    'Resize images online for Instagram, YouTube, LinkedIn, eCommerce, and ads. Merge PDFs, convert files, and compress assets fast with private browser-based processing.',
  keywords: [
    'image resizer online',
    'free image resizer',
    'pdf merge online',
    'jpg to pdf converter',
    'pdf to jpg',
    'social media image size tool',
    'google ads image size resizer',
    'file converter online',
    'no signup image tools',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Free Online Image Resizer, PDF Tools and File Converter | QuickToolHub',
    description:
      'Resize images for 150+ formats, merge PDFs, and convert files online in seconds. Free, private, and no sign-up required.',
    type: 'website',
    url: `${baseUrl}/`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'QuickToolHub image resizer and PDF tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Resizer, PDF Tools and File Converter | QuickToolHub',
    description:
      'One toolkit for image resizing, PDF merge, and file conversion. Fast browser processing with full privacy.',
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageStructuredData),
        }}
      />

      {/* Hero Section - Enhanced SEO */}
      <section className="py-16 md:py-28 border-b border-border bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
                Free Online Image Resizer, PDF Tools and File Converter
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed">
                Resize images for social media, ads, eCommerce, and websites in seconds. Merge PDF files, convert JPG to PDF, extract PDF to JPG, and optimize assets with no sign-up.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-foreground font-medium">{totalFormats}+ formats</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-foreground font-medium">{categoryCount} use-case categories</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-foreground font-medium">Browser-based privacy</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-foreground font-medium">No account required</span>
            </div>

            {/* 3 CTA Buttons */}
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              <Link href={`/resize-image/${formats[0].slug}`}>
                <Button size="lg" className="text-base">
                  Resize Image
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pdf/merge">
                <Button size="lg" variant="outline" className="text-base">
                  Merge PDF
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pdf/jpg-to-pdf">
                <Button size="lg" variant="outline" className="text-base">
                  Convert Files
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Smart Search */}
            <div className="pt-4">
              <SmartResolutionSearch />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Popular workflows: resize image for Instagram, YouTube thumbnail maker dimensions, LinkedIn post sizing, Google display ad sizes, and PDF merge online.
            </p>
          </div>
        </div>
      </section>

      {/* Ad Placeholder - Top Banner */}
      <section className="py-4 border-b border-border bg-muted/30" aria-label="Top ad slot">
        <div className="container mx-auto px-4">
          <AdPlaceholder position="top" className="h-24 md:h-20" />
        </div>
      </section>

      {/* High Intent Quick Links */}
      <section className="py-12 border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
                Most Searched Image Sizes and Converter Tools
              </h2>
              <p className="text-muted-foreground">
                Jump directly to the tools users search for most: social media dimensions, ad formats, and fast PDF conversion utilities.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularFormats.map((format) => (
                <Link
                  key={format.slug}
                  href={`/resize-image/${format.slug}`}
                  className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  {format.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Why Choose QuickToolHub?
            </h2>
            <p className="text-lg text-muted-foreground">
              Fast, private, and powerfully simple tools for image resizing and file conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4 hover:shadow-lg hover:border-primary/50 transition-all border-l-4 border-l-primary">
              <Zap className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Resize images instantly in your browser with zero server uploads. Get results in milliseconds.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg hover:border-primary/50 transition-all border-l-4 border-l-primary">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">100% Private</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Files are processed on your device. We never store, access, or view your personal content.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg hover:border-primary/50 transition-all border-l-4 border-l-primary">
              <Sparkles className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">150+ Formats</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Optimized dimensions for social media, email, web, print, gaming, and messaging apps.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg hover:border-primary/50 transition-all border-l-4 border-l-primary">
              <CheckCircle className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Always Free</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No sign-up, no watermarks, no hidden fees. Use all features completely free, forever.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Recently Used Section */}
      <RecentlyUsedSection />

      {/* Popular Tools Section */}
      <PopularToolsSection />

      {/* Ad Placeholder - Middle */}
      <section className="py-4 border-b border-border bg-muted/30" aria-label="In-content ad slot">
        <div className="container mx-auto px-4">
          <AdPlaceholder position="middle" className="h-56 md:h-80" />
        </div>
      </section>

      {/* Tools by Category Section */}
      <ToolsByCategorySection
        categories={[
          {
            title: '📷 Image Tools',
            description: 'Resize images for social media, web, email, and print. Support for Instagram, YouTube, LinkedIn, Pinterest, TikTok, and 100+ formats with instant browser processing.',
            bgColor: 'bg-blue/5',
            tools: imageToolsCategory,
          },
          {
            title: '📄 PDF Tools',
            description: 'Merge PDFs, convert images to PDF, extract pages as images, and compress documents. All processing happens in your browser with zero uploads.',
            bgColor: 'bg-red/5',
            tools: pdfToolsCategory,
          },
          {
            title: '🔄 File Converters',
            description: `Convert between image and document formats with advanced quality controls. Browse ${converterToolsCategory.length} converter tools already available on QuickToolHub.`,
            bgColor: 'bg-green/5',
            tools: converterToolsCategory,
          },
        ]}
      />

      {/* SEO Content Block */}
      <SEOContentBlock />

      {/* FAQ Section */}
      <FAQSection />

      {/* AdSense Optimization Note */}
      <section className="py-10 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-xl border border-border bg-background p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
              Optimized for Content Discovery and Ad Placement
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This homepage is structured for high-intent search traffic with clear content sections, internal links to tool pages, and responsive ad-ready zones placed above the fold, in-content, and near the page end.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">Top banner visibility zone</div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">In-content display inventory</div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">Bottom recirculation zone</div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-16 md:py-24 border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Advanced PDF Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional PDF processing tools for combining documents, converting formats, and optimizing file sizes. All free and running in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/pdf/merge" className="group">
              <Card className="p-6 h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      Merge PDF
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Combine multiple PDF files into one. Reorder pages before merging.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                    Try Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/pdf/jpg-to-pdf" className="group">
              <Card className="p-6 h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      JPG to PDF
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Convert images to PDF files. Supports JPG, PNG, GIF, and WebP.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                    Try Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/pdf/pdf-to-jpg" className="group">
              <Card className="p-6 h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      PDF to JPG
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Extract pages from PDFs as image files. Adjustable quality settings.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                    Try Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Placeholder - Bottom */}
      <section className="py-4 border-b border-border bg-muted/30" aria-label="Bottom ad slot">
        <div className="container mx-auto px-4">
          <AdPlaceholder position="bottom" className="h-24 md:h-20" />
        </div>
      </section>
    </main>
  );
}
