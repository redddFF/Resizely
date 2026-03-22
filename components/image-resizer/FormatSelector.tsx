'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formats } from '@/lib/formats';

interface FormatSelectorProps {
  onFormatSelect: (width: number, height: number) => void;
}

export function FormatSelector({ onFormatSelect }: FormatSelectorProps) {
  const groupedFormats = formats.reduce(
    (acc, format) => {
      if (!acc[format.category]) {
        acc[format.category] = [];
      }
      acc[format.category].push(format);
      return acc;
    },
    {} as Record<string, typeof formats>
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground">
        Quick Select Format
      </label>
      <Select
        onValueChange={(slug) => {
          const format = formats.find((f) => f.slug === slug);
          if (format) {
            onFormatSelect(format.width, format.height);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a format..." />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedFormats).map(([category, categoryFormats]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {category}
              </div>
              {categoryFormats.map((format) => (
                <SelectItem key={format.slug} value={format.slug}>
                  {format.name} ({format.width}x{format.height})
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
