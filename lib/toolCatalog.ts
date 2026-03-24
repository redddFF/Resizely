import { formats } from '@/lib/formats'
import { pdfTools } from '@/data/pdfTools'

export type ToolRouteType = 'image' | 'pdf' | 'convert'

export interface CatalogTool {
  id: string
  name: string
  slug: string
  category: string
  description: string
  routeType: ToolRouteType
  href: string
  usageWeight: number
}

const curatedPopularSlugs = [
  'instagram-post',
  'youtube-thumbnail',
  'facebook-post',
  'linkedin-post',
  'merge-pdf',
  'jpg-to-pdf',
  'pdf-to-jpg',
  'compress-pdf',
]

const curatedWeightMap = new Map<string, number>(
  curatedPopularSlugs.map((slug, index) => [slug, 100 - index])
)

const imageCatalog: CatalogTool[] = formats.map((format) => ({
  id: format.id,
  name: format.name,
  slug: format.slug,
  category: format.category,
  description: format.description,
  routeType: 'image',
  href: `/resize-image/${format.slug}`,
  usageWeight: curatedWeightMap.get(format.slug) ?? 10,
}))

const pdfCatalog: CatalogTool[] = pdfTools.map((tool) => ({
  id: tool.id,
  name: tool.name,
  slug: tool.slug,
  category: tool.category || 'PDF Tools',
  description: tool.description,
  routeType: 'pdf',
  href: `/pdf/${tool.slug}`,
  usageWeight: curatedWeightMap.get(tool.slug) ?? 10,
}))

const convertCatalog: CatalogTool[] = [
  {
    id: 'convert-image',
    name: 'Convert Image',
    slug: 'convert',
    category: 'Image Converters',
    description: 'Convert image files between JPEG, PNG, and WebP formats online.',
    routeType: 'convert',
    href: '/convert/convert',
    usageWeight: 50,
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    slug: 'compress',
    category: 'Image Converters',
    description: 'Compress image size while keeping visual quality.',
    routeType: 'convert',
    href: '/convert/compress',
    usageWeight: 45,
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    slug: 'resize',
    category: 'Image Converters',
    description: 'Resize any image to custom dimensions instantly.',
    routeType: 'convert',
    href: '/convert/resize',
    usageWeight: 55,
  },
]

export const allCatalogTools: CatalogTool[] = [
  ...imageCatalog,
  ...pdfCatalog,
  ...convertCatalog,
]

export function getCatalogByRouteType(routeType: ToolRouteType): CatalogTool[] {
  if (routeType === 'image') return imageCatalog
  if (routeType === 'pdf') return pdfCatalog
  return convertCatalog
}

export function getPopularCatalogTools(limit = 5, routeType?: ToolRouteType): CatalogTool[] {
  const pool = routeType ? getCatalogByRouteType(routeType) : allCatalogTools
  return [...pool]
    .sort((a, b) => b.usageWeight - a.usageWeight)
    .slice(0, limit)
}

export function getRelatedCatalogTools(
  currentSlug: string,
  routeType: ToolRouteType,
  category?: string,
  limit = 5
): CatalogTool[] {
  const pool = getCatalogByRouteType(routeType)

  const sameCategory = pool
    .filter((tool) => tool.slug !== currentSlug && category && tool.category === category)
    .slice(0, limit)

  if (sameCategory.length >= limit) {
    return sameCategory
  }

  const fallback = pool.filter(
    (tool) => tool.slug !== currentSlug && !sameCategory.some((item) => item.slug === tool.slug)
  )

  return [...sameCategory, ...fallback].slice(0, limit)
}

export function getFooterTopTools(limit = 12): CatalogTool[] {
  return getPopularCatalogTools(limit)
}
