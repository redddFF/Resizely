'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorStateProps {
  isVisible: boolean;
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export function ErrorState({
  isVisible,
  title = 'Something went wrong',
  message,
  details,
  onRetry,
  onDismiss,
  showDetails = false,
}: ErrorStateProps) {
  const [expanded, setExpanded] = React.useState(showDetails);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="p-4 border-destructive/50 bg-destructive/5">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
          {onDismiss && (
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {details && (
          <div className="space-y-2">
            {expanded && (
              <div className="p-3 rounded bg-muted/50 text-xs font-mono text-muted-foreground overflow-x-auto max-h-32 overflow-y-auto border border-border">
                {details}
              </div>
            )}
            <Button
              onClick={() => setExpanded(!expanded)}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              {expanded ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              size="sm"
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
