import type { CatalogTool, ToolRouteType } from '@/lib/toolCatalog'

const RECENT_KEY = 'qth:recent-tools'
const USAGE_KEY = 'qth:usage-tools'
const MAX_RECENT = 5

interface RecentToolEntry {
  slug: string
  routeType: ToolRouteType
  href: string
  name: string
  visitedAt: number
}

type UsageMap = Record<string, number>

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function getKey(slug: string, routeType: ToolRouteType): string {
  return `${routeType}:${slug}`
}

export function trackToolVisit(tool: {
  slug: string
  routeType: ToolRouteType
  href: string
  name: string
}): void {
  if (typeof window === 'undefined') return

  const recent = safeParse<RecentToolEntry[]>(sessionStorage.getItem(RECENT_KEY), [])
  const usage = safeParse<UsageMap>(sessionStorage.getItem(USAGE_KEY), {})

  const entry: RecentToolEntry = {
    ...tool,
    visitedAt: Date.now(),
  }

  const deduped = recent.filter(
    (item) => !(item.slug === tool.slug && item.routeType === tool.routeType)
  )
  deduped.unshift(entry)

  const storageKey = getKey(tool.slug, tool.routeType)
  usage[storageKey] = (usage[storageKey] ?? 0) + 1

  sessionStorage.setItem(RECENT_KEY, JSON.stringify(deduped.slice(0, MAX_RECENT)))
  sessionStorage.setItem(USAGE_KEY, JSON.stringify(usage))
}

export function getRecentlyUsedTools(limit = 5): RecentToolEntry[] {
  if (typeof window === 'undefined') return []

  const recent = safeParse<RecentToolEntry[]>(sessionStorage.getItem(RECENT_KEY), [])
  return recent.slice(0, limit)
}

export function getPopularToolsFromSession(allTools: CatalogTool[], limit = 5): CatalogTool[] {
  if (typeof window === 'undefined') return allTools.slice(0, limit)

  const usage = safeParse<UsageMap>(sessionStorage.getItem(USAGE_KEY), {})

  const ranked = [...allTools].sort((a, b) => {
    const aUsage = usage[getKey(a.slug, a.routeType)] ?? 0
    const bUsage = usage[getKey(b.slug, b.routeType)] ?? 0

    if (bUsage !== aUsage) {
      return bUsage - aUsage
    }

    return b.usageWeight - a.usageWeight
  })

  return ranked.slice(0, limit)
}
