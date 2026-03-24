# PDF Tools - Quick Start for Developers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Git

### Installation

```bash
# Navigate to project
cd "c:\Projects\ADSENSE Projects\Resizely"

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Visit tools at:
# - http://localhost:3000/pdf/merge
# - http://localhost:3000/pdf/jpg-to-pdf
# - http://localhost:3000/pdf/pdf-to-jpg
```

### Build for Production

```bash
# Create optimized build
pnpm build

# Start production server
pnpm start
```

---

## 📁 File Organization Guide

### PDF Processing Logic - `/lib/pdf/`

**`mergePdf.ts`** - Combine multiple PDFs
```typescript
import { mergePdfs } from '@/lib/pdf/mergePdf';

const files = [file1, file2, file3]; // Array of File objects
const mergedBlob = await mergePdfs(files);
const url = URL.createObjectURL(mergedBlob);
```

**`jpgToPdf.ts`** - Convert images to PDF
```typescript
import { imagesToPdf } from '@/lib/pdf/jpgToPdf';

const images = [jpg1, png1, webp1]; // Mixed image formats
const pdfBlob = await imagesToPdf(images);
```

**`pdfToJpg.ts`** - Extract pages from PDF
```typescript
import { pdfToJpgs } from '@/lib/pdf/pdfToJpg';

const quality = 2; // 1=low, 2=medium, 3=high
const pages = await pdfToJpgs(pdfFile, quality);
// Returns: [{dataUrl, pageNumber, width, height}, ...]
```

---

## 🎨 UI Components - `/components/tools/`

### FileUpload
```tsx
<FileUpload
  onFileSelect={(files) => handleFiles(files)}
  accept=".pdf"
  multiple={true}
  maxFiles={20}
  placeholder="Drag files here"
  isLoading={false}
/>
```

### FilePreviewList
```tsx
<FilePreviewList
  files={uploadedFiles}
  onRemove={(id) => removeFile(id)}
  onReorder={(files) => reorderFiles(files)}
  canReorder={true}
  isLoading={false}
/>
```

### ProcessingState
```tsx
<ProcessingState
  isProcessing={true}
  message="Converting files..."
  subMessage="Processing 3 files"
  progress={65}
  estimatedTime="2 seconds"
/>
```

### DownloadResult
```tsx
<DownloadResult
  isVisible={true}
  fileName="merged.pdf"
  fileSize={1024000}
  downloadUrl={blobUrl}
  fileType="PDF"
  onNew={() => reset()}
/>
```

### ErrorState
```tsx
<ErrorState
  isVisible={true}
  title="Conversion failed"
  message="File is too large"
  details="Maximum 100MB per file"
  onRetry={() => retry()}
  onDismiss={() => clear()}
  showDetails={true}
/>
```

---

## 🔧 Adding a New PDF Tool

### Step 1: Create Processing Function
Create `/lib/pdf/yourTool.ts`:
```typescript
export async function yourToolFunction(files: File[]): Promise<Blob> {
  // Implement logic
  try {
    // Process files
    return new Blob([result], { type: 'application/pdf' });
  } catch (error) {
    throw new Error('Your error message');
  }
}
```

### Step 2: Create Tool Page
Create `/app/pdf/your-tool/page.tsx`:
```typescript
'use client';
import { useState } from 'react';
import { yourToolFunction } from '@/lib/pdf/yourTool';
import { FileUpload } from '@/components/tools/FileUpload';
import { ProcessingState } from '@/components/tools/ProcessingState';
import { DownloadResult } from '@/components/tools/DownloadResult';

export default function YourToolPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{url: string; name: string} | null>(null);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const blob = await yourToolFunction(files);
      const url = URL.createObjectURL(blob);
      setResult({ url, name: 'output.pdf' });
    } catch (error) {
      // Handle error
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main>
      {/* Your UI */}
    </main>
  );
}
```

### Step 3: Add Metadata
Create `/app/pdf/your-tool/layout.tsx`:
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Tool Title',
  description: 'Your description',
  alternates: {
    canonical: 'https://resizelab.io/pdf/your-tool',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### Step 4: Update Homepage
Add card in `/app/page.tsx` PDF Tools section:
```tsx
<Link href="/pdf/your-tool">
  <Card>
    <h3>Your Tool Title</h3>
    <p>Description</p>
  </Card>
</Link>
```

### Step 5: Update Sitemap
Add to `/app/sitemap.ts`:
```typescript
{
  url: `${baseUrl}/pdf/your-tool`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.85,
}
```

---

## 🐛 Debugging Common Issues

### PDF Processing Issues
```typescript
// Enable detailed logging in pdfToJpg.ts
console.log('PDF loaded:', pdf.numPages);
console.log('Rendering page:', page);
console.log('Canvas dimensions:', canvas.width, canvas.height);
```

### Memory Leaks
```typescript
// Always revoke Blob URLs when done
if (downloadData?.url) {
  URL.revokeObjectURL(downloadData.url);
}
```

### Component State Issues
```typescript
// Reset state properly
const handleNewConversion = () => {
  setFiles([]);
  setResult(null);
  setError(null);
};
```

### Build Errors
```bash
# Clear Next.js cache
pnpm run next clean

# Rebuild
pnpm build
```

---

## 📊 Performance Optimization

### For Large Files
```typescript
// Process in chunks for PDFs > 50MB
const chunkSize = 50 * 1024 * 1024; // 50MB
const chunks = Math.ceil(file.size / chunkSize);

for (let i = 0; i < chunks; i++) {
  const start = i * chunkSize;
  const end = Math.min((i + 1) * chunkSize, file.size);
  const chunk = file.slice(start, end);
  // Process chunk
}
```

### Memory Management
```typescript
// Clear processing data after download
const handleDownload = () => {
  // Download logic...
  
  // Cleanup
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  setResult(null);
};
```

---

## 🔒 Security Best Practices

### File Validation
```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
  }
  if (!validMimeTypes.includes(file.type)) {
    return 'Invalid file type';
  }
  return null;
}
```

### User Input Sanitization
```typescript
// Always validate and sanitize filenames
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9._-]/gi, '_')
    .substring(0, 255);
};
```

---

## 📈 Monitoring & Analytics

### Track Tool Usage
```typescript
const trackToolUsage = (toolName: string, result: 'success' | 'error') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tool_conversion', {
      tool: toolName,
      result: result,
      timestamp: new Date().toISOString(),
    });
  }
};
```

### Monitor Errors
```typescript
const reportError = (toolName: string, error: Error) => {
  console.error(`[${toolName}] Error:`, error);
  // Send to error tracking service (Sentry, etc.)
};
```

---

## 🧪 Testing

### Unit Test Example
```typescript
import { mergePdfs } from '@/lib/pdf/mergePdf';

describe('mergePdfs', () => {
  it('should merge PDFs successfully', async () => {
    const files = [pdf1, pdf2];
    const result = await mergePdfs(files);
    expect(result).toBeInstanceOf(Blob);
  });

  it('should throw on empty array', async () => {
    expect(async () => {
      await mergePdfs([]);
    }).rejects.toThrow();
  });
});
```

---

## 📚 Environment Variables

Create `.env.local`:
```env
# Base URL for SEO canonical tags
NEXT_PUBLIC_BASE_URL=https://resizelab.io

# AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=1234567890

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional API key for premium features
NEXT_PUBLIC_API_KEY=your_key_here
```

---

## 🚢 Deployment Checklist

- [ ] Update `.env.local` with production URLs
- [ ] Test all three tools on staging
- [ ] Verify OG images 
- [ ] Configure AdSense ads
- [ ] Setup Analytics
- [ ] Run `pnpm build` successfully
- [ ] Run security audit: `pnpm audit`
- [ ] Test on multiple browsers
- [ ] Test responsive design on mobile
- [ ] Verify SEO metadata
- [ ] Deploy to Vercel/hosting provider
- [ ] Monitor error rates post-launch
- [ ] Setup backup/disaster recovery

---

## 📞 Support

For questions or issues:
1. Check the error message in the browser console
2. Review the corresponding library documentation
3. Check TypeScript types for API signatures
4. Consult the main README.md

---

**Happy coding! 🎉**
