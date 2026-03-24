/**
 * PDF Merge API Route
 * 
 * Endpoint: POST /api/convert-pdf/merge
 * 
 * Accepts:
 * - files: Multiple PDF files (multipart form data)
 * - order: Comma-separated list of file indices for ordering (optional)
 * 
 * Returns:
 * - Merged PDF file for download
 * 
 * Examples:
 * - Merge 3 PDFs in order: files=[pdf1, pdf2, pdf3]
 * - Merge with custom order: files=[pdf1, pdf2], order=1,0 (reverses order)
 * 
 * Limitations:
 * - Maximum 10 files per request
 * - Maximum 500MB total size
 */

import { NextRequest } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import {
  errorResponse,
  createDownloadResponse,
  generateFilename,
  MAX_FILE_SIZES,
  ALLOWED_TYPES,
  saveUploadedFile,
  cleanupTempFile,
} from '@/utils/fileHelpers';
import { readFile } from 'fs/promises';

const MAX_MERGE_FILES = 10;
const MAX_MERGE_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request: NextRequest) {
  const tempFiles: (string | null)[] = [];

  try {
    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    // Validate file count
    if (!files || files.length === 0) {
      return errorResponse('No files provided');
    }

    if (files.length > MAX_MERGE_FILES) {
      return errorResponse(`Maximum ${MAX_MERGE_FILES} files allowed per merge`);
    }

    // Validate total size
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
    }

    if (totalSize > MAX_MERGE_SIZE) {
      return errorResponse(
        `Total file size exceeds ${MAX_MERGE_SIZE / (1024 * 1024)}MB limit`
      );
    }

    // Save and validate all files
    const pdfBuffers: Buffer[] = [];
    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.PDF.includes(file.type)) {
        return errorResponse(`Invalid file type: ${file.name}. Only PDF files allowed.`);
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZES.PDF) {
        return errorResponse(
          `File ${file.name} exceeds maximum size of ${MAX_FILE_SIZES.PDF / (1024 * 1024)}MB`
        );
      }

      // Save file temporarily
      const tempPath = await saveUploadedFile(file);
      tempFiles.push(tempPath);

      if (!tempPath) {
        return errorResponse(`Failed to process file: ${file.name}`, 500);
      }

      // Read file content
      const buffer = await readFile(tempPath);
      pdfBuffers.push(buffer);
    }

    // Get ordering if provided
    const orderStr = formData.get('order');
    let order: number[] = Array.from({ length: files.length }, (_, i) => i);

    if (orderStr && typeof orderStr === 'string') {
      try {
        order = orderStr
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n) && n >= 0 && n < files.length);

        if (order.length !== files.length) {
          return errorResponse('Invalid order: must contain all file indices');
        }
      } catch {
        return errorResponse('Invalid order format');
      }
    }

    try {
      // Create new PDF document
      const mergedPdf = await PDFDocument.create();

      // Copy pages from each PDF in specified order
      for (const fileIndex of order) {
        try {
          const sourcePdf = await PDFDocument.load(pdfBuffers[fileIndex]);
          const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (error) {
          console.error(`Error processing file ${fileIndex}:`, error);
          return errorResponse(
            `Failed to process PDF file: ${files[fileIndex].name}`,
            500
          );
        }
      }

      // Save merged PDF
      const mergedBuffer = await mergedPdf.save();

      // Generate filename
      const outputFilename = generateFilename(`merged-${files.length}-pdfs`, 'pdf');

      // Return merged file
      return createDownloadResponse(
        Buffer.from(mergedBuffer),
        outputFilename,
        'application/pdf'
      );
    } catch (mergeError) {
      console.error('PDF merge error:', mergeError);
      return errorResponse(
        `Failed to merge PDFs: ${mergeError instanceof Error ? mergeError.message : 'Unknown error'}`,
        500
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return errorResponse('Internal server error', 500);
  } finally {
    // Clean up temporary files
    for (const tempFile of tempFiles) {
      await cleanupTempFile(tempFile);
    }
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
