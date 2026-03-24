'use client';

import { useEffect } from 'react';
import { addToolToRecentlyUsed, type RecentlyUsedTool } from '@/lib/recentlyUsed';

export function useTrackToolVisit(tool: Pick<RecentlyUsedTool, 'slug' | 'type'>) {
  useEffect(() => {
    addToolToRecentlyUsed({ slug: tool.slug, type: tool.type });
  }, [tool.slug, tool.type]);
}
