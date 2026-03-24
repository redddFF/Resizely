'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  allCatalogTools,
  getCatalogByRouteType,
  getFooterTopTools,
  getPopularCatalogTools,
  getRelatedCatalogTools,
  type ToolRouteType,
} from '@/lib/toolCatalog'
import {
  getPopularToolsFromSession,
  getRecentlyUsedTools,
  trackToolVisit,
} from '@/lib/toolSessionUsage'

interface LinkItem {
  href: string
  label: string
  slug: string
}

interface InternalLinksSectionsProps {
  current: {
    slug: string
    name: string
    routeType: ToolRouteType
    category?: string
    href: string
  }
  relatedTools?: Array<{ name: string; slug: string; category?: string }>
  relatedLimit?: number
  popularLimit?: number
  recentLimit?: number
}

function toLabel(name: string, category?: string): string {
  if (!category) return name
  return `${name} (${category})`
}

export function InternalLinksSections({
  current,
  relatedTools = [],
  relatedLimit = 5,
  popularLimit = 5,
  recentLimit = 5,
}: InternalLinksSectionsProps) {
  const [recent, setRecent] = useState<LinkItem[]>([])
  const [popularFromSession, setPopularFromSession] = useState<LinkItem[]>([])

  const related = useMemo(() => {
    if (relatedTools.length > 0) {
      return relatedTools
        .slice(0, relatedLimit)
        .map((tool) => {
          const resolved =
            allCatalogTools.find(
              (item) => item.slug === tool.slug && item.routeType === current.routeType
            ) ?? allCatalogTools.find((item) => item.slug === tool.slug)

          return {
            href: resolved?.href ?? `/${current.routeType}/${tool.slug}`,
            label: toLabel(tool.name, tool.category),
            slug: tool.slug,
          }
        })
    }

    return getRelatedCatalogTools(
      current.slug,
      current.routeType,
      current.category,
      relatedLimit
    ).map((tool) => ({
      href: tool.href,
      label: toLabel(tool.name, tool.category),
      slug: tool.slug,
    }))
  }, [current.category, current.routeType, current.slug, relatedLimit, relatedTools])

  const popularFallback = useMemo(() => {
    return getPopularCatalogTools(popularLimit, current.routeType).map((tool) => ({
      href: tool.href,
      label: toLabel(tool.name, tool.category),
      slug: tool.slug,
    }))
  }, [current.routeType, popularLimit])

  const footerLinks = useMemo(() => {
    return getFooterTopTools(12).map((tool) => ({
      href: tool.href,
      label: tool.name,
      slug: tool.slug,
    }))
  }, [])

  useEffect(() => {
    trackToolVisit({
      slug: current.slug,
      routeType: current.routeType,
      href: current.href,
      name: current.name,
    })

    const recentItems = getRecentlyUsedTools(recentLimit)
      .filter((item) => !(item.slug === current.slug && item.routeType === current.routeType))
      .map((item) => ({
        href: item.href,
        label: item.name,
        slug: item.slug,
      }))

    const sessionPopular = getPopularToolsFromSession(
      getCatalogByRouteType(current.routeType),
      popularLimit
    )
      .filter((item) => item.slug !== current.slug)
      .map((item) => ({
        href: item.href,
        label: item.name,
        slug: item.slug,
      }))

    setRecent(recentItems)
    setPopularFromSession(sessionPopular)
  }, [current.href, current.name, current.routeType, current.slug, popularLimit, recentLimit])

  const popular = popularFromSession.length > 0 ? popularFromSession : popularFallback

  return (
    <>
      <section aria-labelledby="related-tools-title" className="py-10">
        <h2 id="related-tools-title" className="text-2xl font-bold text-foreground mb-4">
          Related Tools
        </h2>
        <nav aria-label="Related tools">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map((item) => (
              <li key={`related-${item.slug}`}>
                <Link href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section aria-labelledby="popular-tools-title" className="py-10 border-t border-border">
        <h2 id="popular-tools-title" className="text-2xl font-bold text-foreground mb-4">
          Popular Tools
        </h2>
        <nav aria-label="Popular tools">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popular.slice(0, popularLimit).map((item) => (
              <li key={`popular-${item.slug}`}>
                <Link href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section aria-labelledby="recent-tools-title" className="py-10 border-t border-border">
        <h2 id="recent-tools-title" className="text-2xl font-bold text-foreground mb-4">
          Recently Used
        </h2>
        <nav aria-label="Recently used tools">
          {recent.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recent.map((item) => (
                <li key={`recent-${item.slug}`}>
                  <Link href={item.href} className="text-primary hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Your recently used tools will appear here.</p>
          )}
        </nav>
      </section>

      <footer className="py-10 border-t border-border" aria-labelledby="footer-tools-title">
        <h2 id="footer-tools-title" className="text-xl font-semibold text-foreground mb-4">
          Explore Top Tools
        </h2>
        <nav aria-label="Footer top tools links">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {footerLinks.map((item) => (
              <li key={`footer-${item.slug}`}>
                <Link href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </>
  )
}
