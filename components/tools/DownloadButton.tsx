/**
 * Download Button Component
 * 
 * Reusable download button for file results
 * Handles blob URLs, file naming, and download triggers
 * 
 * Features:
 * - Simple API: pass blob and filename
 * - Loading state support
 * - Custom styling with Tailwind
 * - Error handling
 * - Accessibility support
 */

'use client';

import React from 'react';
import { Download, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  /**
   * Blob or Blob URL to download
   */
  fileUrlOrBlob: string | Blob;

  /**
   * Name for the downloaded file including extension
   */
  filename: string;

  /**
   * Whether the download is in progress
   */
  isLoading?: boolean;

  /**
   * Custom label for the button
   */
  label?: string;

  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Button variant
   */
  variant?: 'default' | 'outline' | 'ghost';

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * Callback after download starts
   */
  onDownloadStart?: () => void;

  /**
   * Callback if download fails
   */
  onError?: (error: Error) => void;
}

export function DownloadButton({
  fileUrlOrBlob,
  filename,
  isLoading = false,
  label = 'Download',
  size = 'md',
  variant = 'default',
  className = '',
  onDownloadStart,
  onError,
}: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      onDownloadStart?.();

      let blob: Blob;
      let url: string;

      // Handle both string URL and Blob
      if (typeof fileUrlOrBlob === 'string') {
        url = fileUrlOrBlob;
        const response = await fetch(url);
        blob = await response.blob();
      } else {
        blob = fileUrlOrBlob;
        url = window.URL.createObjectURL(blob);
      }

      // Create download link and trigger
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      if (typeof fileUrlOrBlob !== 'string') {
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Download failed');
      onError?.(err);
      console.error('Download failed:', err);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant={variant}
      className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}

/**
 * Batch Download Button
 * 
 * Download multiple files as separate downloads
 * Useful for batch conversions
 */
interface BatchDownloadButtonProps {
  files: Array<{
    url: string;
    filename: string;
  }>;
  isLoading?: boolean;
  label?: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function BatchDownloadButton({
  files,
  isLoading = false,
  label = 'Download All',
  onComplete,
  onError,
}: BatchDownloadButtonProps) {
  const handleBatchDownload = async () => {
    try {
      for (const file of files) {
        // Small delay between downloads to avoid blocking
        await new Promise((resolve) => setTimeout(resolve, 100));

        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      onComplete?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Batch download failed');
      onError?.(err);
      console.error('Batch download failed:', err);
    }
  };

  return (
    <Button
      onClick={handleBatchDownload}
      disabled={isLoading || files.length === 0}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {label} ({files.length})
        </>
      )}
    </Button>
  );
}
