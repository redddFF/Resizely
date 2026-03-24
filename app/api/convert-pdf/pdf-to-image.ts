/**
 * PDF to Image Conversion API Route
 * 
 * Endpoint: POST /api/convert-pdf/pdf-to-image
 * 
 * Accepts:
 * - file: PDF file
 * - format: Output format (png, jpeg, webp, default: png)
 * - quality: Image quality (1-100, default: 80)
 * - page: Page number to convert (default: 1, use * for all pages)
 * - dpi: Resolution in DPI (default: 150, range: 72-300)
 * 
 * Returns:
 * - Image file(s) for download
 * - For single page: returns image directly
 * - For all pages: returns ZIP file with images
 * 
 * Note: Uses pdf-lib for page count and sharp for rendering
 */

import { NextRequest } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import JSZip from 'jszip';
import {
  validateFile,
  errorResponse,
  createDownloadResponse,
  generateFilename,
} from '@/utils/fileHelpers';

type ImageFormat = 'png' | 'jpeg' | 'webp';

export async function POST(request: NextRequest) {
  try {
    // Validate file
    const { file, error: validationError, formData } = await validateFile(request, 'pdf');
    if (validationError || !file) {
      return errorResponse(validationError || 'No file provided');
    }

    if (!formData) {
      return errorResponse('Invalid form data');
    }

    // Get conversion parameters
    const format = (formData.get('format') as string || 'png').toLowerCase();
    const quality = formData.get('quality') ? Number(formData.get('quality')) : 80;
    const pageParam = (formData.get('page') as string | null) || '1';
    const dpi = formData.get('dpi') ? Number(formData.get('dpi')) : 150;
    const allPages = pageParam === '*' || pageParam.toLowerCase() === 'all';
    const page = allPages ? -1 : Number(pageParam);

    // Validate parameters
    if (!['png', 'jpeg', 'webp'].includes(format)) {
      return errorResponse('Supported formats: png, jpeg, webp');
    }

    if (quality < 1 || quality > 100) {
      return errorResponse('Quality must be between 1 and 100');
    }

    if (dpi < 72 || dpi > 300) {
      return errorResponse('DPI must be between 72 and 300');
    }

    if (page !== -1 && page < 1) {
      return errorResponse('Page must be at least 1');
    }

    try {
      const pdfBuffer = Buffer.from(await file.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const totalPages = pdfDoc.getPageCount();

      if (!allPages && (isNaN(page) || page < 1 || page > totalPages)) {
        return errorResponse(`Page must be between 1 and ${totalPages}, or use '*' for all pages`);
      }

      const extension = format === 'jpeg' ? 'jpg' : format;

      const renderPageToImage = async (pageNumber: number) => {
        const pipeline = sharp(pdfBuffer, {
          density: dpi,
          page: pageNumber - 1,
          limitInputPixels: false,
          failOn: 'none',
        }).flatten({ background: '#ffffff' });

        if (format === 'png') {
          return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
        }

        if (format === 'jpeg') {
          return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
        }

        return pipeline.webp({ quality }).toBuffer();
      };

      if (allPages) {
        const zip = new JSZip();

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          const imageBuffer = await renderPageToImage(pageNumber);
          zip.file(`page-${pageNumber}.${extension}`, imageBuffer);
        }

        const zipBuffer = await zip.generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 },
        });

        return createDownloadResponse(
          zipBuffer,
          generateFilename('pdf-pages', 'zip'),
          'application/zip'
        );
      }

      const imageBuffer = await renderPageToImage(page);

      return createDownloadResponse(
        imageBuffer,
        generateFilename(`page-${page}`, extension),
        `image/${format}`
      );
    } catch (processingError) {
      console.error('PDF conversion error:', processingError);
      return errorResponse(
        `Failed to convert PDF: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`,
        500
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return errorResponse('Internal server error', 500);
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
