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
  title: 'Free Image Resizer | Resize Images for Any Format',
  description: 'Resize images for Instagram, YouTube, LinkedIn, and 50+ other formats. Free, fast, and easy-to-use online image resizer with no watermark.',
  metadataBase: new URL(baseUrl),
  applicationName: 'Resizely',
  generator: 'Resizely',
  openGraph: {
    title: 'Free Image Resizer | Resize for Any Format',
    description: 'Resize images for Instagram, YouTube, LinkedIn, and 50+ formats instantly.',
    url: baseUrl,
    type: 'website',
    siteName: 'Resizely',
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
