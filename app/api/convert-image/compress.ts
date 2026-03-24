/**
 * Image Compress API Route
 * 
 * Endpoint: POST /api/convert-image/compress
 * 
 * Accepts:
 * - file: Image file (JPEG, PNG, WebP)
 * - quality: Compression quality (1-100, default: 80)
 * - maxWidth: Maximum width (optional)
 * - maxHeight: Maximum height (optional)
 * 
 * Returns:
 * - Compressed image file for download
 * 
 * Examples:
 * - Compress to 60% quality: quality=60
 * - Compress and downscale: quality=75, maxWidth=1920, maxHeight=1080
 */

import { NextRequest } from 'next/server';
import sharp from 'sharp';
import {
  validateFile,
  saveUploadedFile,
  cleanupTempFile,
  errorResponse,
  createDownloadResponse,
  validateCompressionParams,
  generateFilename,
  getExtensionFromMIME,
} from '@/utils/fileHelpers';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // Validate file
    const { file, error: validationError } = await validateFile(request, 'image');
    if (validationError || !file) {
      return errorResponse(validationError || 'No file provided');
    }

    // Get compression parameters
    const formData = await request.formData();
    const quality = formData.get('quality') ? Number(formData.get('quality')) : 80;
    const maxWidth = formData.get('maxWidth') ? Number(formData.get('maxWidth')) : undefined;
    const maxHeight = formData.get('maxHeight') ? Number(formData.get('maxHeight')) : undefined;

    // Validate compression parameters
    const paramCheck = validateCompressionParams(file.size);
    if (!paramCheck.valid) {
      return errorResponse(paramCheck.error || 'Invalid parameters');
    }

    // Validate quality
    if (quality < 1 || quality > 100) {
      return errorResponse('Quality must be between 1 and 100');
    }

    // Save uploaded file temporarily
    tempFilePath = await saveUploadedFile(file);
    if (!tempFilePath) {
      return errorResponse('Failed to process uploaded file', 500);
    }

    try {
      // Process image with sharp
      let pipeline = sharp(tempFilePath);

      // Get metadata
      const metadata = await pipeline.metadata();
      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;

      // Apply downscaling if max dimensions provided
      if (maxWidth || maxHeight) {
        pipeline = pipeline.resize(maxWidth || originalWidth, maxHeight || originalHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Apply compression based on file type
      const mimeType = file.type;
      let compressedBuffer: Buffer;

      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        compressedBuffer = await pipeline
          .jpeg({
            quality,
            progressive: true,
            mozjpeg: true, // Use mozjpeg for better compression
          })
          .toBuffer();
      } else if (mimeType === 'image/png') {
        // For PNG, use aggressive compression
        compressedBuffer = await pipeline
          .png({
            compressionLevel: Math.round((quality / 100) * 9), // 0-9 compression level
            quality: Math.round((quality / 100) * 100),
          })
          .toBuffer();
      } else if (mimeType === 'image/webp') {
        compressedBuffer = await pipeline.webp({ quality }).toBuffer();
      } else {
        compressedBuffer = await pipeline.toBuffer();
      }

      // Calculate compression ratio
      const originalSize = file.size;
      const compressedSize = compressedBuffer.length;
      const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

      // Generate output filename
      const extension = getExtensionFromMIME(mimeType);
      const outputFilename = generateFilename(`compressed-${compressionRatio}percent`, extension);

      // Return file for download with metadata headers
      const response = createDownloadResponse(compressedBuffer, outputFilename, mimeType);
      response.headers.set('X-Original-Size', String(originalSize));
      response.headers.set('X-Compressed-Size', String(compressedSize));
      response.headers.set('X-Compression-Ratio', `${compressionRatio}%`);

      return response;
    } catch (processingError) {
      console.error('Image compression error:', processingError);
      return errorResponse(
        `Failed to compress image: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`,
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
