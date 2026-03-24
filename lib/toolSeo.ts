import type { Metadata } from 'next'

interface SeoInput {
  name: string
  slug: string
  description: string
  category?: string
}

const defaultBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quicktoolhub.tech'
const brandName = 'QuickToolHub'

function truncate(text: string, max = 160): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}...`
}

export function getSeoBaseUrl(): string {
  return defaultBaseUrl
}

export function buildImageFormatMetadata(
  tool: SeoInput & { width?: number; height?: number },
  pagePath: string,
  canonicalPath?: string
): Metadata {
  const dimensionPart = tool.width && tool.height ? ` ${tool.width}x${tool.height}` : ''
  const title = `Resize ${tool.name}${dimensionPart} Online Free | ${brandName}`
  const description = truncate(
    `${tool.description} Resize ${tool.name} online free with instant output, correct dimensions, and no signup required.`
  )

  return buildMetadata({
    title,
    description,
    pagePath,
    canonicalPath: canonicalPath ?? pagePath,
  })
}

export function buildPdfToolMetadata(tool: SeoInput, pagePath: string): Metadata {
  const title = `${tool.name} Online Free | ${brandName}`
  const description = truncate(
    `${tool.description} Use ${tool.name.toLowerCase()} online free with fast processing, privacy-first workflow, and no signup required.`
  )

  return buildMetadata({
    title,
    description,
    pagePath,
    canonicalPath: pagePath,
  })
}

export function buildConverterMetadata(tool: SeoInput, pagePath: string): Metadata {
  const title = `${tool.name} Converter Online Free | ${brandName}`
  const description = truncate(
    `${tool.description} Convert files online free with ${tool.name.toLowerCase()}, high quality output, and no signup.`
  )

  return buildMetadata({
    title,
    description,
    pagePath,
    canonicalPath: pagePath,
  })
}

function buildMetadata(params: {
  title: string
  description: string
  pagePath: string
  canonicalPath: string
}): Metadata {
  const pageUrl = `${defaultBaseUrl}${params.pagePath}`
  const canonicalUrl = `${defaultBaseUrl}${params.canonicalPath}`

  return {
    title: params.title,
    description: params.description,
    openGraph: {
      title: params.title,
      description: params.description,
      url: pageUrl,
      type: 'website',
      siteName: brandName,
      images: [
        {
          url: `${defaultBaseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: params.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [`${defaultBaseUrl}/og-image.png`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
