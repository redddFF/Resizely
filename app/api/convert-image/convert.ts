/**
 * Image Format Conversion API Route
 * 
 * Endpoint: POST /api/convert-image/convert
 * 
 * Accepts:
 * - file: Image file (JPEG, PNG, WebP, GIF)
 * - format: Target format (jpeg, png, webp)
 * - quality: Quality setting (1-100, default: 80)
 * 
 * Returns:
 * - Converted image file in target format for download
 * 
 * Examples:
 * - Convert PNG to JPEG: format=jpeg, quality=85
 * - Convert JPEG to WebP: format=webp, quality=80
 */

import { NextRequest } from 'next/server';
import sharp from 'sharp';
import {
  validateFile,
  saveUploadedFile,
  cleanupTempFile,
  errorResponse,
  createDownloadResponse,
  generateFilename,
} from '@/utils/fileHelpers';

type TargetFormat = 'jpeg' | 'png' | 'webp';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // Validate file
    const { file, error: validationError } = await validateFile(request, 'image');
    if (validationError || !file) {
      return errorResponse(validationError || 'No file provided');
    }

    // Get conversion parameters
    const formData = await request.formData();
    const format = (formData.get('format') as string || 'webp').toLowerCase();
    const quality = formData.get('quality') ? Number(formData.get('quality')) : 80;

    // Validate format
    const validFormats: TargetFormat[] = ['jpeg', 'png', 'webp'];
    if (!validFormats.includes(format as TargetFormat)) {
      return errorResponse(`Invalid format. Supported formats: ${validFormats.join(', ')}`);
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

      // Get metadata to preserve orientation
      const metadata = await pipeline.metadata();

      // Auto-rotate based on EXIF data
      pipeline = pipeline.rotate();

      // Apply format conversion
      let convertedBuffer: Buffer;
      let outputMimeType: string;

      switch (format as TargetFormat) {
        case 'jpeg':
          convertedBuffer = await pipeline
            .jpeg({
              quality,
              progressive: true,
              mozjpeg: true,
            })
            .toBuffer();
          outputMimeType = 'image/jpeg';
          break;

        case 'png':
          convertedBuffer = await pipeline
            .png({
              compressionLevel: 9,
              quality: Math.round((quality / 100) * 100),
            })
            .toBuffer();
          outputMimeType = 'image/png';
          break;

        case 'webp':
          convertedBuffer = await pipeline
            .webp({
              quality,
            })
            .toBuffer();
          outputMimeType = 'image/webp';
          break;

        default:
          return errorResponse('Unsupported format');
      }

      // Generate output filename
      const outputFilename = generateFilename(`converted-${format}`, format);

      // Return file for download
      return createDownloadResponse(convertedBuffer, outputFilename, outputMimeType);
    } catch (processingError) {
      console.error('Image conversion error:', processingError);
      return errorResponse(
        `Failed to convert image: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`,
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
