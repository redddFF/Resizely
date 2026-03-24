'use client';

import React from 'react';
import { imagesToPdf } from '@/lib/pdf/jpgToPdf';
import { FileUpload } from '@/components/tools/FileUpload';
import { FilePreviewList, FileItem } from '@/components/tools/FilePreviewList';
import { ProcessingState } from '@/components/tools/ProcessingState';
import { DownloadResult } from '@/components/tools/DownloadResult';
import { ErrorState } from '@/components/tools/ErrorState';
import { InternalLinksSections } from '@/components/tools/InternalLinksSections';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

function generateId(): string {
  return crypto.randomUUID();
}

export default function JpgToPdfPage() {
  const [uploadedFiles, setUploadedFiles] = React.useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [downloadData, setDownloadData] = React.useState<{
    url: string;
    name: string;
    size: number;
  } | null>(null);
  const [error, setError] = React.useState<{ title?: string; message: string; details?: string } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    const newFiles = files.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      timestamp: Date.now(),
      file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleReorderFiles = (reorderedFiles: FileItem[]) => {
    setUploadedFiles(reorderedFiles);
  };

  const handleConvertToPdf = async () => {
    if (uploadedFiles.length === 0) {
      setError({
        title: 'No files selected',
        message: 'Please select at least one image file to convert',
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const files = uploadedFiles.map((f) => (f as any).file);
      const result = await imagesToPdf(files);

      const url = URL.createObjectURL(result);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `images-to-pdf-${timestamp}.pdf`;

      setDownloadData({
        url,
        name: fileName,
        size: result.size,
      });

      setUploadedFiles([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert images to PDF';
      setError({
        title: 'Conversion failed',
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewConversion = () => {
    setDownloadData(null);
    setUploadedFiles([]);
    if (downloadData?.url) {
      URL.revokeObjectURL(downloadData.url);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <a href="/" className="hover:text-foreground transition-colors">
          Home
        </a>
        <span>/</span>
        <span className="text-foreground">JPG to PDF</span>
      </nav>

      {/* Header */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">JPG to PDF Converter</h1>
        <p className="text-lg text-muted-foreground">
          Convert your images to PDF format. Fast, secure, and completely free.
        </p>
      </section>

      {/* Main Tool */}
      {!downloadData ? (
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            {/* Upload */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Step 1: Upload Images</h2>
              <FileUpload
                onFileSelect={handleFilesSelected}
                accept=".jpg,.jpeg,.png,.gif,.webp"
                multiple={true}
                maxFiles={20}
                placeholder="Drag and drop images here or click to browse"
                isLoading={isProcessing}
              />
            </div>

            <Separator />

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Step 2: Arrange Images (Optional)</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag images to reorder them. They will appear in this order in your PDF.
                </p>
                <FilePreviewList
                  files={uploadedFiles}
                  onRemove={handleRemoveFile}
                  onReorder={handleReorderFiles}
                  canReorder={true}
                  isLoading={isProcessing}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <ErrorState
                isVisible={true}
                title={error.title}
                message={error.message}
                details={error.details}
                onDismiss={() => setError(null)}
                onRetry={handleConvertToPdf}
              />
            )}

            {/* Processing */}
            <ProcessingState
              isProcessing={isProcessing}
              message="Converting images to PDF..."
              subMessage={`Processing ${uploadedFiles.length} image${uploadedFiles.length !== 1 ? 's' : ''}`}
            />

            {/* Convert Button */}
            {uploadedFiles.length > 0 && !isProcessing && (
              <Button
                onClick={handleConvertToPdf}
                size="lg"
                className="w-full"
              >
                Convert to PDF
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <DownloadResult
          isVisible={true}
          fileName={downloadData.name}
          fileSize={downloadData.size}
          downloadUrl={downloadData.url}
          fileType="PDF"
          onNew={handleNewConversion}
        />
      )}

      {/* FAQ Section */}
      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              What image formats are supported?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              We support JPG, JPEG, PNG, GIF, and WebP formats. All images will be converted to PDF format with proper scaling and positioning.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              Is my data secure?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Yes! All image processing happens directly in your browser. We don't upload, store, or process your files on our servers. Your files are completely private and secure.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              Can I convert multiple images at once?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Absolutely! You can convert up to 20 images at once. Each image will be placed on a separate page in the PDF with proper scaling.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              Are there any file size limits?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Each image can be up to 50MB. For optimal performance with multiple images, we recommend smaller file sizes.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              Is this tool free to use?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Yes! Our JPG to PDF converter is completely free. There are no hidden charges, subscriptions, or premium features.
            </p>
          </details>
        </Card>
      </section>

      {/* Ad Placeholder Middle */}
      <div className="my-12 h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        {/* AdSense Ad Unit */}
      </div>

      {/* Content Section */}
      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Convert Images to PDF</h2>
        <p className="text-muted-foreground mb-4">
          Converting images to PDF is a quick and easy way to combine multiple photos into a single document. Whether you're creating a photo album, document scan, or presentation, our free converter makes the process simple.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Why Convert Images to PDF?</h3>
        <ul className="text-muted-foreground space-y-2 ml-4">
          <li className="list-disc">✓ Combine multiple images into one document</li>
          <li className="list-disc">✓ Create professional-looking photo albums</li>
          <li className="list-disc">✓ Share images as a single PDF file</li>
          <li className="list-disc">✓ Archive and backup photos more efficiently</li>
          <li className="list-disc">✓ Compatible with all devices and systems</li>
          <li className="list-disc">✓ Easy to print and distribute</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">How to Use Our Converter</h3>
        <ol className="text-muted-foreground space-y-2 ml-4">
          <li className="list-decimal">1. Click the upload area to select images or drag and drop them</li>
          <li className="list-decimal">2. Add multiple images (up to 20 at a time)</li>
          <li className="list-decimal">3. Optionally drag images to reorder them</li>
          <li className="list-decimal">4. Click the 'Convert to PDF' button</li>
          <li className="list-decimal">5. Download your PDF file instantly</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">Image Requirements</h3>
        <p className="text-muted-foreground">
          Ensure your image files meet these requirements for successful conversion:
        </p>
        <ul className="text-muted-foreground space-y-2 ml-4">
          <li className="list-disc">Maximum file size: 50MB per image</li>
          <li className="list-disc">Supported formats: JPG, JPEG, PNG, GIF, WebP</li>
          <li className="list-disc">Images will be scaled to fit A4 page size</li>
          <li className="list-disc">Aspect ratio is maintained automatically</li>
        </ul>
      </section>

      <section className="mt-12 pt-8 border-t">
        <InternalLinksSections
          current={{
            slug: 'jpg-to-pdf',
            name: 'JPG to PDF',
            routeType: 'pdf',
            category: 'Image Conversion',
            href: '/pdf/jpg-to-pdf',
          }}
        />
      </section>
    </main>
  );
}
