import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const metadata: Metadata = {
  title: 'About QuickToolHub | Free Online Image Resizer',
  description:
    'Learn about QuickToolHub, the privacy-first online image resizing tool built for creators, marketers, and teams who need fast format-ready images.',
  openGraph: {
    title: 'About QuickToolHub | Free Online Image Resizer',
    description:
      'Learn about QuickToolHub, the privacy-first online image resizing tool built for creators, marketers, and teams who need fast format-ready images.',
    type: 'website',
    url: `${baseUrl}/about`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
      },
    ],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-full bg-background">
      <article className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">About QuickToolHub</h1>
          <p className="text-muted-foreground">
            QuickToolHub is a free online image resizer designed to help creators publish faster without sacrificing quality.
          </p>
        </header>

        <section className="space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>
            Our mission is to make professional image resizing simple for everyone. Social media platforms, marketplaces,
            blogs, and ad networks all use different dimensions, and those requirements change often. QuickToolHub removes that
            friction by providing ready-made presets for the formats people use most, including Instagram posts, stories,
            YouTube thumbnails, LinkedIn visuals, and website graphics.
          </p>
          <p>
            The product is intentionally lightweight: upload an image, choose a target format, adjust settings, and download.
            There is no complicated editor to learn. This focused workflow helps freelancers, agencies, students, and small
            teams prepare publication-ready assets in seconds.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Privacy-First by Design</h2>
          <p>
            QuickToolHub processes images directly in your browser using modern Canvas APIs. In typical use, your files stay on
            your device during resizing, which improves privacy and reduces waiting time. We do not require an account for
            core functionality and avoid unnecessary data collection.
          </p>
          <p>
            We also keep format definitions centralized in one source of truth. That allows us to add new presets reliably
            while keeping metadata, internal links, and sitemap entries consistent across the site.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Who We Serve</h2>
          <p>
            QuickToolHub helps content creators publishing daily posts, marketers building campaign assets, developers managing
            website media, and ecommerce teams standardizing product images. If you need clean dimensions without heavy
            software, this tool is built for your workflow.
          </p>
          <p>
            We continue improving speed, accessibility, and discoverability so each format page is easy to find and easy to
            use. As platforms evolve, we keep QuickToolHub updated so your publishing pipeline stays efficient.
          </p>
        </section>
      </article>
    </main>
  );
}
