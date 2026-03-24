/**
 * Merge multiple PDF files into a single PDF
 * Uses pdf-lib for browser-based processing
 * 
 * Installation: npm install pdf-lib
 */

import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(files: File[]): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('No PDF files provided');
  }

  if (files.length === 1) {
    throw new Error('Please select at least 2 PDF files to merge');
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      for (let i = 0; i < pageCount; i++) {
        const [copiedPage] = await mergedPdf.copyPages(pdf, [i]);
        mergedPdf.addPage(copiedPage);
      }
    }

    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to merge PDFs: ${error.message}`);
    }
    throw new Error('Failed to merge PDFs due to an unknown error');
  }
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
