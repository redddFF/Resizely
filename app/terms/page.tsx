import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://imageresizer.tool';

export const metadata: Metadata = {
  title: 'Terms of Service | QuickToolHub',
  description:
    'Review the QuickToolHub terms of service covering acceptable use, content responsibility, availability, and legal limitations.',
  openGraph: {
    title: 'Terms of Service | QuickToolHub',
    description:
      'Review the QuickToolHub terms of service covering acceptable use, content responsibility, availability, and legal limitations.',
    type: 'website',
    url: `${baseUrl}/terms`,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
      },
    ],
  },
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-full bg-background">
      <article className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 22, 2026</p>
        </header>

        <section className="space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
          <p>
            These Terms of Service govern your access to and use of QuickToolHub. By using the website, you agree to these
            terms. If you do not agree, please discontinue use.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Use of the Service</h2>
          <p>
            QuickToolHub provides online image resizing tools for personal and commercial workflows. You are responsible for how
            you use exported files and for confirming that you have rights to the content you upload. You agree not to use
            the service for unlawful activity, harmful content distribution, or attempts to disrupt site availability.
          </p>
          <p>
            We may update features and formats to improve the service. We may also limit access in cases of abuse or
            automated misuse that threatens stability.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Intellectual Property and Content</h2>
          <p>
            QuickToolHub and its branding, layout, and software components are protected by applicable intellectual property
            laws. You retain ownership of the files you process, while granting no ownership rights to QuickToolHub solely by
            using the tool.
          </p>
          <p>
            You are responsible for ensuring your uploads do not infringe copyrights, trademarks, privacy rights, or other
            legal protections.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Disclaimer and Limitation of Liability</h2>
          <p>
            The service is provided on an as-is and as-available basis without warranties of uninterrupted operation,
            merchantability, or fitness for a particular purpose.
          </p>
          <p>
            To the maximum extent permitted by law, QuickToolHub is not liable for indirect, incidental, consequential, or data-
            related losses arising from use of the service.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-foreground leading-7">
          <h2 className="text-2xl font-semibold">Changes and Contact</h2>
          <p>
            We may revise these terms over time. Revised terms become effective when posted on this page with the updated
            date. Continued use of QuickToolHub after publication indicates acceptance of the revised terms.
          </p>
        </section>
      </article>
    </main>
  );
}
