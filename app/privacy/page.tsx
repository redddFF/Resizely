import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const metadata: Metadata = {
  title: 'Privacy Policy | QuickToolHub',
  description:
    'Read the QuickToolHub privacy policy to understand what data we collect, how local browser processing works, and your rights over information.',
  openGraph: {
    title: 'Privacy Policy | QuickToolHub',
    description:
      'Read the QuickToolHub privacy policy to understand what data we collect, how local browser processing works, and your rights over information.',
    type: 'website',
    url: `${baseUrl}/privacy`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
      },
    ],
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-full bg-background">
      <article className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 22, 2026</p>
        </header>

        <section className="space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p>
            This Privacy Policy explains how QuickToolHub handles information when you use our website and image resizing tool.
            We collect only the data needed to operate, secure, and improve the service.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Image Processing and Files</h2>
          <p>
            QuickToolHub processes uploaded images in your browser using client-side technology. In normal use, files are not
            sent to our servers for resizing. Your selected image, preview, and export actions stay on your device unless
            you independently choose to share or upload the file elsewhere.
          </p>
          <p>
            Because processing is local, we do not maintain a media library of your images. Temporary browser memory may be
            used while the tool is open and is cleared by normal browser behavior.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Data We May Collect</h2>
          <p>
            We may collect limited technical data such as browser type, anonymized usage events, and aggregated interaction
            metrics. This helps us improve performance. We may also store non-sensitive local preferences, such as recently
            used formats.
          </p>
          <p>
            If advertising services are enabled, third-party providers may use cookies or similar technologies to deliver and
            measure ads under their own privacy policies.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">How We Use Information</h2>
          <p>
            Information is used to maintain reliability, detect abuse, evaluate feature quality, and improve format coverage.
            We do not sell personal images uploaded for resizing.
          </p>
          <p>
            You can manage cookies through browser settings and clear local storage at any time.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Contact and Updates</h2>
          <p>
            We may update this policy when legal requirements, technology, or product behavior changes. Updates are posted on
            this page with a revised date. Continued use of the service after an update indicates acceptance of the revised
            policy.
          </p>
        </section>
      </article>
    </main>
  );
}
