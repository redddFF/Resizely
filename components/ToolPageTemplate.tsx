'use client';

/**
 * Reusable Tool Page Template
 * 
 * This component is used to render all ~163+ tool pages (both image formats and PDF tools).
 * It accepts a generic tool object and renders:
 * - Hero section with name and description
 * - Features grid
 * - Detailed content section
 * - CTA buttons
 * - FAQ accordion
 * - Related tools carousel
 * 
 * Advantages:
 * - Single source of truth for tool page design
 * - Easy to maintain and update UI across all pages
 * - Supports both ImageFormat and PDFTool interfaces
 * - Fully responsive and accessible
 */

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface ToolPageTemplateProps {
  // Tool data
  tool: {
    name: string;
    slug: string;
    description: string;
    seoContent: string;
    category?: string;
    features?: string[];
    faqs?: Array<{ question: string; answer: string }>;
    maxFileSize?: number;
    supportedFormats?: string[];
  };
  
  // Route configuration
  routeType: 'image' | 'pdf';

  // Optional override for primary CTA destination
  actionHref?: string | null;

  // Optional override for primary CTA label
  actionLabel?: string;
  
  // Related tools to display
  relatedTools?: Array<{
    name: string;
    slug: string;
    category?: string;
  }>;
  
  // Custom sections
  children?: ReactNode;
  
  // Optional callback for CTA clicks
  onCTAClick?: () => void;
}

export default function ToolPageTemplate({
  tool,
  routeType,
  actionHref,
  actionLabel,
  relatedTools = [],
  children,
  onCTAClick,
}: ToolPageTemplateProps) {
  const route = routeType === 'image' ? '/resize' : '/pdf';
  const toolUrl = actionHref ?? `${route}/${tool.slug}`;
  const ctaLabel = actionLabel ?? 'Open Tool';
  const isActionable = Boolean(toolUrl);
  
  // Format file size for display
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Large files';
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}GB`;
    return `${bytes}MB`;
  };
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 py-12 md:py-20">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <span>/</span>
            <Link href={route} className="hover:text-slate-900">
              {routeType === 'image' ? 'Image Tools' : 'PDF Tools'}
            </Link>
            {tool.category && (
              <>
                <span>/</span>
                <span className="text-slate-900 font-medium">{tool.category}</span>
              </>
            )}
            <span>/</span>
            <span className="text-slate-900 font-medium">{tool.name}</span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {tool.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              {tool.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isActionable ? (
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onCTAClick}
                  asChild
                >
                  <a href={toolUrl}>
                    {ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-slate-400 text-white cursor-not-allowed"
                  disabled
                >
                  Tool Coming Soon
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      {(tool.maxFileSize || tool.supportedFormats) && (
        <section className="py-12 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.maxFileSize && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Max File Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatFileSize(tool.maxFileSize)}
                    </p>
                  </CardContent>
                </Card>
              )}

              {tool.supportedFormats && tool.supportedFormats.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Supported Formats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">
                      {tool.supportedFormats.join(', ')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {tool.features && tool.features.length > 0 && (
        <section className="py-12 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Features</h2>
              <p className="text-lg text-slate-600">
                Everything you need for {tool.name.toLowerCase()}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tool.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      {tool.seoContent && (
        <section className="py-12 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="prose prose-slate max-w-none">
              {/* Parse and render SEO content with markdown-like structure */}
              <ContentRenderer content={tool.seoContent} />
            </div>
          </div>
        </section>
      )}

      {/* Custom Children Section */}
      {children && (
        <section className="py-12 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="py-12 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-600">
                Get answers to common questions about {tool.name}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {tool.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <span className="font-semibold text-slate-900">{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pl-8 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <section className="py-12 border-b border-slate-200 bg-slate-50">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Related Tools</h2>
              <p className="text-lg text-slate-600">
                Check out other helpful tools in this category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`${route}/${relatedTool.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {relatedTool.name}
                      </CardTitle>
                      {relatedTool.category && (
                        <CardDescription>{relatedTool.category}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-blue-600 group-hover:gap-2 transition-all gap-0">
                        <span>Explore</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to {tool.name.toLowerCase()}?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Start using {tool.name} for free. No signup required.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={onCTAClick}
            asChild={isActionable}
            disabled={!isActionable}
          >
            {isActionable ? (
              <a href={toolUrl}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            ) : (
              <span>Tool Coming Soon</span>
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}

/**
 * Helper component to render SEO content
 * Converts simple markdown-like structure to React components
 */
function ContentRenderer({ content }: { content: string }) {
  // Split content into paragraphs and handle basic formatting
  const lines = content.split('\n').filter((line) => line.trim());
  const elements: ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Headings (## Heading format)
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`heading-${i}`} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          {line.substring(3)}
        </h2>
      );
    }
    // Subheadings (### Subheading format)
    else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`subheading-${i}`} className="text-xl font-semibold text-slate-900 mt-6 mb-3">
          {line.substring(4)}
        </h3>
      );
    }
    // Bold text (**text**)
    else if (line.includes('**')) {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <p
          key={`para-${i}`}
          className="text-slate-700 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
    // Regular paragraphs
    else {
      elements.push(
        <p key={`para-${i}`} className="text-slate-700 mb-4 leading-relaxed">
          {line}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-4">{elements}</div>;
}
