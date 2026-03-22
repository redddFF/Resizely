'use client';

import React from 'react';

interface AdPlaceholderProps {
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

export function AdPlaceholder({ position = 'middle', className = '' }: AdPlaceholderProps) {
  return (
    <div
      className={`w-full bg-muted border border-border rounded-lg flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: '250px' }}
    >
      <div className="text-center px-4 py-8">
        <p className="text-sm text-muted-foreground font-medium">
          Advertisement Space
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Your ad here • {position === 'top' ? 'Top' : position === 'middle' ? 'Middle' : 'Bottom'} Position
        </p>
      </div>
    </div>
  );
}
