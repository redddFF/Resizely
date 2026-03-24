'use client';

import React from 'react';
import { X, File, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  timestamp?: number;
}

interface FilePreviewListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  canReorder?: boolean;
  onReorder?: (files: FileItem[]) => void;
  isLoading?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function FilePreviewList({
  files,
  onRemove,
  canReorder = false,
  onReorder,
  isLoading = false,
}: FilePreviewListProps) {
  if (files.length === 0) {
    return null;
  }

  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const handleDragStart = (id: string) => {
    if (!canReorder) return;
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (!canReorder) return;
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!canReorder || !draggedId || !onReorder) return;
    e.preventDefault();

    const draggedIndex = files.findIndex((f) => f.id === draggedId);
    const targetIndex = files.findIndex((f) => f.id === targetId);

    if (draggedIndex === targetIndex) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const newFiles = [...files];
    const [removed] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, removed);

    onReorder(newFiles);
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Uploaded Files ({files.length})
        </h3>
      </div>

      <Card className="p-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={file.id}
            className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
              dragOverId === file.id && canReorder
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
            } ${draggedId === file.id && canReorder ? 'opacity-50' : ''}`}
            draggable={canReorder && !isLoading}
            onDragStart={() => handleDragStart(file.id)}
            onDragOver={(e) => handleDragOver(e, file.id)}
            onDrop={(e) => handleDrop(e, file.id)}
            onDragLeave={() => setDragOverId(null)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {canReorder && (
                <span className="text-xs text-muted-foreground font-medium w-5 text-center">
                  {index + 1}
                </span>
              )}
              <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(file.id)}
              disabled={isLoading}
              className="h-8 w-8 flex-shrink-0"
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </Card>

      {canReorder && (
        <p className="text-xs text-muted-foreground text-center">
          Drag to reorder files
        </p>
      )}
    </div>
  );
}
