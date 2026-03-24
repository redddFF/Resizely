import { formats } from '@/lib/formats';
import { pdfTools } from '@/data/pdfTools';

export type ToolType = 'image' | 'pdf';

export interface InternalTool {
  id: string;
  slug: string;
  name: string;
  href: string;
  type: ToolType;
  category: string;
  popularity: number;
  icon?: string;
  formatTags: string[];
}

const FORMAT_TAGS = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'bmp',
  'svg',
  'tiff',
  'doc',
  'docx',
  'word',
  'excel',
  'xlsx',
  'ppt',
  'pptx',
  'image',
];

const POPULARITY_SCORES: Record<string, number> = {
  'image:instagram-post': 150,
  'image:youtube-thumbnail': 145,
  'image:facebook-post': 138,
  'image:linkedin-post': 132,
  'image:pinterest-pin': 126,
  'image:tiktok-video': 120,
  'image:google-display-300x250': 118,
  'image:website-hero': 112,
  'pdf:merge-pdf': 155,
  'pdf:jpg-to-pdf': 148,
  'pdf:pdf-to-jpg': 140,
  'pdf:split-pdf': 129,
  'pdf:compress-pdf': 122,
  'pdf:resize': 110,
  'pdf:merge': 150,
  'pdf:split': 127,
  'pdf:pdf-to-image': 139,
  'pdf:pdf-to-word': 125,
  'image:resize': 134,
  'image:compress': 121,
  'image:convert': 117,
};

function extractFormatTags(input: string): string[] {
  const value = input.toLowerCase();
  return FORMAT_TAGS.filter((tag) => value.includes(tag));
}

function getPdfHref(slug: string): string {
  const routeMap: Record<string, string> = {
    'merge-pdf': '/pdf/merge',
    'jpg-to-pdf': '/pdf/jpg-to-pdf',
    'jpeg-to-pdf': '/pdf/jpg-to-pdf',
    'png-to-pdf': '/pdf/jpg-to-pdf',
    'webp-to-pdf': '/pdf/jpg-to-pdf',
    'bmp-to-pdf': '/pdf/jpg-to-pdf',
    'gif-to-pdf': '/pdf/jpg-to-pdf',
    'image-to-pdf': '/pdf/jpg-to-pdf',
    'pdf-to-jpg': '/pdf/pdf-to-jpg',
    'pdf-to-image': '/pdf/pdf-to-jpg',
    'split-pdf': '/tools/pdf/split',
    'pdf-to-word': '/tools/pdf/pdf-to-word',
  };

  return routeMap[slug] ?? `/pdf/${slug}`;
}

function buildImageTools(): InternalTool[] {
  return formats.map((format, index) => {
    const key = `image:${format.slug}`;
    const popularity = POPULARITY_SCORES[key] ?? Math.max(10, 100 - index);

    return {
      id: key,
      slug: format.slug,
      name: format.name,
      href: `/resize-image/${format.slug}`,
      type: 'image',
      category: format.category,
      popularity,
      icon: 'IMG',
      formatTags: extractFormatTags(`${format.slug} ${format.name} ${format.category}`),
    };
  });
}

function buildPdfTools(): InternalTool[] {
  return pdfTools.map((tool, index) => {
    const key = `pdf:${tool.slug}`;
    const popularity = POPULARITY_SCORES[key] ?? Math.max(12, 95 - index);

    return {
      id: key,
      slug: tool.slug,
      name: tool.name,
      href: getPdfHref(tool.slug),
      type: 'pdf',
      category: tool.category,
      popularity,
      icon: 'PDF',
      formatTags: extractFormatTags(`${tool.slug} ${tool.name} ${tool.category}`),
    };
  });
}

function buildWorkflowTools(): InternalTool[] {
  const workflowTools: InternalTool[] = [
    {
      id: 'image:resize',
      slug: 'resize',
      name: 'Resize Image Tool',
      href: '/tools/image/resize',
      type: 'image',
      category: 'Image Tools',
      popularity: POPULARITY_SCORES['image:resize'] ?? 110,
      icon: 'RESIZE',
      formatTags: ['image'],
    },
    {
      id: 'image:compress',
      slug: 'compress',
      name: 'Compress Image Tool',
      href: '/tools/image/compress',
      type: 'image',
      category: 'Image Tools',
      popularity: POPULARITY_SCORES['image:compress'] ?? 105,
      icon: 'COMPRESS',
      formatTags: ['image'],
    },
    {
      id: 'image:convert',
      slug: 'convert',
      name: 'Convert Image Tool',
      href: '/tools/image/convert',
      type: 'image',
      category: 'Image Tools',
      popularity: POPULARITY_SCORES['image:convert'] ?? 102,
      icon: 'CONVERT',
      formatTags: ['image'],
    },
    {
      id: 'pdf:merge',
      slug: 'merge',
      name: 'Merge PDF Tool',
      href: '/tools/pdf/merge',
      type: 'pdf',
      category: 'PDF Tools',
      popularity: POPULARITY_SCORES['pdf:merge'] ?? 130,
      icon: 'MERGE',
      formatTags: ['pdf'],
    },
    {
      id: 'pdf:split',
      slug: 'split',
      name: 'Split PDF Tool',
      href: '/tools/pdf/split',
      type: 'pdf',
      category: 'PDF Tools',
      popularity: POPULARITY_SCORES['pdf:split'] ?? 118,
      icon: 'SPLIT',
      formatTags: ['pdf'],
    },
    {
      id: 'pdf:pdf-to-image',
      slug: 'pdf-to-image',
      name: 'PDF to Image Tool',
      href: '/tools/pdf/pdf-to-image',
      type: 'pdf',
      category: 'PDF Tools',
      popularity: POPULARITY_SCORES['pdf:pdf-to-image'] ?? 122,
      icon: 'PDF-IMG',
      formatTags: ['pdf', 'image'],
    },
    {
      id: 'pdf:pdf-to-word',
      slug: 'pdf-to-word',
      name: 'PDF to Word Tool',
      href: '/tools/pdf/pdf-to-word',
      type: 'pdf',
      category: 'PDF Tools',
      popularity: POPULARITY_SCORES['pdf:pdf-to-word'] ?? 115,
      icon: 'PDF-DOC',
      formatTags: ['pdf', 'word', 'docx'],
    },
  ];

  return workflowTools;
}

const ALL_TOOLS: InternalTool[] = [...buildImageTools(), ...buildPdfTools(), ...buildWorkflowTools()];

function dedupeById(tools: InternalTool[]): InternalTool[] {
  const seen = new Set<string>();
  return tools.filter((tool) => {
    if (seen.has(tool.id)) {
      return false;
    }
    seen.add(tool.id);
    return true;
  });
}

export function getAllTools(): InternalTool[] {
  return dedupeById(ALL_TOOLS);
}

export function getToolBySlug(slug: string, type?: ToolType): InternalTool | undefined {
  return getAllTools().find((tool) => tool.slug === slug && (type ? tool.type === type : true));
}

export function getPopularTools(limit = 5): InternalTool[] {
  return getAllTools()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getRelatedTools(
  slug: string,
  type: ToolType,
  options?: { category?: string; limit?: number }
): InternalTool[] {
  const limit = options?.limit ?? 5;
  const currentTool = getToolBySlug(slug, type);

  if (!currentTool) {
    return [];
  }

  const category = options?.category ?? currentTool.category;
  const currentTags = new Set(currentTool.formatTags);

  const scored = getAllTools()
    .filter((tool) => tool.id !== currentTool.id)
    .map((tool) => {
      let score = 0;

      if (tool.category === category) {
        score += 8;
      }
      if (tool.type === currentTool.type) {
        score += 2;
      }

      const sharedTagCount = tool.formatTags.filter((tag) => currentTags.has(tag)).length;
      score += sharedTagCount * 4;

      score += tool.popularity / 100;

      return { tool, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.tool);

  return scored;
}
