'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';

interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function QualitySlider({ value, onChange }: QualitySliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Compression Quality</h3>
        <span className="text-sm font-medium text-primary">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        min={1}
        max={100}
        step={1}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        {value > 85 ? 'High quality, larger file size' : value > 60 ? 'Balanced quality and file size' : 'Lower quality, smaller file size'}
      </p>
    </div>
  );
}
