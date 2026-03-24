'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getRecentlyUsedToolRecords } from '@/lib/recentlyUsed';

interface RecentlyUsedSectionProps {
  limit?: number;
}

export function RecentlyUsedSection({ limit = 5 }: RecentlyUsedSectionProps) {
  const [recentTools, setRecentTools] = useState<ReturnType<typeof getRecentlyUsedToolRecords>>([]);

  useEffect(() => {
    setRecentTools(getRecentlyUsedToolRecords(limit));
  }, [limit]);

  if (recentTools.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 border-b border-border" aria-labelledby="recently-used-tools-heading">
      <div className="container mx-auto px-4">
        <h2 id="recently-used-tools-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance">
          Recently Used Tools
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" aria-label="Recently used tools">
          {recentTools.map((tool) => (
            <li key={tool.id}>
              <Link href={tool.href} className="group block" aria-label={`Continue with ${tool.name}`}>
                <Card className="p-4 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-base">
                        {tool.icon || 'TOOL'}
                      </span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm line-clamp-2">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.category}</p>
                    <div className="flex items-center gap-1 text-primary text-xs font-medium pt-1">
                      Continue
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
