'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getRelatedTools, getToolBySlug, type InternalTool, type ToolType } from '@/lib/toolRegistry';

interface RelatedToolsSectionProps {
  currentSlug: string;
  currentType: ToolType;
  currentCategory?: string;
  limit?: number;
}

export function RelatedToolsSection({
  currentSlug,
  currentType,
  currentCategory,
  limit = 5,
}: RelatedToolsSectionProps) {
  const currentTool = getToolBySlug(currentSlug, currentType);
  const relatedTools: InternalTool[] = getRelatedTools(currentSlug, currentType, {
    category: currentCategory,
    limit,
  });

  if (!currentTool || relatedTools.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-tools-heading" className="space-y-4">
      <h2 id="related-tools-heading" className="text-2xl md:text-3xl font-bold text-foreground">
        Related Tools
      </h2>
      <p className="text-muted-foreground">
        Explore similar tools to continue your workflow faster.
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Related tools links">
        {relatedTools.map((tool) => (
          <li key={tool.id}>
            <Link href={tool.href} className="group block" aria-label={`${tool.name} tool`}>
              <Card className="p-4 h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-base">
                      {tool.icon || 'TOOL'}
                    </span>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{tool.category}</p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Open tool
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
