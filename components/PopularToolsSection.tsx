'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getPopularTools } from '@/lib/toolRegistry';

interface PopularToolsSectionProps {
  limit?: number;
}

export function PopularToolsSection({ limit = 5 }: PopularToolsSectionProps) {
  const popularTools = getPopularTools(limit);

  if (popularTools.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 border-b border-border bg-gradient-to-br from-background to-muted/30" aria-labelledby="popular-tools-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 id="popular-tools-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Popular Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse the most-used tools across QuickToolHub, with direct links to each workflow.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" aria-label="Top tools">
          {popularTools.map((tool) => (
            <li key={tool.id}>
              <Link href={tool.href} className="group block" aria-label={`Open ${tool.name}`}>
                <Card className="p-5 h-full hover:shadow-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-base">
                        {tool.icon || 'TOOL'}
                      </span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{tool.category}</p>
                    <p className="text-sm text-muted-foreground">
                      Try the {tool.name} online tool
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium pt-1">
                      Open tool
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
