import Link from 'next/link';
import { getPopularFormats } from '@/lib/formats';

const popularTools = getPopularFormats(6);

const pdfAndConverterLinks = [
  { label: 'Merge PDF Files', href: '/pdf/merge' },
  { label: 'JPG to PDF Converter', href: '/pdf/jpg-to-pdf' },
  { label: 'PDF to JPG Converter', href: '/pdf/pdf-to-jpg' },
  { label: 'Compress PDF', href: '/pdf/compress-pdf' },
  { label: 'PNG to JPG', href: '/resize-image/png-to-jpg' },
  { label: 'JPG to PNG', href: '/resize-image/jpg-to-png' },
];

const guideLinks = [
  { label: 'Social Media Image Sizes', href: '/social-media-image-sizes' },
  { label: 'Ad Image Sizes', href: '/ad-image-sizes' },
  { label: 'eCommerce Image Sizes', href: '/ecommerce-image-sizes' },
  { label: 'Blog Image Sizes', href: '/blog-image-sizes' },
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                R
              </span>
              <span>Resizely</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Free browser-based toolkit to resize images, merge PDF files, and convert formats for social media, ads, websites, and eCommerce.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>No sign-up. No watermark. Privacy-first local processing.</p>
              <Link
                href="/resize-image/instagram-post"
                className="inline-flex items-center rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors"
              >
                Open Free Image Resizer
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Popular Image Tools</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/resize-image/${tool.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">PDF and Converter Tools</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {pdfAndConverterLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Guides and Legal</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground space-y-2">
          <p>Copyright {currentYear} Resizely. All rights reserved.</p>
          <p>
            Popular searches: image resizer online, Instagram post size, YouTube thumbnail size, merge PDF online, JPG to PDF, PDF to JPG, ad image sizes.
          </p>
        </div>
      </div>
    </footer>
  );
}
