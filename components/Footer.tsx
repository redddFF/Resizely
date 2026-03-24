import Link from 'next/link';
import { getPopularTools } from '@/lib/toolRegistry';

const guideLinks = [
  { label: 'Social Media Image Sizes Guide', href: '/social-media-image-sizes' },
  { label: 'Ad Image Sizes Guide', href: '/ad-image-sizes' },
  { label: 'eCommerce Image Sizes Guide', href: '/ecommerce-image-sizes' },
  { label: 'Blog Image Sizes Guide', href: '/blog-image-sizes' },
  { label: 'About QuickToolHub', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const topTools = getPopularTools(10);
  const imageTopTools = topTools.filter((tool) => tool.type === 'image').slice(0, 5);
  const pdfTopTools = topTools.filter((tool) => tool.type === 'pdf').slice(0, 5);

  return (
    <footer className="border-t border-border bg-card/30" aria-labelledby="footer-navigation-heading">
      <div className="container mx-auto px-4 py-12">
        <h2 id="footer-navigation-heading" className="sr-only">
          Footer Navigation
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                Q
              </span>
              <span>QuickToolHub</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Free browser-based toolkit to resize images, merge PDF files, and convert formats for social media, ads, websites, and eCommerce.
            </p>
            <p className="text-xs text-muted-foreground">No sign-up. No watermark. Privacy-first local processing.</p>
          </div>

          <nav className="space-y-3" aria-label="Popular image tools">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Popular Image Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {imageTopTools.map((tool) => (
                <li key={tool.id}>
                  <Link href={tool.href} className="hover:text-foreground transition-colors">
                    {tool.name} Tool
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-3" aria-label="Popular PDF tools">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Popular PDF and Converter Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {pdfTopTools.map((tool) => (
                <li key={tool.id}>
                  <Link href={tool.href} className="hover:text-foreground transition-colors">
                    {tool.name} Tool
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-3" aria-label="Guides and legal links">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Guides and Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground space-y-2">
          <p>Copyright {currentYear} QuickToolHub. All rights reserved.</p>
          <p>
            Popular searches: image resizer online, Instagram post size, YouTube thumbnail size, merge PDF online, JPG to PDF, PDF to JPG, ad image sizes.
          </p>
        </div>
      </div>
    </footer>
  );
}
