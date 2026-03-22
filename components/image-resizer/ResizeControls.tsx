'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldLabel, Field } from '@/components/ui/field';

interface ResizeControlsProps {
  width: number;
  height: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  lockAspectRatio?: boolean;
}

export function ResizeControls({
  width,
  height,
  onWidthChange,
  onHeightChange,
  lockAspectRatio = true,
}: ResizeControlsProps) {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    onWidthChange(newWidth);

    if (lockAspectRatio && newWidth > 0) {
      const ratio = height / width;
      onHeightChange(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    onHeightChange(newHeight);

    if (lockAspectRatio && newHeight > 0) {
      const ratio = width / height;
      onWidthChange(Math.round(newHeight * ratio));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Dimensions</h3>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Width (px)</FieldLabel>
          <Input
            type="number"
            value={width}
            onChange={handleWidthChange}
            min="1"
            step="1"
            placeholder="Width"
          />
        </Field>
        <Field>
          <FieldLabel>Height (px)</FieldLabel>
          <Input
            type="number"
            value={height}
            onChange={handleHeightChange}
            min="1"
            step="1"
            placeholder="Height"
          />
        </Field>
      </div>
      <p className="text-xs text-muted-foreground">
        Aspect ratio: {(width / height).toFixed(2)}:1
      </p>
    </div>
  );
}
