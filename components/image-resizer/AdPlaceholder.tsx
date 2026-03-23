'use client';

import React from 'react';

interface AdPlaceholderProps {
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

/**
 * AdPlaceholder Component - Ready for Google AdSense
 * 
 * Dimensions:
 * - Top: 728x90 (Leaderboard) or responsive (970x90 on desktop)
 * - Middle: 300x250 (Medium Rectangle) or 336x280
 * - Bottom: 728x90 (Leaderboard) or 300x250
 * 
 * Insert your AdSense code in place of this placeholder:
 * <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxx"
 *     crossOrigin="anonymous"></script>
 * <ins class="adsbygoogle"
 *      style="display:block"
 *      data-ad-client="ca-pub-xxxxxxxxxx"
 *      data-ad-slot="xxxxxxxxxx"
 *      data-ad-format="auto"
 *      data-full-width-responsive="true"></ins>
 */
export function AdPlaceholder({ position = 'middle', className = '' }: AdPlaceholderProps) {
  const getDimensions = () => {
    switch (position) {
      case 'top':
        return { minHeight: '100px', maxWidth: '100%' };
      case 'middle':
        return { minHeight: '250px', maxWidth: '336px' };
      case 'bottom':
        return { minHeight: '90px', maxWidth: '728px' };
      default:
        return { minHeight: '250px' };
    }
  };

  const getAdLabel = () => {
    switch (position) {
      case 'top':
        return 'Header Advertisement (728×90 or 970×90)';
      case 'middle':
        return 'Middle Advertisement (336×280 or 300×250)';
      case 'bottom':
        return 'Footer Advertisement (728×90)';
      default:
        return 'Advertisement';
    }
  };

  return (
    <div
      className={`w-full bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden flex-col gap-2 ${className}`}
      style={getDimensions()}
      role="region"
      aria-label="Advertisement placeholder"
    >
      <div className="text-center px-4 py-8">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
          {getAdLabel()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Replace with your AdSense code
        </p>
      </div>
    </div>
  );
}
