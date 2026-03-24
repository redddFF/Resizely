'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Is QuickToolHub completely free to use?',
    answer: 'Yes! QuickToolHub is 100% free with no hidden fees, no watermarks, and no sign-up required. You can use all our tools—image resizer, PDF merger, file converters—as much as you want, absolutely free.',
  },
  {
    question: 'Are my files secure? Do you store my images?',
    answer: 'Your files are completely secure. All image resizing, PDF processing, and file conversion happens directly in your browser on your device. We never upload, store, access, or view your files. Complete privacy guaranteed.',
  },
  {
    question: 'Do I need to create an account or sign up?',
    answer: 'No! You can start using QuickToolHub immediately without any registration, email verification, or account creation. Just visit the tool and get started right away.',
  },
  {
    question: 'What image formats do you support?',
    answer: 'We support all major image formats including JPG, PNG, GIF, WebP, BMP, SVG, and TIFF. You can resize images for Instagram, YouTube, LinkedIn, Facebook, Pinterest, TikTok, email, web design, and 150+ other formats.',
  },
  {
    question: 'Can I use QuickToolHub on my phone or tablet?',
    answer: 'Yes! QuickToolHub works on all devices—desktop, tablet, and smartphone. Our responsive design automatically adapts to your screen size, so you can resize images online from anywhere, anytime.',
  },
  {
    question: 'Why should I use QuickToolHub instead of other tools?',
    answer: 'Unlike desktop software or cloud services, QuickToolHub runs entirely in your browser with no uploads. It\'s faster, more private, and doesn\'t require installation. We also support 150+ formats, offer batch processing, and provide advanced tools like PDF merging and file conversion—all completely free.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 border-b border-border bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-muted-foreground">
              Everything you need to know about using QuickToolHub
            </p>
          </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-background hover:bg-muted/50 transition-colors text-left"
              >
                <h3 className="font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Schema markup */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
        </div>
      </div>
    </section>
  );
}
