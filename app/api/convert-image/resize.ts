/**
 * Image Resize API Route
 * 
 * Endpoint: POST /api/convert-image/resize
 * 
 * Accepts:
 * - file: Image file (JPEG, PNG, WebP)
 * - width: Target width in pixels
 * - height: Target height in pixels
 * - fit: Resize fit mode (cover, contain, fill, inside, outside)
 * 
 * Returns:
 * - Resized image file for download
 * 
 * Examples:
 * - Resize to exact dimensions: width=1920, height=1080, fit=cover
 * - Resize with aspect ratio: width=800, height=600, fit=inside
 */

import { NextRequest } from 'next/server';
import sharp from 'sharp';
import {
  validateFile,
  saveUploadedFile,
  cleanupTempFile,
  errorResponse,
  createDownloadResponse,
  validateImageDimensions,
  generateFilename,
  getExtensionFromMIME,
} from '@/utils/fileHelpers';

type FitMode = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Validate file
    const { file, error: validationError } = await validateFile(request, 'image');
    if (validationError || !file) {
      return errorResponse(validationError || 'No file provided');
    }

    // Get resize parameters from form data
    const formData = await request.formData();
    const width = formData.get('width') ? Number(formData.get('width')) : undefined;
    const height = formData.get('height') ? Number(formData.get('height')) : undefined;
    const fit = (formData.get('fit') as string) || 'inside';
    const quality = formData.get('quality') ? Number(formData.get('quality')) : 80;

    // Validate parameters
    if (!width && !height) {
      return errorResponse('Either width or height must be provided');
    }

    if (width && width < 1) {
      return errorResponse('Width must be greater than 0');
    }

    if (height && height < 1) {
      return errorResponse('Height must be greater than 0');
    }

    // Save uploaded file temporarily
    tempFilePath = await saveUploadedFile(file);
    if (!tempFilePath) {
      return errorResponse('Failed to process uploaded file', 500);
    }

    try {
      // Read and process image with sharp
      let pipeline = sharp(tempFilePath);

      // Get image metadata to validate dimensions
      const metadata = await pipeline.metadata();
      const currentWidth = metadata.width || 0;
      const currentHeight = metadata.height || 0;

      // Validate dimensions
      const dimensionCheck = validateImageDimensions(currentWidth, currentHeight, width, height);
      if (!dimensionCheck.valid) {
        return errorResponse(dimensionCheck.error || 'Invalid dimensions');
      }

      // Apply resize transformation
      pipeline = pipeline.resize(width, height, {
        fit: fit as FitMode,
        withoutEnlargement: true, // Don't upscale if original is smaller
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background for transparency
      });

      // Determine output format and apply quality settings
      const mimeType = file.type;
      let resizedBuffer: Buffer;

      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        resizedBuffer = await pipeline.jpeg({ quality, progressive: true }).toBuffer();
      } else if (mimeType === 'image/png') {
        resizedBuffer = await pipeline.png({ quality }).toBuffer();
      } else if (mimeType === 'image/webp') {
        resizedBuffer = await pipeline.webp({ quality }).toBuffer();
      } else {
        resizedBuffer = await pipeline.toBuffer();
      }

      // Generate output filename
      const extension = getExtensionFromMIME(mimeType);
      const outputFilename = generateFilename('resized', extension);

      // Return file for download
      return createDownloadResponse(resizedBuffer, outputFilename, mimeType);
    } catch (processingError) {
      console.error('Image processing error:', processingError);
      return errorResponse(
        `Failed to resize image: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`,
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
