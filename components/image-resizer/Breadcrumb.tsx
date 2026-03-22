'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm text-primary hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-foreground font-medium">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight size={16} className="text-muted-foreground" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
