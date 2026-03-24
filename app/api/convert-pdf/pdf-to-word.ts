/**
 * PDF to Word Conversion API Route
 *
 * Endpoint: POST /api/convert-pdf/pdf-to-word
 *
 * This implementation extracts text content from the PDF and generates
 * a DOCX document. It preserves page boundaries and paragraph flow,
 * but does not preserve advanced visual layout.
 */

import { NextRequest } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { PDFParse } from 'pdf-parse';
import {
  validateFile,
  errorResponse,
  createDownloadResponse,
  generateFilename,
} from '@/utils/fileHelpers';

export async function POST(request: NextRequest) {
  try {
    const { file, error: validationError } = await validateFile(request, 'pdf');
    if (validationError || !file) {
      return errorResponse(validationError || 'No file provided');
    }

    const pdfBuffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: pdfBuffer });
    const extracted = await parser.getText();
    await parser.destroy();
    const text = (extracted?.text || '').replace(/\r\n/g, '\n').trim();
    const children: Paragraph[] = [];

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun('Converted from PDF')],
      })
    );

    if (!text) {
      children.push(
        new Paragraph({
          children: [new TextRun('[No extractable text found in this PDF]')],
        })
      );
    } else {
      const blocks: string[] = text
        .split(/\n{2,}/)
        .map((block: string) => block.trim())
        .filter(Boolean);

      blocks.forEach((block: string) => {
        children.push(
          new Paragraph({
            children: [new TextRun(block)],
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    return createDownloadResponse(
      docxBuffer,
      generateFilename(file.name.replace(/\.pdf$/i, '') || 'converted', 'docx'),
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    return errorResponse(
      `Failed to convert PDF to Word: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
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
