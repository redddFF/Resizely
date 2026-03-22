'use client';

import React, { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImagePreviewProps {
  dataUrl: string;
  width: number;
  height: number;
  isLoading?: boolean;
}

export function ImagePreview({
  dataUrl,
  width,
  height,
  isLoading = false,
}: ImagePreviewProps) {
  const aspectRatio = width / height;

  if (isLoading) {
    return (
      <div className="w-full bg-muted rounded-lg overflow-hidden">
        <div style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} className="relative">
          <Skeleton className="absolute inset-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-lg overflow-hidden border border-border shadow-sm">
      <div
        style={{
          paddingBottom: `${(1 / aspectRatio) * 100}%`,
        }}
        className="relative"
      >
        <img
          loading="lazy"
          src={dataUrl}
          alt="Resized preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="px-4 py-3 border-t border-border bg-muted/50">
        <p className="text-xs text-muted-foreground">
          {width} × {height} px
        </p>
      </div>
    </div>
  );
}
