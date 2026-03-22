/**
 * Image Processing Utilities using Canvas API
 * Handles image resize, compression, and download operations
 */

export interface ResizeOptions {
  width: number;
  height: number;
  quality?: number; // 0-100, default 85
}

export interface ProcessedImage {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob;
}

/**
 * Load image from File and return Image element
 */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image to specified dimensions
 */
export function resizeImage(
  img: HTMLImageElement,
  options: ResizeOptions
): ProcessedImage {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Set canvas dimensions
  canvas.width = options.width;
  canvas.height = options.height;
  
  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, options.width, options.height);
  
  // Calculate scaling to fit image in canvas while maintaining aspect ratio
  const imgAspectRatio = img.width / img.height;
  const canvasAspectRatio = options.width / options.height;
  
  let drawWidth: number;
  let drawHeight: number;
  let offsetX: number;
  let offsetY: number;
  
  if (imgAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas
    drawWidth = options.width;
    drawHeight = options.width / imgAspectRatio;
    offsetX = 0;
    offsetY = (options.height - drawHeight) / 2;
  } else {
    // Image is taller than canvas
    drawHeight = options.height;
    drawWidth = options.height * imgAspectRatio;
    offsetX = (options.width - drawWidth) / 2;
    offsetY = 0;
  }
  
  // Draw image on canvas
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  
  // Convert to blob
  const quality = options.quality ?? 85;
  const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
  
  // Create blob from canvas
  const blob = new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/jpeg', quality / 100);
  });
  
  return {
    canvas,
    dataUrl,
    blob: new Blob(), // Will be replaced after promise resolves
  };
}

/**
 * Resize image and return blob (async)
 */
export async function resizeImageAsync(
  img: HTMLImageElement,
  options: ResizeOptions
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Set canvas dimensions
  canvas.width = options.width;
  canvas.height = options.height;
  
  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, options.width, options.height);
  
  // Calculate scaling to fit image in canvas while maintaining aspect ratio
  const imgAspectRatio = img.width / img.height;
  const canvasAspectRatio = options.width / options.height;
  
  let drawWidth: number;
  let drawHeight: number;
  let offsetX: number;
  let offsetY: number;
  
  if (imgAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas
    drawWidth = options.width;
    drawHeight = options.width / imgAspectRatio;
    offsetX = 0;
    offsetY = (options.height - drawHeight) / 2;
  } else {
    // Image is taller than canvas
    drawHeight = options.height;
    drawWidth = options.height * imgAspectRatio;
    offsetX = (options.width - drawWidth) / 2;
    offsetY = 0;
  }
  
  // Draw image on canvas
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  
  // Get quality setting
  const quality = options.quality ?? 85;
  
  // Create blob from canvas
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/jpeg', quality / 100);
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get preview data URL from canvas
 */
export function getCanvasDataUrl(canvas: HTMLCanvasElement, quality: number = 85): string {
  return canvas.toDataURL('image/jpeg', quality / 100);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.',
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller image.`,
    };
  }
  
  return { valid: true };
}

/**
 * Format bytes to human readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get image dimensions
 */
export function getImageDimensions(img: HTMLImageElement): { width: number; height: number } {
  return {
    width: img.width,
    height: img.height,
  };
}
