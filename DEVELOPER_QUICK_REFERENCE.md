# Quick Developer Reference: Programmatic SEO System

## 1-Minute Overview

This system automatically generates 160+ pages from two data files. **No manual page creation needed.**

```
/lib/formats.ts (150+ formats) → Auto-generates /resize/[slug] pages
/data/pdfTools.ts (13 tools)   → Auto-generates /pdf/[slug] pages
                                ↓
                    NEXT.js static generation
                                ↓
                    163+ optimized pages + sitemap
```

---

## Quick Tasks

### Add a New Image Format

Edit `/lib/formats.ts`:

```typescript
{
  id: 'new-format',
  name: 'Format Name',
  slug: 'new-format',  // URL-safe, unique
  category: 'Social Media',
  width: 1200,
  height: 630,
  aspectRatio: '1.91:1',
  description: 'One-line description',
  seoContent: `## Section\nContent here...`,  // 400-800 words
  faqs: [{ question: 'Q?', answer: 'A.' }]  // 3-5 FAQs
}
```

**Result**: Page auto-generates at `/resize/new-format`

### Add a New PDF Tool

Edit `/data/pdfTools.ts`:

```typescript
{
  id: 'new-tool',
  name: 'Tool Name',
  slug: 'new-tool',
  category: 'PDF Utilities',
  description: 'Short description',
  seoContent: '## Content\n...',  // 500-600 words
  features: ['Feature 1', 'Feature 2'],  // 5-8
  maxFileSize: 100,  // MB
  supportedFormats: ['PDF', 'JPG'],
  faqs: [{ question: 'Q?', answer: 'A.' }]  // 3-5
}
```

**Result**: Page auto-generates at `/pdf/new-tool`

---

## Key Files

| File | Purpose | Edit? |
|------|---------|-------|
| `/lib/formats.ts` | 150+ image formats | ✓ Add/edit formats |
| `/data/pdfTools.ts` | 13 PDF tools | ✓ Add/edit tools |
| `/utils/seo.ts` | SEO metadata generation | Usually no |
| `/components/ToolPageTemplate.tsx` | Reusable page UI | Edit for design changes |
| `/app/resize/[slug]/page.tsx` | Image page handler | Usually no |
| `/app/pdf/[slug]/page.tsx` | PDF page handler | Usually no |
| `/app/sitemap.ts` | Sitemap generation | Usually no |

---

## Build & Deploy

```bash
# Local build (test page generation)
npm run build

# Check output:
"Generated 163 pages successfully"

# Deploy to Vercel (automatic)
git push origin main

# Or manual deploy
vercel --prod
```

---

## Check Pages Are Generating

### Local Check
```bash
npm run build
# Look for: "✓ Compiled /app/pdf/[slug]"
#          "✓ Compiled /app/resize/[slug]"
```

### After Deploy
```bash
# Visit a page
https://resizelab.io/resize/instagram-post      # Should load
https://resizelab.io/pdf/merge-pdf              # Should load

# Check SEO tags
curl -s https://resizelab.io/resize/instagram-post | grep "<title>"
# Should show: Instagram Post - Fast Conversion | Resizelab
```

---

## SEO Metadata Auto-Generated

Each page automatically gets:

```
✓ Unique <title> tag (format: "Tool Name - Benefit | Resizelab")
✓ Meta description (150-160 chars)
✓ 15+ long-tail keywords
✓ OpenGraph tags (Facebook sharing)
✓ Twitter card preview
✓ JSON-LD schema.org markup
✓ Breadcrumb navigation
✓ Canonical URL
✓ 3-5 FAQ rich snippets
```

No action needed—auto-generated from tool data.

---

## Related Tools Section

Automatic in each page:
- Shows 3-4 tools from **same category**
- Links to `/resize/[slug]` or `/pdf/[slug]`
- Updates when you add new formats/tools

---

## Troubleshooting

### Pages not generating?
```bash
# Check for errors in local build
npm run build

# Look in /cli/.vercel/logs for build errors
```

### Metadata not showing?
```bash
# Verify in page source
curl -s https://resizelab.io/resize/instagram-post | head -50

# Should include <title>, <meta name="description">, etc.
```

### Sitemap not updated?
```bash
# Verify sitemap exists
curl https://resizelab.io/sitemap.xml | head -20

# Should show <url> entries for all pages
```

---

## What Gets Generated

Each page includes:

1. **Hero Section**
   - Tool name
   - Description
   - CTA buttons ("Open Tool", "Learn More")

2. **Quick Info Cards**
   - Max file size
   - Supported formats
   - Dimensions (images)

3. **Features**
   - 5-8 features with checkmarks
   - Auto-sorted from data

4. **SEO Content**
   - 400-800 word article
   - H2/H3 headings
   - Optimized for Google

5. **FAQ Section**
   - 3-5 questions + answers
   - Accordion UI
   - Schema.org markup

6. **Related Tools**
   - 3-4 tools from same category
   - Links to related pages
   - Internal linking for SEO

7. **CTA Section**
   - Final call-to-action
   - "Ready to [Tool]?"

---

## Performance

- **Build**: 60-90 seconds (all 163 pages)
- **Page size**: 2-3KB gzipped
- **Load time**: <100ms from CDN
- **SEO score**: 90+ Lighthouse

---

## URL Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Image Format | `/resize/[slug]` | `/resize/instagram-post` |
| PDF Tool | `/pdf/[slug]` | `/pdf/merge-pdf` |
| Category (optional) | `/tools/[category]` | `/tools/social-media` |
| Sitemap | `/sitemap.xml` | `/sitemap.xml` |

---

## Next Steps

1. **Add more tools**: Edit `/data/pdfTools.ts`
2. **Add more formats**: Edit `/lib/formats.ts`
3. **Deploy**: `git push origin main`
4. **Monitor**: Check Vercel build logs
5. **Submit sitemap**: Google Search Console

**Done!** Pages auto-generate and rank.

---

## Common Questions

**Q: How many pages will generate?**
A: 150 image formats + 13 PDF tools + category pages = ~163+ pages

**Q: Do I need to manually create pages?**
A: No! Everything auto-generates from the data files.

**Q: How long does build take?**
A: ~60-90 seconds to generate all 163 pages.

**Q: Can I edit page design?**
A: Yes, edit `/components/ToolPageTemplate.tsx`

**Q: Can I add SEO content?**
A: Yes, add to `seoContent` field in data files.

**Q: How do I track traffic?**
A: Add Google Analytics to `/app/layout.tsx`

---

**Questions?** Check `PROGRAMMATIC_SEO_DOCUMENTATION.md` for full details.
