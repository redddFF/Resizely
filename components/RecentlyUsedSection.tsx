'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { getRecentlyUsed } from '@/lib/recentlyUsed';
import { formats, type ImageFormat } from '@/lib/formats';

export function RecentlyUsedSection() {
  const [recentFormats, setRecentFormats] = useState<ImageFormat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const recentSlugs = getRecentlyUsed();
    if (recentSlugs.length > 0) {
      const recentFormatObjects = recentSlugs
        .map(slug => formats.find(f => f.slug === slug))
        .filter((f): f is ImageFormat => f !== undefined);
      setRecentFormats(recentFormatObjects);
    }
    setIsLoading(false);
  }, []);

  if (isLoading || recentFormats.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 border-b border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance">
          Recently Used
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {recentFormats.map((format) => (
            <Link
              key={format.slug}
              href={`/resize-image/${format.slug}`}
              className="group"
            >
              <Card className="p-4 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                      {format.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format.width} × {format.height} px
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-medium pt-1">
                    Resize
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
