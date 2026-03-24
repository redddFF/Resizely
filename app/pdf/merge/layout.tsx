import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF Files - Free Online PDF Merger | Resizelab',
  description: 'Combine multiple PDF files into one. Fast, secure, and free. Merge up to 20 PDFs with drag-and-drop reordering. No registration needed.',
  alternates: {
    canonical: 'https://resizelab.io/pdf/merge',
  },
  openGraph: {
    title: 'Merge PDF Files - Free Online PDF Merger',
    description: 'Combine multiple PDF files into one. Fast, secure, and free.',
    url: 'https://resizelab.io/pdf/merge',
    type: 'website',
    images: [
      {
        url: 'https://resizelab.io/og-pdf-merge.jpg',
        width: 1200,
        height: 630,
        alt: 'Merge PDF Files',
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
