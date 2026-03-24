# Resizely

Resizely is a Next.js App Router platform for image resizing and PDF utilities, with SEO-focused dynamic pages and browser-first processing flows.

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
