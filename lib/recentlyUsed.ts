'use client';

const STORAGE_KEY = 'image-resizer-recently-used';
const MAX_ITEMS = 5;

export interface RecentlyUsedFormat {
  slug: string;
  timestamp: number;
}

/**
 * Get the list of recently used format slugs from localStorage
 * Returns up to 5 most recent items, sorted by timestamp (newest first)
 */
export function getRecentlyUsed(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items: RecentlyUsedFormat[] = JSON.parse(stored);
    return items
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_ITEMS)
      .map(item => item.slug);
  } catch (error) {
    console.error('Error reading recently used formats:', error);
    return [];
  }
}

/**
 * Add a format slug to the recently used list
 * Moves existing items to the top if already present
 */
export function addToRecentlyUsed(slug: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: RecentlyUsedFormat[] = [];
    
    if (stored) {
      items = JSON.parse(stored);
    }
    
    // Remove if already exists
    items = items.filter(item => item.slug !== slug);
    
    // Add new item at the beginning
    items.unshift({
      slug,
      timestamp: Date.now(),
    });
    
    // Keep only MAX_ITEMS
    items = items.slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error adding to recently used formats:', error);
  }
}

/**
 * Clear the recently used list
 */
export function clearRecentlyUsed(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently used formats:', error);
  }
}
