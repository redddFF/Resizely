'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  placeholder?: string;
  isLoading?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept,
  multiple = true,
  maxFiles = 20,
  placeholder = 'Drag and drop files here or click to select',
  isLoading = false,
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const validateFiles = (files: File[]): File[] | null => {
    if (!multiple && files.length > 1) {
      setError('Only one file is allowed for this tool');
      return null;
    }

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return null;
    }

    const acceptTypes = accept
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const extensionFromName = (name: string) => {
      const dotIndex = name.lastIndexOf('.');
      return dotIndex >= 0 ? name.slice(dotIndex).toLowerCase() : '';
    };

    const mimeMatchesExtension = (mime: string, extension: string) => {
      const commonMimeToExt: Record<string, string[]> = {
        'application/pdf': ['.pdf'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
        'image/gif': ['.gif'],
        'image/bmp': ['.bmp'],
        'image/svg+xml': ['.svg'],
      };

      return (commonMimeToExt[mime] || []).includes(extension);
    };

    const isAcceptedFile = (file: File) => {
      if (acceptTypes.length === 0) return true;

      const fileType = (file.type || '').toLowerCase();
      const fileExtension = extensionFromName(file.name);

      return acceptTypes.some((acceptType) => {
        if (acceptType === '*' || acceptType === '*/*') {
          return true;
        }

        // Extension rule: .pdf, .webp, etc.
        if (acceptType.startsWith('.')) {
          return fileExtension === acceptType;
        }

        // Wildcard MIME rule: image/*
        if (acceptType.endsWith('/*')) {
          const prefix = acceptType.slice(0, acceptType.length - 1); // keeps trailing '/'
          if (fileType) {
            return fileType.startsWith(prefix);
          }
          // Fallback for browsers that omit MIME type on dropped files
          return prefix === 'image/' && ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'].includes(fileExtension);
        }

        // Exact MIME rule: application/pdf, image/webp, etc.
        if (fileType) {
          return fileType === acceptType;
        }

        // Fallback when file.type is empty
        return mimeMatchesExtension(acceptType, fileExtension);
      });
    };

    const validFiles = files.filter((file) => {
      const isValid = isAcceptedFile(file);
      if (!isValid) {
        setError(`Invalid file type: ${file.name}`);
      }
      return isValid;
    });

    if (validFiles.length === 0) {
      return null;
    }

    setError('');
    return validFiles;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (isLoading) return;

      const files = Array.from(e.dataTransfer.files);
      const validated = validateFiles(files);
      if (validated) {
        onFileSelect(validated);
      }
    },
    [onFileSelect, isLoading]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validated = validateFiles(files);
    if (validated) {
      onFileSelect(validated);
    }
  };

  return (
    <div className="space-y-3">
      <Card
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="file"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={isLoading}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="File upload"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">{placeholder}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {multiple ? `Up to ${maxFiles} files` : '1 file'} • {accept}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" disabled={isLoading}>
            Select Files
          </Button>
        </div>
      </Card>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 flex items-start gap-2">
          <span className="font-medium">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
