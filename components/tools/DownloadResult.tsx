'use client';

import React from 'react';
import { Download, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface DownloadResultProps {
  isVisible: boolean;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  fileType?: string;
  onDownload?: () => void;
  onNew?: () => void;
  additionalInfo?: {
    pages?: number;
    dimensions?: string;
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function DownloadResult({
  isVisible,
  fileName,
  fileSize,
  downloadUrl,
  fileType = 'file',
  onDownload,
  onNew,
  additionalInfo,
}: DownloadResultProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isVisible) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onDownload) {
      onDownload();
    }
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(fileName);
    setCopied(true);
    toast({
      description: 'File name copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {fileType} ready to download
            </h3>
            <p className="text-sm text-muted-foreground">
              Your {fileType} has been successfully created
            </p>
          </div>
        </div>

        <div className="bg-background/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(fileSize)}
              </p>
            </div>
            <Button
              onClick={handleCopyName}
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              title="Copy file name"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {additionalInfo && (
            <div className="pt-2 border-t border-border space-y-1 text-xs text-muted-foreground">
              {additionalInfo.pages && (
                <p>Pages: {additionalInfo.pages}</p>
              )}
              {additionalInfo.dimensions && (
                <p>Dimensions: {additionalInfo.dimensions}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            className="flex-1 gap-2"
            size="lg"
          >
            <Download className="w-4 h-4" />
            Download {fileType}
          </Button>
          {onNew && (
            <Button
              onClick={onNew}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Convert Another
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          The file will be automatically deleted from our servers after 24 hours
        </p>
      </div>
    </Card>
  );
}
