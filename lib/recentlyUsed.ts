'use client';

import { getToolBySlug, type InternalTool, type ToolType } from '@/lib/toolRegistry';

const STORAGE_KEY = 'quicktoolhub-recently-used';
const LEGACY_IMAGE_STORAGE_KEY = 'image-resizer-recently-used';
const MAX_ITEMS = 5;

export interface RecentlyUsedFormat {
  slug: string;
  timestamp: number;
}

export interface RecentlyUsedTool {
  slug: string;
  type: ToolType;
  timestamp: number;
}

function parseStoredList(): RecentlyUsedTool[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentlyUsedTool[] = raw ? JSON.parse(raw) : [];

    // One-time migration from legacy image-only key.
    if (list.length === 0) {
      const legacyRaw = localStorage.getItem(LEGACY_IMAGE_STORAGE_KEY);
      const legacyList: RecentlyUsedFormat[] = legacyRaw ? JSON.parse(legacyRaw) : [];
      if (legacyList.length > 0) {
        const migrated = legacyList.map((item) => ({
          slug: item.slug,
          type: 'image' as const,
          timestamp: item.timestamp,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }

    return list;
  } catch {
    return [];
  }
}

function writeStoredList(items: RecentlyUsedTool[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

/**
 * Get the list of recently used format slugs from localStorage
 * Returns up to 5 most recent items, sorted by timestamp (newest first)
 */
export function getRecentlyUsed(): string[] {
  return getRecentlyUsedTools()
    .filter((item) => item.type === 'image')
    .map((item) => item.slug);
}

/**
 * Add a format slug to the recently used list
 * Moves existing items to the top if already present
 */
export function addToRecentlyUsed(slug: string): void {
  addToolToRecentlyUsed({ slug, type: 'image' });
}

/**
 * Returns full recently-used list with tool type.
 */
export function getRecentlyUsedTools(limit: number = MAX_ITEMS): RecentlyUsedTool[] {
  return parseStoredList()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Returns recently-used tools resolved against the current registry.
 */
export function getRecentlyUsedToolRecords(limit: number = MAX_ITEMS): InternalTool[] {
  return getRecentlyUsedTools(limit)
    .map((item) => getToolBySlug(item.slug, item.type))
    .filter((tool): tool is InternalTool => Boolean(tool));
}

/**
 * Add a tool visit to recently used tracking.
 */
export function addToolToRecentlyUsed(input: { slug: string; type: ToolType }): void {
  if (typeof window === 'undefined') return;

  try {
    const items = parseStoredList();
    const filtered = items.filter(
      (item) => !(item.slug === input.slug && item.type === input.type)
    );

    filtered.unshift({
      slug: input.slug,
      type: input.type,
      timestamp: Date.now(),
    });

    writeStoredList(filtered);
  } catch (error) {
    console.error('Error adding to recently used tools:', error);
  }
}

/**
 * Clear the recently used list
 */
export function clearRecentlyUsed(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_IMAGE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently used formats:', error);
  }
}
