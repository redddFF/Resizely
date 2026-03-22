import Link from 'next/link';
import { getPopularFormats } from '@/lib/formats';

const popularTools = getPopularFormats(6);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                R
              </span>
              <span>Resizelab</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Resize images for social media, websites, marketing, and print with fast client-side processing and no watermark.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Legal</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Popular Tools</h2>
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
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>Copyright {currentYear} Resizelab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
