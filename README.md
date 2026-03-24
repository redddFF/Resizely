# QuickToolHub

QuickToolHub is a Next.js App Router platform for image resizing, PDF utilities, and converter workflows, with SEO-focused dynamic pages and browser-first processing flows.

## Platform Specs

### Core product coverage

Last verified: 2026-03-24

- Image resize presets: 150
- Image category groups: 24
- PDF tools: 11
- PDF category groups: 4

### Image platform/category matrix

| Category | Presets |
| --- | ---: |
| Web & Blog | 14 |
| E-commerce | 12 |
| Ads - Google | 11 |
| Social Media - Instagram | 11 |
| Email & Marketing | 10 |
| Video Platforms - YouTube | 9 |
| Social Media - Facebook | 8 |
| Social Media - LinkedIn | 8 |
| Aspect Ratios | 7 |
| Social Media - Pinterest | 7 |
| Video Platforms - TikTok | 6 |
| Ads - Meta | 6 |
| Social Media - Reddit | 5 |
| Print & Design | 5 |
| Social Media - Twitter/X | 5 |
| Messaging - Telegram | 4 |
| Messaging - Snapchat | 4 |
| Messaging - WhatsApp | 4 |
| Gaming & Streaming | 4 |
| Publishing - Medium | 3 |
| Ads - Snapchat | 2 |
| Ads - X | 2 |
| Ads - LinkedIn | 2 |
| Ads - Pinterest | 1 |

### PDF tool matrix

| Category | Tools |
| --- | ---: |
| PDF Utilities | 4 |
| Image Conversion | 4 |
| Document Tools | 2 |
| PDF Editing | 2 |

### Included PDF tools

- Merge PDF Files
- Split PDF Pages
- Compress PDF File
- JPG to PDF
- PDF to JPG
- PDF to Word
- PDF to Text
- PDF to Excel
- PDF to PowerPoint
- Add Watermark to PDF
- Reorder PDF Pages

### Processing and limits (current implementation)

- PDF merge: up to 20 files, up to 100MB per file
- PDF split/compress/extract: up to 100MB per file
- JPG to PDF: up to 20 images, up to 50MB per image
- Browser-first handling for privacy-oriented workflows

## Technical Specs

### Runtime and framework

- Next.js: 16.2.0
- React: 19.2.4
- TypeScript: 5.7.3
- Node.js: 18+ recommended

### UI and styling

- Tailwind CSS 4
- Radix UI primitives
- Lucide icons
- Next Themes

### PDF/Image libraries

- pdf-lib
- pdfjs-dist
- jsPDF
- JSZip
- Sharp

### Analytics and SEO

- Vercel Analytics integration
- JSON-LD structured data
- Dynamic sitemap and robots handling
- PWA manifest endpoint via App Router (`/manifest.webmanifest`)

### Brand and domain

- Primary brand: QuickToolHub
- Primary domain: `https://quicktoolhub.tech`
- Canonical host strategy: apex domain preferred over `www`

## Tool Platform Coverage

### Dynamic route systems

- `/resize-image/[slug]`: image preset pages (150 static paths)
- `/resize/[slug]`: SEO/image template route for image presets (150 static paths)
- `/pdf/[slug]`: PDF dynamic tool pages (11 static paths)
- `/tools/image/[slug]`: image workflow tools (`resize`, `compress`, `convert`)
- `/tools/pdf/[slug]`: PDF workflow tools (`merge`, `split`, `pdf-to-image`, `pdf-to-word`)
- `/convert/[slug]`: converter workflow pages (`resize`, `compress`, `convert`)

### Canonical and alias coverage

- Canonical image page pattern: `/resize-image/<slug>`
- Canonical PDF page pattern: `/pdf/<slug>`
- Maintained aliases/redirect paths:
	- `/pdf/merge` -> merge workflow
	- `/pdf/split` -> `/pdf/split-pdf`
	- `/pdf/pdf-to-image` -> `/pdf/pdf-to-jpg`
	- `/tools/*` and `/convert/*` workflow pages for direct processing UIs

## Internal Linking System Specs

### Site-wide internal linking components

- Related tools block: dynamic 3-5 links per tool page
- Popular tools block: dynamic top 5 links site-wide
- Recently used block: dynamic 3-5 links by user session/local visit history
- Footer top-tools nav: semantic `<footer><nav><ul><li>` dynamic link lists

### Internal linking data layers

- `lib/toolRegistry.ts`: unified tool registry and popularity scoring for image/PDF/workflow tools
- `lib/toolCatalog.ts`: route-type catalog used by internal-link rendering
- `lib/toolSessionUsage.ts`: session-based visit and popularity tracking
- `lib/recentlyUsed.ts`: localStorage recently-used tracking with legacy migration support

### Render integration points

- `components/ToolPageTemplate.tsx`
- `components/ResizeImagePage.tsx`
- `components/tools/InternalLinksSections.tsx`
- `components/PopularToolsSection.tsx`
- `components/RecentlyUsedSection.tsx`
- `components/Footer.tsx`

### Tracking and storage behavior

- Session popularity key: `qth:usage-tools` (sessionStorage)
- Session recent key: `qth:recent-tools` (sessionStorage)
- Local recent key: `quicktoolhub-recently-used` (localStorage)
- Legacy migration key: `image-resizer-recently-used` -> migrated to unified local key

### Accessibility and semantic guarantees

- Section headings for all internal-link blocks (`h2`)
- Labeled navigation landmarks via `aria-label`
- Link groups rendered in semantic lists (`ul`/`li`)
- Descriptive anchor text for crawler readability and UX clarity

## API/Processing Platform Specs

### Image conversion endpoints

- `/api/convert-image/resize`
- `/api/convert-image/compress`
- `/api/convert-image/convert`

### PDF conversion endpoints

- `/api/convert-pdf/merge`
- `/api/convert-pdf/split`
- `/api/convert-pdf/pdf-to-image`
- `/api/convert-pdf/pdf-to-word`

## SEO and social metadata specs

### Open Graph coverage (important pages)

- Homepage: complete OG tags (`title`, `description`, `type`, `url`, `image`)
- About, Privacy, Terms: complete OG tags
- Guide pages: social media sizes, ad sizes, ecommerce sizes, blog sizes with complete OG tags
- PDF tools hub page: complete OG tags

### Structured metadata strategy

- Sitewide metadata from `app/layout.tsx`
- Page-level overrides via static `metadata` or `generateMetadata`
- JSON-LD blocks for webpage/website/item lists and breadcrumbs

## Deployment and edge routing specs

### Vercel redirect rules

- `www.quicktoolhub.tech` -> `https://quicktoolhub.tech` (301)
- HTTP -> HTTPS redirect for apex host (301)
- Full path and query preservation for redirects

### Caching headers for image performance

- Implemented in `vercel.json` for: `jpg`, `jpeg`, `png`, `gif`, `svg`
- Headers:
	- `Cache-Control: public, max-age=31536000, immutable`
	- `Expires: Thu, 31 Dec 2037 23:55:55 GMT`

### Server config references

- Apache and NGINX examples: `CACHING_HEADERS_GUIDE.md`
- CMS plugin recommendations (WordPress): `CACHING_HEADERS_GUIDE.md`

## Project Structure

Key application paths:

- `app/` - App Router pages, layouts, API routes, sitemap, robots, manifest
- `components/` - shared UI and feature sections
- `data/` - PDF tool metadata
- `lib/` - image formats and processing helpers
- `public/` - static assets and icons

## Local Development

### Install

```bash
pnpm install
```

### Run dev server

```bash
pnpm dev
```

### Production build

```bash
pnpm build
pnpm start
```

## Configuration Notes

- `next.config.mjs` sets `turbopack.root` to the Resizely directory to avoid workspace root inference issues when multiple lockfiles exist.
- TypeScript build errors are currently ignored in Next config (`ignoreBuildErrors: true`) for deployment flexibility.
- Next image optimization is disabled (`images.unoptimized: true`) in current config.

## Data Sources for Specs

Platform specs above are derived from:

- `lib/formats.ts`
- `data/pdfTools.ts`

Update these files to add new platforms/tools, then refresh this README section if counts change.
