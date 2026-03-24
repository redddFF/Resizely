import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter - Extract Images from PDF | Resizelab',
  description: 'Extract images from PDF pages. Free PDF to JPG converter with adjustable quality. Convert all pages or download individually. No registration needed.',
  alternates: {
    canonical: 'https://resizelab.io/pdf/pdf-to-jpg',
  },
  openGraph: {
    title: 'PDF to JPG Converter - Extract Images from PDF',
    description: 'Convert PDF pages to JPG images with adjustable quality. Fast and secure online converter.',
    url: 'https://resizelab.io/pdf/pdf-to-jpg',
    type: 'website',
    images: [
      {
        url: 'https://resizelab.io/og-pdf-to-jpg.jpg',
        width: 1200,
        height: 630,
        alt: 'PDF to JPG Converter',
      },
    ],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
