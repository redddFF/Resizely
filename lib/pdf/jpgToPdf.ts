/**
 * Convert JPG/PNG images to PDF
 * Uses jsPDF for browser-based processing
 * 
 * Installation: npm install jspdf
 */

import jsPDF from 'jspdf';

export async function imagesToPdf(files: File[]): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('No image files provided');
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageData = await fileToBase64(file);

      if (i > 0) {
        pdf.addPage();
      }

      // Get image dimensions
      const img = new Image();
      img.src = imageData as string;

      await new Promise((resolve) => {
        img.onload = () => {
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;
          const ratio = imgWidth / imgHeight;

          let width = pageWidth - 10; // 5mm margin on each side
          let height = width / ratio;

          if (height > pageHeight - 10) {
            height = pageHeight - 10;
            width = height * ratio;
          }

          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;

          pdf.addImage(imageData, 'PNG', x, y, width, height);
          resolve(null);
        };
      });
    }

    const pdfBlob = pdf.output('blob');
    return pdfBlob as Blob;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert images to PDF: ${error.message}`);
    }
    throw new Error('Failed to convert images to PDF');
  }
}

async function fileToBase64(file: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string | ArrayBuffer);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function validateImageFile(file: File): Promise<{ valid: boolean; error?: string }> {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a JPG, PNG, GIF, or WebP image' };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size exceeds 50MB limit' };
  }

  return { valid: true };
}
