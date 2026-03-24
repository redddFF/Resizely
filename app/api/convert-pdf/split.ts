/**
 * PDF Split API Route
 * 
 * Endpoint: POST /api/convert-pdf/split
 * 
 * Accepts:
 * - file: PDF file
 * - pages: Page range to extract (e.g., "1-5" or "1" or "1,3,5")
 * 
 * Returns:
 * - If single page: extracted page as PDF
 * - If multiple pages: ZIP file containing extracted pages
 * 
 * Examples:
 * - Extract pages 1-5: pages=1-5
 * - Extract specific pages: pages=1,3,5,7
 * - Extract pages 5-10: pages=5-10
 */

import { NextRequest } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import {
  validateFile,
  saveUploadedFile,
  cleanupTempFile,
  errorResponse,
  createDownloadResponse,
  generateFilename,
} from '@/utils/fileHelpers';
import { readFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // Validate file
    const { file, error: validationError, formData } = await validateFile(request, 'pdf');
    if (validationError || !file) {
      return errorResponse(validationError || 'No file provided');
    }

    if (!formData) {
      return errorResponse('Invalid form data');
    }

    // Get split parameters
    const pagesParam = formData.get('pages') as string;

    if (!pagesParam) {
      return errorResponse('Pages parameter is required (e.g., "1-5" or "1,3,5")');
    }

    // Save uploaded file temporarily
    tempFilePath = await saveUploadedFile(file);
    if (!tempFilePath) {
      return errorResponse('Failed to process uploaded file', 500);
    }

    try {
      // Load PDF
      const pdfBuffer = await readFile(tempFilePath);
      const sourcePdf = await PDFDocument.load(pdfBuffer);
      const totalPages = sourcePdf.getPageCount();

      // Parse page specification
      let pageIndicesToExtract: number[] = [];

      if (pagesParam.includes('-')) {
        // Range format: "1-5"
        const [startStr, endStr] = pagesParam.split('-');
        const start = Number(startStr.trim());
        const end = Number(endStr.trim());

        if (isNaN(start) || isNaN(end)) {
          return errorResponse('Invalid page range format');
        }

        if (start < 1 || end > totalPages || start > end) {
          return errorResponse(
            `Valid page range is 1-${totalPages}. Got: ${start}-${end}`
          );
        }

        // Convert to 0-indexed
        for (let i = start - 1; i < end; i++) {
          pageIndicesToExtract.push(i);
        }
      } else {
        // Individual pages format: "1,3,5"
        const pageNumbers = pagesParam
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n));

        if (pageNumbers.length === 0) {
          return errorResponse('Invalid pages format');
        }

        for (const pageNum of pageNumbers) {
          if (pageNum < 1 || pageNum > totalPages) {
            return errorResponse(
              `Page ${pageNum} is out of range (1-${totalPages})`
            );
          }
          pageIndicesToExtract.push(pageNum - 1); // Convert to 0-indexed
        }

        // Remove duplicates and sort
        pageIndicesToExtract = [...new Set(pageIndicesToExtract)].sort((a, b) => a - b);
      }

      // Create new PDF with extracted pages
      const extractedPdf = await PDFDocument.create();
      const copiedPages = await extractedPdf.copyPages(
        sourcePdf,
        pageIndicesToExtract
      );
      copiedPages.forEach((page) => extractedPdf.addPage(page));

      // Save extracted PDF
      const extractedBuffer = await extractedPdf.save();

      // Generate filename
      const pageDescription =
        pageIndicesToExtract.length === 1
          ? `page-${pageIndicesToExtract[0] + 1}`
          : `pages-${pageIndicesToExtract.length}`;
      const outputFilename = generateFilename(`split-${pageDescription}`, 'pdf');

      // Return extracted PDF
      return createDownloadResponse(
        Buffer.from(extractedBuffer),
        outputFilename,
        'application/pdf'
      );
    } catch (processingError) {
      console.error('PDF split error:', processingError);
      
      if (processingError instanceof Error && processingError.message.includes('Invalid PDF')) {
        return errorResponse('Invalid PDF file', 400);
      }

      return errorResponse(
        `Failed to split PDF: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`,
        500
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return errorResponse('Internal server error', 500);
  } finally {
    // Clean up temporary file
    await cleanupTempFile(tempFilePath);
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  return new Response(null, { headers });
}
