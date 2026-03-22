'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { ImageFormat } from '@/lib/formats';

interface RelatedToolsProps {
  tools: ImageFormat[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Related Tools</h2>
      <p className="text-muted-foreground">
        Try resizing images for other popular formats
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/resize-image/${tool.slug}`}
            className="group"
          >
            <Card className="p-4 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.width} × {tool.height} px
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                  Resize Image
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
