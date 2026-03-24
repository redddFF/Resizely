import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Convert Images to PDF | Resizelab',
  description: 'Convert JPG, PNG, GIF, and WebP images to PDF. Free image to PDF converter with drag-and-drop support. No registration needed.',
  alternates: {
    canonical: 'https://resizelab.io/pdf/jpg-to-pdf',
  },
  openGraph: {
    title: 'JPG to PDF Converter - Convert Images to PDF',
    description: 'Convert JPG, PNG, GIF, and WebP images to PDF. Free and fast online converter.',
    url: 'https://resizelab.io/pdf/jpg-to-pdf',
    type: 'website',
    images: [
      {
        url: 'https://resizelab.io/og-jpg-to-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'JPG to PDF Converter',
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
