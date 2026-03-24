import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight, Image, FileText, Zap } from 'lucide-react';
import { formats, type ImageFormat } from '@/lib/formats';

interface PopularTool {
  title: string;
  description: string;
  slug: string;
  icon: React.ComponentType<{ className: string }>;
}

const popularTools: PopularTool[] = [
  {
    title: 'Instagram Post Resizer',
    description: 'Resize images to 1:1 square format (1080×1080px) for Instagram feed posts',
    slug: 'instagram-post',
    icon: Image,
  },
  {
    title: 'YouTube Thumbnail Resizer',
    description: 'Create perfect 16:9 thumbnails (1280×720px) for maximum video visibility',
    slug: 'youtube-thumbnail',
    icon: Image,
  },
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document instantly',
    slug: 'merge-pdf',
    icon: FileText,
  },
  {
    title: 'JPG to PDF',
    description: 'Convert JPG, PNG, and other images to PDF format online',
    slug: 'jpg-to-pdf',
    icon: FileText,
  },
  {
    title: 'PDF to JPG',
    description: 'Extract PDF pages as high-quality JPG images instantly',
    slug: 'pdf-to-jpg',
    icon: FileText,
  },
  {
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format with quality optimization',
    slug: 'png-to-jpg',
    icon: Image,
  },
  {
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    slug: 'compress-pdf',
    icon: Zap,
  },
  {
    title: 'LinkedIn Post Resizer',
    description: 'Resize to LinkedIn optimal size (1200×627px) for professional posts',
    slug: 'linkedin-post',
    icon: Image,
  },
];

function getSlugForRoute(toolSlug: string): string {
  const pdfTools = ['merge-pdf', 'jpg-to-pdf', 'pdf-to-jpg', 'compress-pdf'];
  if (pdfTools.includes(toolSlug)) {
    const pdfRoute = toolSlug.replace('-pdf', '').replace('compress', 'compress-pdf');
    return pdfRoute;
  }
  return toolSlug;
}

export function PopularToolsSection() {
  return (
    <section className="py-16 md:py-24 border-b border-border bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Popular Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started instantly with our most popular image resizers and PDF tools. All powered by your browser with zero uploads required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            let href = `/resize-image/${tool.slug}`;
            
            if (tool.slug === 'merge-pdf') href = '/pdf/merge';
            else if (tool.slug === 'jpg-to-pdf') href = '/pdf/jpg-to-pdf';
            else if (tool.slug === 'pdf-to-jpg') href = '/pdf/pdf-to-jpg';
            else if (tool.slug === 'compress-pdf') href = '/pdf/compress-pdf';
            else if (tool.slug === 'png-to-jpg') href = '/resize-image/png-to-jpg';

            return (
              <Link key={tool.slug} href={href} className="group">
                <Card className="p-5 h-full hover:shadow-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
