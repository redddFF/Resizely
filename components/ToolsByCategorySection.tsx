import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ToolCategory {
  title: string;
  description: string;
  bgColor: string;
  viewAllHref?: string;
  tools: Array<{
    name: string;
    slug: string;
    href?: string;
  }>;
}

interface ToolsByCategorySectionProps {
  categories: ToolCategory[];
}

export function ToolsByCategorySection({ categories }: ToolsByCategorySectionProps) {
  return (
    <section className="py-16 md:py-24 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Tools by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of tools organized by category. Find exactly what you need for images, PDFs, and file conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`p-8 rounded-lg border border-border transition-all hover:shadow-lg hover:border-primary/50 ${category.bgColor}`}
            >
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {category.title}
              </h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {category.description}
              </p>

              <div className="space-y-2 mb-6">
                {category.tools.slice(0, 6).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href || `#`}
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span className="text-sm">{tool.name}</span>
                  </Link>
                ))}
                {category.tools.length > 6 &&
                  (category.viewAllHref ? (
                    <Link
                      href={category.viewAllHref}
                      className="flex items-center gap-2 text-primary text-sm font-medium mt-3 pt-3 border-t border-border"
                    >
                      View all {category.tools.length} tools
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <p className="text-primary text-sm font-medium mt-3 pt-3 border-t border-border">
                      {category.tools.length} tools available
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
