'use client';

interface AdPlaceholderProps {
  position: 'top' | 'middle' | 'bottom';
  className?: string;
}

export function AdPlaceholder({ position, className = '' }: AdPlaceholderProps) {
  return (
    <div className={`w-full border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/50 flex items-center justify-center ${className}`}>
      <div className="text-center p-8">
        <div className="text-sm font-medium text-muted-foreground mb-2">Advertisement</div>
        <div className="inline-block px-4 py-2 bg-muted border border-muted-foreground/20 rounded text-xs text-muted-foreground">
          {position === 'top' && 'Top Banner Ad (728x90 or responsive)'}
          {position === 'middle' && 'Middle Display Ad (300x250 or 336x280)'}
          {position === 'bottom' && 'Bottom Banner Ad (728x90 or responsive)'}
        </div>
        <p className="text-xs text-muted-foreground mt-3">AdSense Placement Ready</p>
      </div>
    </div>
  );
}
