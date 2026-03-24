import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ImageToolPage from '@/components/tools/ImageToolPage'
import { buildConverterMetadata } from '@/lib/toolSeo'

const convertToolConfig = {
  resize: {
    name: 'Resize Image',
    category: 'Image Converters',
    apiEndpoint: '/api/convert-image/resize',
    toolType: 'resize' as const,
  },
  compress: {
    name: 'Compress Image',
    category: 'Image Converters',
    apiEndpoint: '/api/convert-image/compress',
    toolType: 'compress' as const,
  },
  convert: {
    name: 'Convert Image',
    category: 'Image Converters',
    apiEndpoint: '/api/convert-image/convert',
    toolType: 'convert' as const,
  },
}

export async function generateStaticParams() {
  return Object.keys(convertToolConfig).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = convertToolConfig[slug as keyof typeof convertToolConfig]

  if (!config) {
    return {}
  }

  return buildConverterMetadata(
    {
      name: config.name,
      slug,
      description: `Use ${config.name.toLowerCase()} online free with quick output, high quality, and no signup required.`,
      category: config.category,
    },
    `/convert/${slug}`
  )
}

export default async function ConvertToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = convertToolConfig[slug as keyof typeof convertToolConfig]

  if (!config) {
    notFound()
  }

  const tool = {
    id: slug,
    name: config.name,
    slug,
    description: `${config.name} online free. Upload your file and process instantly with quality controls.`,
    seoContent: `Use ${config.name.toLowerCase()} online for fast browser-based processing. This converter supports practical workflows for creators, marketers, and business teams.`,
    category: config.category,
    features: [
      'Fast conversion workflow',
      'Browser-based processing',
      'No signup required',
      'Quality controls for output',
      'Free to use',
    ],
    faqs: [
      {
        question: `How does ${config.name.toLowerCase()} work?`,
        answer: `Upload your file, configure options, and run ${config.name.toLowerCase()} in one click.`,
      },
      {
        question: 'Is this converter free?',
        answer: 'Yes, this converter is free to use.',
      },
      {
        question: 'Are my files private?',
        answer: 'Files are processed in the app workflow without account signup.',
      },
    ],
  }

  return (
    <ImageToolPage
      tool={tool}
      toolType={config.toolType}
      apiEndpoint={config.apiEndpoint}
      currentPath={`/convert/${slug}`}
      routeType="convert"
    />
  )
}
