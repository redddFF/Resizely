/**
 * File Helper Utilities
 * 
 * This file provides utility functions for:
 * - File validation (size, type)
 * - File processing helpers
 * - Error handling
 * - Response formatting
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  IMAGE: 50 * 1024 * 1024, // 50MB
  PDF: 100 * 1024 * 1024,  // 100MB
};

/**
 * Allowed MIME types
 */
export const ALLOWED_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  PDF: ['application/pdf'],
};

/**
 * Error response helper
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

/**
 * Success response helper
 */
export function successResponse(data: unknown, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Validate file from request
 */
export async function validateFile(
  request: NextRequest,
  type: 'image' | 'pdf'
): Promise<{ file: File | null; error: string | null; formData: FormData | null }> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Check if file exists
    if (!file) {
      return { file: null, error: 'No file provided', formData };
    }

    // Check file type
    const allowedTypes = type === 'image' ? ALLOWED_TYPES.IMAGE : ALLOWED_TYPES.PDF;
    if (!allowedTypes.includes(file.type)) {
      return { file: null, error: `Invalid file type. Supported: ${allowedTypes.join(', ')}`, formData };
    }

    // Check file size
    const maxSize = type === 'image' ? MAX_FILE_SIZES.IMAGE : MAX_FILE_SIZES.PDF;
    if (file.size > maxSize) {
      return {
        file: null,
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
        formData,
      };
    }

    return { file, error: null, formData };
  } catch (error) {
    return {
      file: null,
      error: `Error processing file: ${error instanceof Error ? error.message : String(error)}`,
      formData: null,
    };
  }
}

/**
 * Save uploaded file to temporary location
 */
export async function saveUploadedFile(file: File): Promise<string | null> {
  try {
    const buffer = await file.arrayBuffer();
    const tempPath = join(tmpdir(), `upload-${randomBytes(8).toString('hex')}-${file.name}`);
    await writeFile(tempPath, Buffer.from(buffer));
    return tempPath;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
}

/**
 * Clean up temporary file
 */
export async function cleanupTempFile(filePath: string | null): Promise<void> {
  if (!filePath) return;
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
}

/**
 * Generate safe filename with timestamp
 */
export function generateFilename(baseName: string, extension: string): string {
  const timestamp = Date.now();
  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${safeName}-${timestamp}.${extension}`;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMIME(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };
  return mimeMap[mimeType] || 'bin';
}

/**
 * Convert file buffer to base64 for API response
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Create download response
 */
export function createDownloadResponse(
  buffer: Buffer,
  filename: string,
  mimeType: string
): NextResponse {
  const response = new NextResponse(new Uint8Array(buffer));
  response.headers.set('Content-Type', mimeType);
  response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return response;
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  currentWidth: number,
  currentHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { valid: boolean; error?: string } {
  const MIN_DIMENSION = 1;
  const MAX_DIMENSION = 10000;

  if (currentWidth < MIN_DIMENSION || currentHeight < MIN_DIMENSION) {
    return { valid: false, error: 'Image dimensions must be at least 1x1' };
  }

  if (currentWidth > MAX_DIMENSION || currentHeight > MAX_DIMENSION) {
    return { valid: false, error: `Image dimensions cannot exceed ${MAX_DIMENSION}x${MAX_DIMENSION}` };
  }

  if (targetWidth && (targetWidth < MIN_DIMENSION || targetWidth > MAX_DIMENSION)) {
    return { valid: false, error: `Target width must be between ${MIN_DIMENSION} and ${MAX_DIMENSION}` };
  }

  if (targetHeight && (targetHeight < MIN_DIMENSION || targetHeight > MAX_DIMENSION)) {
    return { valid: false, error: `Target height must be between ${MIN_DIMENSION} and ${MAX_DIMENSION}` };
  }

  return { valid: true };
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Estimate compression quality (1-100) based on target file size
 */
export function estimateCompressionQuality(
  currentSize: number,
  targetSize: number
): number {
  if (targetSize >= currentSize) return 90; // Keep high quality if not much compression needed
  
  const ratio = targetSize / currentSize;
  
  // Map size ratio to quality
  if (ratio > 0.8) return 90;
  if (ratio > 0.6) return 80;
  if (ratio > 0.4) return 70;
  if (ratio > 0.2) return 60;
  return 50; // Minimum quality
}

/**
 * Validate compression parameters
 */
export function validateCompressionParams(
  currentSize: number,
  targetSize?: number,
  quality?: number
): { valid: boolean; error?: string } {
  if (targetSize && targetSize < 100 * 1024) {
    // Less than 100KB
    return { valid: false, error: 'Target size too small. Minimum is 100KB' };
  }

  if (quality && (quality < 10 || quality > 100)) {
    return { valid: false, error: 'Quality must be between 10 and 100' };
  }

  return { valid: true };
}

/**
 * Rate limiter for API calls (simple in-memory implementation)
 * For production, use Redis or similar
 */
const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const timestamps = rateLimitStore.get(identifier) || [];

  // Remove old timestamps
  const recentTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    const oldestTimestamp = Math.min(...recentTimestamps);
    const resetTime = oldestTimestamp + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }

  // Add current timestamp
  recentTimestamps.push(now);
  rateLimitStore.set(identifier, recentTimestamps);

  return {
    allowed: true,
    remaining: maxRequests - recentTimestamps.length,
    resetTime: now + windowMs,
  };
}

/**
 * Check if file can be processed (not corrupted)
 */
export function canProcessFile(file: File): boolean {
  // Basic check - file has name and size
  return file.name.length > 0 && file.size > 0;
}
