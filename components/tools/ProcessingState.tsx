'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingStateProps {
  isProcessing: boolean;
  progress?: number; // 0-100
  message?: string;
  subMessage?: string;
  estimatedTime?: string;
}

export function ProcessingState({
  isProcessing,
  progress,
  message = 'Processing your files...',
  subMessage,
  estimatedTime,
}: ProcessingStateProps) {
  if (!isProcessing) {
    return null;
  }

  const progressValue = progress ?? 0;
  const showProgress = progress !== undefined;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <div>
            <h3 className="font-semibold text-foreground">{message}</h3>
            {subMessage && (
              <p className="text-sm text-muted-foreground">{subMessage}</p>
            )}
          </div>
        </div>

        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Progress value={progressValue} className="flex-1" />
              <span className="ml-3 text-xs font-medium text-muted-foreground min-w-fit">
                {Math.round(progressValue)}%
              </span>
            </div>
            {estimatedTime && (
              <p className="text-xs text-muted-foreground">
                Estimated time: {estimatedTime}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground italic">
          Please don't refresh the page while processing...
        </p>
      </div>
    </Card>
  );
}
