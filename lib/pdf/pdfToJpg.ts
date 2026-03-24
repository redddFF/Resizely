/**
 * Convert PDF pages to JPG images
 * Uses pdfjs-dist for browser-based processing
 * 
 * Installation: npm install pdfjs-dist
 */

import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for pdfjs
if (typeof window !== 'undefined') {
  try {
    // Prefer bundled worker so we are not dependent on CDN availability/version paths.
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    // Fallback to explicit HTTPS CDN path for environments where URL resolution fails.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
}

export interface PdfPageImage {
  dataUrl: string;
  pageNumber: number;
  width: number;
  height: number;
}

export async function pdfToJpgs(file: File, scale: number = 2): Promise<PdfPageImage[]> {
  if (!file) {
    throw new Error('No PDF file provided');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images: PdfPageImage[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to JPG
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      images.push({
        dataUrl,
        pageNumber: pageNum,
        width: viewport.width,
        height: viewport.height,
      });
    }

    return images;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert PDF to images: ${error.message}`);
    }
    throw new Error('Failed to convert PDF to images');
  }
}

export async function dataUrlToBlob(dataUrl: string, filename: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function validatePdfFile(file: File): Promise<{ valid: boolean; error?: string }> {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Please select a PDF file' };
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 100MB limit' };
  }

  return { valid: true };
}
