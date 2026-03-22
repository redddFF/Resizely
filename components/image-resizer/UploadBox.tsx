'use client';

import React, { useRef } from 'react';
import { Cloud, AlertCircle } from 'lucide-react';
import { validateImageFile } from '@/lib/imageProcessor';

interface UploadBoxProps {
  onImageSelect: (file: File) => void;
  error?: string;
}

export function UploadBox({ onImageSelect, error }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validation = validateImageFile(file);
      if (validation.valid) {
        onImageSelect(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      if (validation.valid) {
        onImageSelect(file);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30 hover:border-primary/50'
        } ${error ? 'border-destructive' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Cloud className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2 text-foreground">
          {isDragActive ? 'Drop your image here' : 'Upload your image'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your image or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP, or GIF up to 5MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
