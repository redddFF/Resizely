'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formats } from '@/lib/formats';
import { pdfTools } from '@/data/pdfTools';

type SearchToolType = 'Image Tool' | 'PDF Tool';

interface SearchableTool {
  name: string;
  slug: string;
  category: string;
  type: SearchToolType;
  href: string;
  keywords: string;
}

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

export function SmartResolutionSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState<'All Tools' | SearchToolType>('All Tools');

  const allTools = useMemo<SearchableTool[]>(() => {
    const imageTools = formats.map((format) => ({
      name: format.name,
      slug: format.slug,
      category: format.category,
      type: 'Image Tool' as const,
      href: `/resize-image/${format.slug}`,
      keywords: `${format.name} ${format.category} ${format.slug} ${format.description}`,
    }));

    const pdfMapped = pdfTools.map((tool) => ({
      name: tool.name,
      slug: tool.slug,
      category: tool.category,
      type: 'PDF Tool' as const,
      href: tool.slug === 'merge-pdf' ? '/pdf/merge' : `/pdf/${tool.slug}`,
      keywords: `${tool.name} ${tool.category} ${tool.slug} ${tool.description}`,
    }));

    return [...imageTools, ...pdfMapped];
  }, []);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(allTools.map((tool) => tool.category))).sort((a, b) => a.localeCompare(b));
    return ['All Categories', ...categories];
  }, [allTools]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = normalize(query);

    const results = allTools.filter((tool) => {
      if (selectedType !== 'All Tools' && tool.type !== selectedType) {
        return false;
      }

      if (selectedCategory !== 'All Categories' && tool.category !== selectedCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return normalize(tool.keywords).includes(normalizedQuery);
    });

    return results.slice(0, 12);
  }, [allTools, query, selectedCategory, selectedType]);

  const topResult = filteredTools[0] ?? null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (topResult) {
      router.push(topResult.href);
    }
  };

  return (
    <Card className="p-5 md:p-6 mt-8 bg-card/70 backdrop-blur border-border/70 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Tool Search</h2>
          <p className="text-sm text-muted-foreground">
            Search by tool name, category, or type to quickly open the right image or PDF tool.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Search tools (e.g., PDF to Word, Instagram, split)"
            aria-label="Search tools"
          />
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Category"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as 'All Tools' | SearchToolType)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Tool type"
          >
            <option value="All Tools">All Tools</option>
            <option value="Image Tool">Image Tool</option>
            <option value="PDF Tool">PDF Tool</option>
          </select>
          <Button type="submit" disabled={!topResult}>Open Top Result</Button>
        </form>

        <div className="rounded-md border border-border p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-foreground">Matching Tools</p>
            <p className="text-xs text-muted-foreground">Showing {filteredTools.length} results</p>
          </div>

          {filteredTools.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tools found. Try another keyword or change filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredTools.map((tool) => (
                <Link
                  key={`${tool.type}-${tool.slug}`}
                  href={tool.href}
                  className="rounded-md border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium text-foreground line-clamp-1">{tool.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {tool.type} • {tool.category}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}