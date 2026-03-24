import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { generateWebApplicationSchema, renderJSONLD } from '@/lib/structuredData'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool'

export const metadata: Metadata = {
  title: 'Free Online Image Resizer, PDF Tools & File Converter - Resizely',
  description: 'Free online image resizer, PDF tools, and file converter for social media, ads, eCommerce, and web. Merge PDF, convert JPG to PDF, and resize assets with private browser-based processing.',
  keywords: 'image resizer online, resize image for social media, pdf merger, pdf converter, jpg to pdf, pdf to jpg, google ads image sizes, ecommerce image resizer, free file converter, browser based image tools',
  metadataBase: new URL(baseUrl),
  applicationName: 'Resizely',
  creator: 'Resizely',
  publisher: 'Resizely',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Free Online Image Resizer & PDF Tools - Resizely',
    description: 'Resize images for 150+ formats, merge PDFs, and convert files online. Fast, private, and free with no sign-up required.',
    url: baseUrl,
    siteName: 'Resizely',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resizely - Free Image Resizer & PDF Tools',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Resizer & PDF Tools - Resizely',
    description: 'Image resizing for 150+ formats, PDF tools, and converters in one place. Free, private, and fast.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="webapp-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: renderJSONLD(generateWebApplicationSchema(baseUrl)),
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Script id="analytics-placeholder" strategy="afterInteractive">
          {`window.__RESIZELY_ANALYTICS__ = window.__RESIZELY_ANALYTICS__ || { enabled: false };`}
        </Script>
        <Analytics />
      </body>
    </html>
  )
}
