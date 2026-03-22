'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { downloadBlob } from '@/lib/imageProcessor';

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  isLoading?: boolean;
}

export function DownloadButton({ blob, filename, isLoading = false }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Add slight delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      downloadBlob(blob, filename);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading || isDownloading || blob.size === 0}
      size="lg"
      className="w-full"
    >
      {isDownloading || isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download Resized Image
        </>
      )}
    </Button>
  );
}
