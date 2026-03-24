/**
 * PDF Tools Data Structure
 * 
 * This file defines all PDF tools available on the platform.
 * Each tool automatically gets a dynamic route and SEO page generated.
 * 
 * To add a new PDF tool:
 * 1. Add a new object to the `pdfTools` array
 * 2. Include id, name, slug, category, description, seoContent, and faqs
 * 3. The system will automatically generate:
 *    - Dynamic route: /pdf/[slug]
 *    - Sitemap entry
 *    - Category index page
 *    - SEO metadata
 * 
 * @example
 * {
 *   id: 'new-tool',
 *   name: 'New PDF Tool',
 *   slug: 'new-pdf-tool',
 *   category: 'PDF Utilities',
 *   description: 'Short description',
 *   seoContent: 'Long SEO content (400-800 words)',
 *   features: ['Feature 1', 'Feature 2'],
 *   faqs: [{question: '...', answer: '...'}]
 * }
 */

export interface PDFTool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string; // Short 1-2 sentence description
  seoContent: string; // 400-800 word SEO-friendly content
  features: string[]; // List of tool features
  maxFileSize: number; // Maximum file size in MB
  supportedFormats: string[]; // Supported file formats
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const pdfTools: PDFTool[] = [
  // PDF Utilities - merging, splitting, reordering
  {
    id: 'merge-pdf',
    name: 'Merge PDF Files',
    slug: 'merge-pdf',
    category: 'PDF Utilities',
    description: 'Combine multiple PDF files into one document instantly. Free, secure, and easy to use.',
    seoContent: `Merging PDF files is a common task for managing documents. Whether you're combining scanned pages, reports, or contracts, our free PDF merger makes it simple and fast. All processing happens in your browser - your files never leave your device.

The merge process is straightforward: upload your PDF files, arrange them in the desired order, and download the combined result. You can merge up to 20 PDF files at once, each up to 100MB in size.

Our PDF merger supports standard PDF files but does not work with password-protected or encrypted PDF documents. The merged PDF maintains the quality and structure of the original documents.

Why use our PDF merger? First, it's completely free with no hidden charges or subscriptions. Second, your privacy is protected since all merging happens locally in your browser. Third, there's no file size limit on the total merge operation, only individual file limits.

Common use cases include:
- Combining invoice sets for records
- Merging contract documents
- Putting together scanned document sets
- Organizing reports from multiple sources
- Creating presentation document packages

The process takes just seconds for most files. Try our free PDF merger today to combine your documents instantly.`,
    features: [
      'Merge up to 20 PDF files',
      'Drag-and-drop reordering',
      'Individual file up to 100MB',
      'No file size limits on total',
      'Secure browser-based processing',
      'Fast merge in seconds',
      'No registration required',
      'Free forever',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'How many PDF files can I merge at once?',
        answer: 'You can merge up to 20 PDF files in a single operation. Each file can be up to 100MB in size.',
      },
      {
        question: 'Can I reorder PDF files before merging?',
        answer: 'Yes! Our tool allows you to drag and drop files to reorder them before merging. The merged PDF will follow your specified order.',
      },
      {
        question: 'Is my data secure when using the PDF merger?',
        answer: 'Absolutely. All PDF merging happens entirely in your browser. Your files are never uploaded to our servers and are completely private.',
      },
      {
        question: 'Does the merged PDF lose quality?',
        answer: 'No. The merged PDF maintains the original quality and formatting of all input documents.',
      },
      {
        question: 'Can I merge password-protected PDFs?',
        answer: 'No. Our merger does not support password-protected or encrypted PDF files. You must unlock them first.',
      },
    ],
  },

  {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    slug: 'split-pdf',
    category: 'PDF Utilities',
    description: 'Extract specific pages or ranges from PDF files. Free and instantly accessible online.',
    seoContent: `Need to extract certain pages from a PDF? Our free PDF splitter lets you extract specific pages or ranges without losing quality. Process your files instantly in your browser without uploading to any server.

PDF splitting is useful for many scenarios:
- Extracting pages from a large document
- Separating different sections of a document
- Creating smaller files for easier sharing
- Selecting specific pages for printing
- Removing unwanted pages

Our PDF splitter works with files up to 100MB and supports standard (non-encrypted) PDF documents. You can extract individual pages or continuous ranges. The extracted pages are saved as a new PDF file.

The process is simple: upload your PDF, specify which pages to extract (e.g., pages 1-5, 10, 15-20), and download the resulting PDF. All processing happens securely in your browser with no servers involved.

Unlike our PDF merger, the splitter focuses on precision - you have full control over exactly which pages appear in your output file. This makes it perfect for documents where you only need specific sections.

Try our free PDF splitter to extract pages instantly with no registration or software required.`,
    features: [
      'Extract specific page ranges',
      'Remove individual pages',
      'Keep selected pages only',
      'Files up to 100MB',
      'Preserve original quality',
      'No registration needed',
      'Browser-based processing',
      'Free forever',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'Can I extract specific page ranges?',
        answer: 'Yes. You can enter page numbers or ranges like "1-5, 10, 15-20" to extract exactly the pages you need.',
      },
      {
        question: 'What happens to pages I do not extract?',
        answer: 'Pages not selected are removed from the output PDF. Only the pages you specify will be in the final file.',
      },
      {
        question: 'Does the split PDF maintain formatting?',
        answer: 'Yes. The extracted pages maintain all original formatting, images, and text styling.',
      },
    ],
  },

  {
    id: 'compress-pdf',
    name: 'Compress PDF File',
    slug: 'compress-pdf',
    category: 'PDF Utilities',
    description: 'Reduce PDF file size while maintaining quality. Free compression tool for faster sharing and storage.',
    seoContent: `Large PDF files are difficult to share and take up valuable storage space. Our free PDF compressor reduces file size while preserving quality and readability. Compress any PDF instantly in your browser - no uploads or server processing required.

PDF compression is essential for:
- Emailing large documents with size restrictions
- Reducing storage space on your device or cloud
- Faster file downloads and sharing
- Preparing files for online submission
- Backup and archival purposes

Our compression algorithm intelligently reduces file size by optimizing images, removing redundant data, and streamlining the PDF structure. Most PDFs can be reduced by 30-70% depending on content.

The compression process maintains text quality and preserves all important document elements. You choose your compression level - from light compression (better quality, larger file) to aggressive compression (smaller file, slight quality loss).

Unlike other tools, our PDF compressor processes everything in your browser. Your files remain private and are never uploaded to any server. The entire operation completes in seconds.

Upload any standard PDF to compress it instantly. Try our free PDF compressor today.`,
    features: [
      'Reduce file size 30-70%',
      'Three compression levels',
      'Maintain document quality',
      'Files up to 100MB',
      'Preserve all text and images',
      'No account needed',
      'Browser-based compression',
      'Instant results',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'How much can I compress my PDF?',
        answer: 'File reduction depends on content. Most PDFs compress by 30-70%. Image-heavy PDFs compress more than text-heavy ones.',
      },
      {
        question: 'Will compression affect text quality?',
        answer: 'No. Text remains crisp and readable. Only images and vector graphics are slightly compressed.',
      },
      {
        question: 'What compression level should I choose?',
        answer: 'Use "light" for professional documents where quality matters most. Use "aggressive" to minimize file size.',
      },
    ],
  },

  // Image Conversion Tools
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'Image Conversion',
    description: 'Convert JPG, PNG, and other images to PDF format. Batch convert multiple images instantly.',
    seoContent: `Converting images to PDF is a quick way to combine photos or scanned documents into a single file. Our free JPG to PDF converter supports multiple image formats including JPG, PNG, GIF, WebP, and more.

Why convert images to PDF?
- Create photo albums or slide shows
- Combine scanned documents into one file
- Share multiple images as a single file
- Archive photos in PDF format
- Prepare images for printing

Our converter automatically scales images to standard page sizes. You can upload individual images or batch convert up to 20 images at once. The tool intelligently arranges images on pages and maintains aspect ratios.

The process is simple: upload your images, arrange them in your preferred order, and download the resulting PDF. All processing happens securely in your browser - your images never leave your device.

Supported image formats include:
- JPG and JPEG
- PNG with transparency
- GIF animations
- WebP format
- BMP format

Each image can be up to 50MB in size. The converter produces standard PDF files compatible with all PDF readers and applications.

Try our free JPG to PDF converter now to combine your images into a professional PDF document.`,
    features: [
      'Convert JPG, PNG, GIF, WebP',
      'Batch convert up to 20 images',
      'Drag-to-reorder images',
      'Auto-scale to page size',
      'Maintain image quality',
      'Standard PDF output',
      'No registration required',
      'Free forever',
    ],
    maxFileSize: 50,
    supportedFormats: ['JPG', 'PNG', 'GIF', 'WebP', 'BMP'],
    faqs: [
      {
        question: 'What image formats are supported?',
        answer: 'We support JPG, PNG, GIF, WebP, and BMP formats. Each image can be up to 50MB.',
      },
      {
        question: 'How many images can I convert?',
        answer: 'You can convert up to 20 images at once in a single PDF document.',
      },
      {
        question: 'Can I reorder images before creating the PDF?',
        answer: 'Yes. You can drag and drop images to reorder them. The PDF will be created in your specified order.',
      },
    ],
  },

  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    category: 'Image Conversion',
    description: 'Extract pages from PDF as JPG images. Download individual pages or all at once.',
    seoContent: `Need to convert PDF pages to image files? Our free PDF to JPG converter lets you extract PDF pages as high-quality JPG images. Download individual pages or batch download all pages from your PDF.

PDF to JPG conversion is useful for:
- Extracting images from PDF documents
- Converting PDF pages to shareable image format
- Creating presentations from PDF documents
- Saving PDF pages for editing in image software
- Sharing specific PDF pages without the whole document

Our converter extracts each PDF page as a separate, high-quality JPG image. You control the output quality - from compressed (smaller files) to high-quality (best appearance).

The process is straightforward: upload a PDF file, choose your desired quality level, and download images individually or all at once. All processing happens in your browser with no server uploads.

Quality settings include:
- Low quality for small file sizes
- Medium quality for balanced file size and appearance
- High quality for maximum detail and clarity

Supported input formats include all standard PDF files. Non-standard or heavily encrypted PDFs may not work. Maximum file size is 100MB.

Extract images from your PDF instantly with our free converter. No registration, software installation, or hidden charges.`,
    features: [
      'Extract all PDF pages',
      'Save as JPG images',
      'Three quality levels',
      'Download individual pages',
      'Batch download all pages',
      'Files up to 100MB',
      'Secure browser processing',
      'Instant extraction',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'How many pages can I extract?',
        answer: 'You can extract all pages from your PDF. There is no limit on page count.',
      },
      {
        question: 'What quality settings are available?',
        answer: 'Choose from low (small files), medium (balanced), or high quality (best appearance).',
      },
      {
        question: 'Can I download individual pages?',
        answer: 'Yes. Download specific pages individually or batch download all pages as a ZIP file.',
      },
    ],
  },

  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    slug: 'pdf-to-word',
    category: 'Image Conversion',
    description: 'Convert PDF documents to editable Word (DOCX) format. Preserve formatting and edit content.',
    seoContent: `Need to edit PDF content? Our free PDF to Word converter transforms your PDF documents into editable Microsoft Word files. Preserve original formatting, text, and images while enabling full editing capability.

PDF to Word conversion is essential for:
- Editing PDF documents in Word
- Reusing content from PDF files
- Converting forms to editable documents
- Combining PDF content with other documents
- Improving accessibility of PDF documents

Unlike simple conversion tools, our converter maintains original document structure, fonts, and layout. Text remains editable, images are preserved, and formatting is protected.

The process is simple: upload your PDF, wait for conversion, and download the Word file. All conversion happens securely in your browser - your documents remain private.

Conversion features include:
- Text preservation with original formatting
- Image extraction and placement
- Table structure recognition and conversion
- Multi-page document support
- Support for standard PDF files

Note: Complex PDFs with special elements may require minor formatting adjustments after conversion. Scanned PDFs (image-based) cannot be converted - they require OCR technology.

Compatible with Microsoft Word 2010 and later versions, plus LibreOffice and other word processors supporting DOCX format.

Try our free PDF to Word converter to make your PDFs editable.`,
    features: [
      'Convert PDF to DOCX format',
      'Preserve original formatting',
      'Editable text and images',
      'Multi-page support',
      'Table recognition',
      'Font preservation',
      'No software required',
      'Instant conversion',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'Will the formatting be preserved?',
        answer: 'Yes. Our converter maintains original fonts, colors, spacing, and layout in the Word document.',
      },
      {
        question: 'Can I convert scanned PDFs?',
        answer: 'Scanned (image-based) PDFs cannot be converted without OCR technology. Standard PDFs work perfectly.',
      },
      {
        question: 'What Word version does the DOCX work with?',
        answer: 'DOCX files work with Microsoft Word 2010 and later, plus LibreOffice and other compatible applications.',
      },
    ],
  },

  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    slug: 'pdf-to-excel',
    category: 'Image Conversion',
    description: 'Convert PDF tables to editable Excel spreadsheets. Extract data from PDFs instantly.',
    seoContent: `Extract data from PDFs into Excel spreadsheets with our free PDF to Excel converter. Perfect for converting financial reports, data tables, and structured documents into editable spreadsheet format.

PDF to Excel conversion is perfect for:
- Converting financial reports to spreadsheets
- Extracting data tables for analysis
- Creating editable versions of data documents
- Combining multiple PDFs into one spreadsheet
- Preparing data for further processing

Our converter intelligently detects tables in PDFs and converts them to proper Excel format with correct columns and rows. Data remains editable and sortable in Excel.

The conversion process is straightforward: upload your PDF, select which tables to convert, and download the Excel file. Processing happens securely in your browser with no server uploads.

Supported features:
- Automatic table detection
- Column and row structure preservation
- Data formatting conversion
- Multi-table PDF support
- Large file handling

Limitations: Scanned PDFs (image-based) cannot be converted without OCR. Complex nested tables may require manual adjustment. Maximum file size is 100MB.

Excel files are compatible with Microsoft Excel, Google Sheets, LibreOffice Calc, and other spreadsheet applications.

Convert your PDF data to Excel instantly with our free converter.`,
    features: [
      'Extract PDF tables to Excel',
      'Automatic table detection',
      'Preserve data formatting',
      'Editable spreadsheet output',
      'Multi-table support',
      'Files up to 100MB',
      'Browser-based conversion',
      'No registration needed',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'Can the converter detect tables automatically?',
        answer: 'Yes. Our tool automatically identifies and extracts tables from PDFs into Excel format.',
      },
      {
        question: 'How many tables can I convert?',
        answer: 'You can convert multiple tables from a single PDF into separate sheets or one sheet.',
      },
      {
        question: 'Will formulas be converted?',
        answer: 'Formulas in the PDF are converted as values. You can add formulas in Excel after conversion.',
      },
    ],
  },

  // PDF Editing Tools
  {
    id: 'add-watermark',
    name: 'Add Watermark to PDF',
    slug: 'add-watermark',
    category: 'PDF Editing',
    description: 'Add text watermarks to PDF pages. Protect documents and add branding.',
    seoContent: `Protect your PDF documents with watermarks. Our free PDF watermark tool lets you add text, images, or branding to PDF pages. Watermarks appear behind or over document text to identify ownership or prevent unauthorized use.

Why add watermarks to PDFs?
- Protect intellectual property
- Add company branding
- Mark documents as "CONFIDENTIAL" or "DRAFT"
- Prevent unauthorized reproduction
- Add copyright information

Our watermark tool offers flexibility:
- Add text watermarks with custom text
- Customize opacity and rotation
- Choose watermark position
- Apply to all pages or specific pages
- Preserve original document quality

The process is simple: upload a PDF, customize your watermark, and download the watermarked version. All processing happens in your browser - documents remain private.

Watermark options include:
- Text customization
- Font and size selection
- Opacity control (transparent to opaque)
- Rotation angles
- Position control

The watermarked PDF is fully editable and compatible with all PDF readers. Watermarks can be removed by users with PDF editing software, so they're for identification rather than protection.

Try our free PDF watermark tool to add branding and protection to your documents.`,
    features: [
      'Add text watermarks',
      'Custom text input',
      'Opacity adjustment',
      'Position control',
      'Apply to all or selected pages',
      'Preserve document quality',
      'Fast processing',
      'No registration required',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'Can I customize the watermark text?',
        answer: 'Yes. You can enter any text, adjust size, opacity, and rotation angle.',
      },
      {
        question: 'Can I apply watermark to only some pages?',
        answer: 'Yes. You can apply watermarks to specific page ranges in your PDF.',
      },
      {
        question: 'Is the watermark permanent?',
        answer: 'Watermarks are part of the document but can be removed with PDF editing software. They\'re for identification, not encryption.',
      },
    ],
  },

  {
    id: 'remove-watermark',
    name: 'Remove Watermark from PDF',
    slug: 'remove-watermark',
    category: 'PDF Editing',
    description: 'Remove watermarks, logos, and overlays from PDF documents.',
    seoContent: `Need to remove watermarks from PDF documents? Our free PDF watermark removal tool helps you clean up PDFs by removing decorative overlays and text. Perfect for documents you own but need to clean up.

When to remove watermarks:
- Clean up personal documents
- Remove draft watermarks from final versions
- Prepare documents for reuse
- Remove preview watermarks
- Restore document appearance

Our removal tool works on various watermark types:
- Text watermarks
- Logo overlays
- Page numbers
- Background watermarks
- Decorative elements

The removal process depends on watermark type and PDF quality. Simple text watermarks are easier to remove than complex graphics. All processing happens in your browser.

Note: This tool removes visible overlays only. It cannot remove encryption or security features. We recommend using this tool only on documents you own or have permission to modify.

Removal works best on:
- Text watermarks
- Simple overlays
- Background text
- Draft markings

May be limited for:
- Embedded graphics
- Complex logos
- Encrypted documents

Try our free watermark remover to clean up your PDFs.`,
    features: [
      'Remove text watermarks',
      'Remove logos and overlays',
      'Clean background elements',
      'Restore document appearance',
      'Batch processing',
      'Files up to 100MB',
      'Preserve document content',
      'Fast processing',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'What types of watermarks can be removed?',
        answer: 'Text watermarks and simple overlays work best. Complex graphics may not be fully removable.',
      },
      {
        question: 'Will content quality be affected?',
        answer: 'Quality should remain the same. The tool only removes overlay elements.',
      },
      {
        question: 'Can I remove security watermarks?',
        answer: 'No. Security-based watermarks and encryption cannot be removed with this tool.',
      },
    ],
  },

  // Document Tools
  {
    id: 'pdf-to-text',
    name: 'Extract Text from PDF',
    slug: 'pdf-to-text',
    category: 'Document Tools',
    description: 'Extract all text content from PDF files as plain text. Copy and reuse PDF text easily.',
    seoContent: `Extract text from PDF documents instantly with our free text extraction tool. Get all text content from your PDF as plain, editable text that you can copy, edit, and reuse.

Why extract text from PDFs?
- Copy text for editing or reuse
- Extract quotes or references
- Access text from scanned documents (with OCR)
- Convert PDF data to plain text
- Create searchable text archives

Our extraction tool:
- Extracts all text efficiently
- Preserves text order and formatting
- Removes page breaks and watermarks
- Supports large documents
- Fast and reliable extraction

The process is simple: upload your PDF, wait for extraction, and download or copy the text. All extraction happens in your browser - your documents are private.

Supported features:
- Full-text extraction
- Page-by-page extraction
- OCR for scanned PDFs (if available)
- Clean text output
- Special character handling

The extracted text is plain, unformatted text - perfect for:
- Text editors and word processors
- Code editors and development tools
- Data analysis and processing
- Search and indexing
- Content reuse

Note: Scanned PDF extraction requires OCR technology. Standard PDFs extract instantly.

Try our free text extractor to get content from your PDFs.`,
    features: [
      'Extract all text content',
      'Maintain text order',
      'Support for large PDFs',
      'Page-by-page extraction',
      'Clean output formatting',
      'No registration needed',
      'Fast extraction',
      '100% free',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'Can I extract text from scanned PDFs?',
        answer: 'Standard scanned PDFs extract as images. OCR technology is needed for scanned document text extraction.',
      },
      {
        question: 'Is formatting preserved?',
        answer: 'Basic text is extracted with line breaks. Detailed formatting (fonts, colors) is not included in plain text output.',
      },
      {
        question: 'How large can PDFs be?',
        answer: 'PDFs up to 100MB can be processed. Larger files may take longer to extract.',
      },
    ],
  },

  {
    id: 'organize-pdf',
    name: 'Organize PDF Pages',
    slug: 'organize-pdf',
    category: 'Document Tools',
    description: 'Reorder, rotate, and rearrange PDF pages. Organize documents easily.',
    seoContent: `Organize your PDF documents by reordering, rotating, and rearranging pages. Our free PDF organization tool lets you restructure documents exactly as needed without complex software.

Common organization tasks:
- Reorder pages in the correct sequence
- Rotate incorrectly oriented pages
- Remove blank or duplicate pages
- Combine pages from multiple documents
- Create custom document layouts

Our tool provides complete control:
- Drag and drop page reordering
- 90-degree page rotation
- Delete unwanted pages
- Duplicate pages when needed
- Preview changes before saving

The process is intuitive: upload your PDF, arrange pages visually, and download the reorganized document. All editing happens in your browser.

Supported operations:
- Full page reordering
- Multi-page selection
- Page rotation (90, 180, 270 degrees)
- Page deletion
- Page duplication
- Batch operations

The reorganized PDF maintains original quality and compatibility. Features like links and form fields are preserved where possible.

Perfect for:
- Scanned document organization
- Combining documents
- Fixing page order errors
- Removing unnecessary content
- Preparing documents for printing

Try our free PDF organizer to restructure your documents perfectly.`,
    features: [
      'Drag-to-reorder pages',
      'Rotate pages 90-360 degrees',
      'Delete unwanted pages',
      'Duplicate pages',
      'Visual page preview',
      'Batch operations',
      'Preserve document quality',
      'Instant reorganization',
    ],
    maxFileSize: 100,
    supportedFormats: ['PDF'],
    faqs: [
      {
        question: 'Can I rotate pages?',
        answer: 'Yes. You can rotate pages 90, 180, or 270 degrees individually or in batches.',
      },
      {
        question: 'How do I reorder pages?',
        answer: 'Simply drag and drop pages in the visual editor to reorder them. Changes are reflected immediately.',
      },
      {
        question: 'Can I delete pages?',
        answer: 'Yes. Select pages and delete them. The remaining pages are automatically renumbered.',
      },
    ],
  },
];
