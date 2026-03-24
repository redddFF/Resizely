# Vercel Deployment Guide

## Deploying Programmatic SEO System to Vercel

This guide walks through deploying the complete 163+ page system to Vercel with full production optimization.

---

## Prerequisites

- [ ] Git repository (local code)
- [ ] Vercel account (https://vercel.com)
- [ ] GitHub/GitLab/Bitbucket connected
- [ ] Main branch ready for deployment
- [ ] Local build tested: `npm run build`

---

## Step 1: Local Build Test

Before deploying, verify everything builds locally:

```bash
# Clear cache
rm -rf .next node_modules

# Reinstall dependencies
npm install

# Build locally (generates 163+ pages)
npm run build

# Expected output:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Generated 163 static pages
# ✓ Built in X seconds
```

**What to verify**:
- ✅ No TypeScript errors
- ✅ No build warnings
- ✅ "✓ Compiled successfully" message
- ✅ Build time 60-90 seconds
- ✅ `.next/server/pages/resize/` has 150+ files
- ✅ `.next/server/pages/pdf/` has 13+ files

### Check Build Output

```bash
# Count generated pages
ls .next/server/pages/resize/ | wc -l     # Should be ~150
ls .next/server/pages/pdf/ | wc -l        # Should be ~13

# Verify page structure
ls .next/server/pages/resize/instagram-post/
# Should contain: page.html, page.json, etc.
```

---

## Step 2: Connect to Vercel

### Option A: Using Git Integration (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select your Git provider (GitHub, GitLab, Bitbucket)
4. Find your repository (e.g., "Resizely")
5. Click **"Import"**

### Option B: Using Vercel CLI

```bash
# Install CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link project (run from project root)
cd /path/to/Resizely
vercel link

# Follow prompts:
# ? Set up and deploy "~/Resizely"? [Y/n] y
# ? Which scope should contain your project? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? Resizely
# ? In which directory is your code? .
# ? Want to modify these settings? [y/N] n
```

---

## Step 3: Configure Environment Variables

### Via Vercel Dashboard

1. Go to **Project Settings** → **Environment Variables**
2. Add variable:
   ```
   Name: NEXT_PUBLIC_BASE_URL
   Value: https://resizelab.io
   Environments: Production, Preview, Development
   ```

### Via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_BASE_URL

# Enter value: https://resizelab.io
# Select environments: All
```

### Environment Configuration

Create `.env.local` for local development:

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Create `.env.production` for production:

```bash
# .env.production
NEXT_PUBLIC_BASE_URL=https://resizelab.io
```

---

## Step 4: Configure Build Settings

### Via Vercel Dashboard

1. Go to **Project Settings** → **Build & Development Settings**
2. Verify:
   - **Framework Preset**: Next.js ✓
   - **Build Command**: `npm run build` ✓
   - **Output Directory**: `.next` ✓
   - **Install Command**: `npm install` ✓
   - **Development Command**: `npm run dev` ✓

### Optimize for Static Generation

Add to `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_BASE_URL": "@base_url"
  },
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## Step 5: Deploy

### Method 1: Automatic Deployment (Recommended)

```bash
# Push to main branch
git add .
git commit -m "Deploy programmatic SEO system"
git push origin main

# Vercel automatically deploys!
# Monitor at https://vercel.com/dashboard
```

### Method 2: Manual Deployment

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### Method 3: Using Git Integration

1. Changes pushed to `main`
2. Vercel automatically detects
3. Build triggers automatically
4. Deployment starts

---

## Step 6: Monitor Build Progress

### In Vercel Dashboard

1. Go to **Deployments** tab
2. Click on active deployment
3. View real-time build logs

### Key Metrics to Watch

```
> Cloning repository...
> Installing dependencies...
> Running "npm run build"...
  ✓ Compiled successfully
  ✓ Generated 163 pages
  ✓ Built sitemap
  ✓ Deployment complete

Total build time: ~90 seconds
Deployed to: https://resizelab.io
```

### What Success Looks Like

```
✓ Deployment Status: Success
✓ Built and deployed to production in 2 min 30 sec
✓ Lambdas created: 0 (all static)
✓ Static props: 163
✓ Sitemap generated: 350+ URLs
```

---

## Step 7: Post-Deployment Verification

### Check Production Pages

```bash
# Test image format page
curl -s https://resizelab.io/resize/instagram-post | head -50

# Should show:
# <title>Instagram Post - Fast Conversion | Resizelab</title>
# <meta name="description" content="...">

# Test PDF tool page
curl -s https://resizelab.io/pdf/merge-pdf | head -50

# Should show unique metadata
```

### Verify in Browser

```
Visit pages:
✓ https://resizelab.io/resize/instagram-post
✓ https://resizelab.io/resize/youtube-thumbnail
✓ https://resizelab.io/pdf/merge-pdf
✓ https://resizelab.io/pdf/compress-pdf
✓ https://resizelab.io/sitemap.xml
```

**Check in DevTools**:
- F12 → Elements tab
- Look for `<title>` tag - should be unique
- Look for `<meta name="og:description">` - should be unique
- Look for JSON-LD in `<head>` - should exist
- Network tab - Status should be 200

### Test Specific Features

```bash
# Check metadata diversity
curl -s https://resizelab.io/resize/instagram-post | grep "<title>"
# vs
curl -s https://resizelab.io/resize/youtube-thumbnail | grep "<title>"
# Should be different!

# Check sitemap size
curl -I https://resizelab.io/sitemap.xml
# Should show: Content-Length: 50000+ (varies by tool count)

# Check JSON-LD schema
curl -s https://resizelab.io/pdf/merge-pdf | grep "@context" -A 5
# Should show schema.org markup
```

---

## Step 8: Submit to Google Search Console

### Add Domain

1. Go to https://search.google.com/search-console
2. Click **"Add property"**
3. Enter domain: `resizelab.io`
4. Verify ownership (DNS, HTML, Google Analytics, etc.)

### Submit Sitemap

1. In Search Console, select your domain
2. Go to **Sitemaps** (left menu)
3. Enter: `sitemap.xml`
4. Click **"Submit"**

### Monitor Indexation

1. Go to **Coverage** report
2. Check **"Indexed"** count
3. Should increase over 24-48 hours
4. All 163+ pages should eventually index

### Check for Errors

1. Go to **Enhancements** → **Structured Data**
2. Look for JSON-LD validation
3. Should show 0 errors (if all valid)

---

## Step 9: Monitor Performance

### Vercel Analytics

1. Go to **Project Settings** → **Analytics**
2. Enable Real Experience Monitoring
3. Watch metrics:
   - Requests per day
   - Build deployments
   - Bandwidth usage
   - Page load times

### Google Search Console

Monitor weekly:
- **Performance**: Click-through rate, avg position
- **Coverage**: Indexed pages count
- **Enhancements**: Structured data validation
- **Mobile usability**: Any issues?

### Lighthouse Scores

```bash
# Use Vercel's Lighthouse integration
# Or manual check:
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://resizelab.io/resize/instagram-post&key=YOUR_GOOGLE_API_KEY"

# Expected:
# Performance: >90
# Accessibility: >95
# Best Practices: >90
# SEO: >95
```

---

## Step 10: Optional Configurations

### Enable Analytics

Add to `next.config.mjs`:

```javascript
import { withAnalyzer } from '@next/bundle-analyzer';

const nextConfig = {
  // ... existing config ...
  experimental: {
    optimizePackageImports: ['@shadcn/ui'],
  },
};

export default process.env.ANALYZE === 'true'
  ? withAnalyzer(nextConfig)
  : nextConfig;
```

### Set Up Caching Headers

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/resize/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/pdf/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

### Enable Incremental Static Regeneration (ISR)

Add to route pages if you want on-demand updates:

```typescript
// /app/pdf/[slug]/page.tsx
export const revalidate = 86400; // 24 hours
```

---

## Troubleshooting Deployment

### Build Fails: "Types error"

```bash
# Fix TypeScript errors locally
npm run build

# Address any errors
npm run lint

# Commit and push
git push origin main
```

### Build Fails: "Module not found"

```bash
# Install missing dependencies
npm install

# Rebuild
npm run build

# Push
git push origin main
```

### Pages not generating

```bash
# Check Vercel build logs for:
"✓ Generated X static pages"

# Should show 163+ pages
# If less, check /lib/formats.ts and /data/pdfTools.ts

# Redeploy with:
vercel --prod
```

### Sitemap not updating

```bash
# Manually trigger rebuild
vercel --prod

# Then resubmit in Google Search Console:
# Sitemaps > Click sitemap > Request indexing
```

### Pages slow to load

```bash
# Check performance in Vercel Analytics
# Monitor Core Web Vitals

# If LCP >2.5s:
# 1. Reduce image sizes
# 2. Optimize JSON
# 3. Check third-party scripts

# Typical metrics:
# TTFB: <50ms
# FCP: <1s
# LCP: <2.5s
# CLS: <0.1
```

---

## Performance Expectations

### Build Metrics
- Build time: 60-90 seconds
- Pages generated: 163+
- Static pages: 100% (zero lambdas)
- Sitemap URLs: 350+

### Runtime Metrics
- Page load: <100ms (from CDN)
- Time to interactive: <2s
- Lighthouse: >90
- Core Web Vitals: All passing

### Deployment Metrics
- Deploy frequency: Daily (automatic)
- Deploy success: >99%
- CDN distribution: Global (150+ PoPs)
- SSL/TLS: Free (auto-renewed)

---

## Ongoing Maintenance

### Weekly
- Check Google Search Console for errors
- Monitor Core Web Vitals
- Check index coverage

### Monthly
- Review traffic analytics
- Update SEO content if needed
- Test new formats/tools generation

### Quarterly
- Full SEO audit
- Lighthouse score review
- Performance optimization

### Annually
- Refresh all seoContent
- Update FAQs based on search queries
- Verify schema markup still valid

---

## Rollback Deployment

If something breaks:

```bash
# View deployment history
vercel deployments

# Rollback to previous
vercel rollback

# Or promote specific deployment
vercel promote <deployment-id>
```

---

## Success Checklist

- [ ] Local build test passes (npm run build)
- [ ] Project linked to Vercel
- [ ] Environment variables set
- [ ] Main branch deployment successful
- [ ] All 163+ pages accessible
- [ ] Metadata unique per page
- [ ] Sitemap includes 350+ URLs
- [ ] Google Search Console shows pages indexed
- [ ] Core Web Vitals passing
- [ ] Analytics working

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js 14: https://nextjs.org/docs
- Vercel CLI: https://vercel.com/cli
- Status: https://www.vercelstatus.com

---

**Deployment complete!** System now live at production URL. Monitor performance and rankings in Google Search Console.

Monitor at: https://vercel.com/dashboard
Google Search Console: https://search.google.com/search-console
