# PDF Tools - Deployment Guide

## 🚀 Deploying to Vercel (Recommended)

### Prerequisites
- Vercel account (free tier available)
- GitHub/GitLab/Bitbucket repository
- Domain name (optional, Vercel provides free subdomain)

### Step 1: Push Code to Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Add PDF tools: merge, jpg-to-pdf, pdf-to-jpg"

# Add remote (GitHub example)
git remote add origin https://github.com/yourusername/resizelab.git

# Push to repository
git push -u origin main
```

### Step 2: Connect to Vercel

1. Sign in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your repository
4. Click "Import"
5. Configure project:
   - **Framework**: Next.js
   - **Build Command**: `pnpm build` (default detected)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install --frozen-lockfile`

### Step 3: Set Environment Variables

In Vercel Dashboard, go to **Settings → Environment Variables**:

```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=1234567890
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Add for Production, Staging, and Development environments as needed.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-5 minutes)
3. View deployment at `https://your-project.vercel.app`
4. Check deployment logs for any errors

### Step 5: Setup Custom Domain

1. In Vercel Dashboard, go to **Settings → Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `pdf.resizelab.io`)
4. Follow DNS instructions provided by Vercel
5. Wait for DNS propagation (5-48 hours)

---

## 📦 Environment Configuration

### Production (.env.local or Vercel Dashboard)

```bash
# Required
NEXT_PUBLIC_BASE_URL=https://resizelab.io

# AdSense Configuration
NEXT_PUBLIC_ADSENSE_ID=ca-pub-YOUR_PUBLISHER_ID
NEXT_PUBLIC_ADSENSE_SLOT_TOP=YOUR_SLOT_ID_1
NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE=YOUR_SLOT_ID_2
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=YOUR_SLOT_ID_3

# Analytics
NEXT_PUBLIC_GA_ID=G-YOUR_MEASUREMENT_ID

# Optional: API Keys for Premium Features
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### Development (.env.local)

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ADSENSE_ID=
NEXT_PUBLIC_ADSENSE_SLOT_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE=
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=
NEXT_PUBLIC_GA_ID=
```

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] Run `pnpm run lint` - Fix all linting errors
- [ ] Run `pnpm build` - Verify successful build
- [ ] Test all 3 PDF tools locally
- [ ] Check console for any warnings
- [ ] Verify no `console.log()` statements left in production code

### SEO & Metadata
- [ ] Verify title tags are 150-160 characters
- [ ] Verify descriptions are 155-160 characters
- [ ] Check canonical URLs are correct
- [ ] Verify OpenGraph tags
- [ ] Confirm breadcrumb links are working

### Testing
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test PDF merge with large files
- [ ] Test image-to-PDF with multiple formats
- [ ] Test PDF-to-image extraction
- [ ] Verify download functionality works

### Performance
- [ ] Check Lighthouse score (target: >80)
- [ ] Run `next/image` optimization if using images
- [ ] Verify bundle size is reasonable
- [ ] Test with slow network (DevTools)

### Security
- [ ] Review all file upload validations
- [ ] Check file size limits are enforced
- [ ] Verify error messages don't leak info
- [ ] Run security audit: `pnpm audit`

### Configuration
- [ ] Update NEXT_PUBLIC_BASE_URL
- [ ] Configure AdSense IDs and slots
- [ ] Setup Google Analytics ID
- [ ] Verify all environment variables set

---

## 🔍 Post-Deployment Verification

### 1. Test All Routes
```bash
curl -I https://yourdomain.com/pdf/merge
curl -I https://yourdomain.com/pdf/jpg-to-pdf
curl -I https://yourdomain.com/pdf/pdf-to-jpg
```

All should return `200 OK`

### 2. Check Sitemap
Visit `https://yourdomain.com/sitemap.xml` and verify:
- All 3 PDF routes are included
- Priorities are 0.85
- URLs are correct

### 3. Test SEO Metadata
Use [Rich Results Test](https://search.google.com/test/rich-results):
- Paste tool URLs
- Verify structured data is valid
- Check OG tags render correctly

### 4. Verify Analytics
- Check Google Analytics property is receiving traffic
- Verify referral sources
- Monitor conversion events

### 5. Test User Journey
1. Visit homepage
2. Click "PDF Tools" section
3. Test merge PDF flow
4. Test jpg-to-pdf flow
5. Test pdf-to-jpg flow
6. Verify downloads work
7. Check no console errors

---

## 📊 Monitoring & Analytics Setup

### Google Search Console
1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add property with your domain
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`
4. Monitor:
   - Click-through rate (CTR)
   - Average position
   - Impressions
   - Errors

### Google Analytics 4
1. Create new GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
4. Implement tracking in components:

```typescript
// In your components
const trackEvent = (toolName: string) => {
  if (window.gtag) {
    window.gtag('event', 'pdf_tool_used', {
      tool: toolName,
      timestamp: new Date().toISOString(),
    });
  }
};
```

### AdSense Setup
1. Sign up for [Google AdSense](https://www.google.com/adsense)
2. Add site and wait for approval (24-48 hours)
3. Create ad units:
   - Top banner (728×90 or 300×250)
   - Middle content (300×250 or 336×280)
   - Bottom banner (728×90)
4. Get ad unit codes and add to environment variables

---

## 🚨 Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -r .next
pnpm install --force
pnpm build
```

### Environment Variables Not Loading
```bash
# Check environment variables in Vercel Dashboard
# Prefix must be NEXT_PUBLIC_ for client-side exposure

# After updating, redeploy (push code change or rebuild in Dashboard)
```

### 404 Errors on Routes
```bash
# Verify folder structure:
app/
  pdf/
    merge/page.tsx

# Check if file names are correct (case-sensitive on Linux)
```

### Slow Performance
```bash
# Check bundle analysis
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

# Run: ANALYZE=true pnpm build
```

### PDF Processing Fails
```bash
# Check browser console for errors
# Verify file size limits in validation
# Check browser memory usage
# Try smaller files first

# Common issues:
// - File too large (> 100MB)
// - Corrupted PDF
// - Unsupported image format
// - Out of memory
```

### AdSense Ads Not Showing
```bash
# Check ad unit code is correct
# Verify publisher ID is valid
# Allow 24-48 hours after setup
# Check browser console for errors
# Verify site is approved by AdSense
```

---

## 🔄 Continuous Deployment

### Git Push Auto-Deploy

When you push to `main` branch, Vercel automatically:
1. Triggers build
2. Runs tests (if configured)
3. Deploys to production environment
4. Updates live site

### Rollback to Previous Deployment

In Vercel Dashboard:
1. Go to **Deployments**
2. Find previous successful deployment
3. Click **...** menu
4. Select **Promote to Production**

---

## 📈 Scaling Considerations

### Traffic Growth
- ✅ Vercel auto-scales with CDN
- ✅ Browser-only processing handles load
- ✅ No backend bottlenecks

### File Size Handling
- Monitor large file processing
- Consider adding progress indicators
- Implement file chunking for 50MB+ files

### Cost Optimization
- Monitor bandwidth usage
- Consider caching strategies
- Use Vercel Analytics for insights

---

## 🔐 Security After Deployment

### SSL/TLS Certificate
- ✅ Vercel provides free HTTPS automatically
- ✅ Redirects HTTP → HTTPS
- ✅ Adds `Strict-Transport-Security` header

### CORS & Headers
Vercel automatically sets:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

### Content Security Policy
Consider adding to `next.config.js`:
```javascript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      },
    ],
  },
],
```

---

## 📞 Support & Troubleshooting

### Vercel Support
- Documentation: https://vercel.com/docs
- Status: https://www.vercelstatus.com
- Discord Community: https://vercel.com/discord
- Premium Support: Available on Pro plan

### Next.js Support
- Documentation: https://nextjs.org/docs
- GitHub Issues: https://github.com/vercel/next.js/issues
- Discussions: https://github.com/vercel/next.js/discussions

### PDF Library Issues
- pdf-lib: https://github.com/Crutchlow/pdf-lib
- jsPDF: https://github.com/parallax/jsPDF
- pdfjs: https://github.com/mozilla/pdf.js

---

## 📋 Deployment Verification Checklist

Production Launch Readiness:
- [ ] All code committed to repository
- [ ] Environment variables configured in Vercel
- [ ] Build completes successfully
- [ ] All 3 PDF tools accessible and working
- [ ] Sitemap generated with correct URLs
- [ ] SEO metadata verified
- [ ] AdSense ads configured
- [ ] Analytics tracking active
- [ ] HTTPS working (green lock)
- [ ] Domain pointing to Vercel (if custom domain)
- [ ] Mobile responsive verified
- [ ] No console errors in production
- [ ] Download functionality works
- [ ] Error handling tested
- [ ] Performance acceptable (Lighthouse >80)
- [ ] Security headers present
- [ ] Robots.txt and sitemap submitted to Google Search Console

---

## 🎉 Launch Complete!

Once all checks pass, your PDF Tools platform is live and ready to serve users!

**Monitor metrics regularly:**
- Daily active users
- Tool completion rates
- Error rates
- Page load times
- Conversion events

---

**Last Updated**: 2024
**Deployment Platform**: Vercel (recommended)
**Next.js Version**: 16.2.0
**Status**: Ready for production
