import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Image as ImageIcon, Scissors, Combine } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const metadata: Metadata = {
  title: 'PDF Tools Hub | QuickToolHub',
  description:
    'Use free online PDF tools to merge, split, convert PDF to image, and convert PDF to Word. Fast, secure, and no signup required.',
  openGraph: {
    title: 'PDF Tools Hub | QuickToolHub',
    description:
      'Merge, split, and convert PDF files online with QuickToolHub PDF tools.',
    type: 'website',
    url: `${baseUrl}/tools/pdf`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
      },
    ],
  },
};

const pdfTools = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document in seconds.',
    href: '/tools/pdf/merge',
    icon: Combine,
  },
  {
    title: 'Split PDF',
    description: 'Extract specific pages or ranges into a new PDF file.',
    href: '/tools/pdf/split',
    icon: Scissors,
  },
  {
    title: 'PDF to Image',
    description: 'Convert PDF pages into high-quality images for sharing.',
    href: '/tools/pdf/pdf-to-image',
    icon: ImageIcon,
  },
  {
    title: 'PDF to Word',
    description: 'Turn PDF documents into editable DOCX files quickly.',
    href: '/tools/pdf/pdf-to-word',
    icon: FileText,
  },
];

export default function PDFToolsHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 py-12 md:py-20">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              PDF Tools Hub
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Choose a PDF converter or utility and process your documents instantly.
              All tools are free to use and designed for fast, reliable results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pdfTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.href} className="h-full border-slate-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href={tool.href}>
                        Open Tool
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
