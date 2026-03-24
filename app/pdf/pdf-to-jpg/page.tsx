'use client';

import React from 'react';
import { pdfToJpgs } from '@/lib/pdf/pdfToJpg';
import { FileUpload } from '@/components/tools/FileUpload';
import { ProcessingState } from '@/components/tools/ProcessingState';
import { ErrorState } from '@/components/tools/ErrorState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

function generateId(): string {
  return crypto.randomUUID();
}

interface ConvertedImage {
  id: string;
  dataUrl: string;
  pageNumber: number;
  width: number;
  height: number;
  blob?: Blob;
}

export default function PdfToJpgPage() {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [convertedImages, setConvertedImages] = React.useState<ConvertedImage[]>([]);
  const [error, setError] = React.useState<{ title?: string; message: string; details?: string } | null>(null);
  const [quality, setQuality] = React.useState(2); // 1 = low quality, 2 = medium, 3 = high quality
  const [downloadingPage, setDownloadingPage] = React.useState<number | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setError(null);
      setUploadedFile(files[0]);
    }
  };

  const handleConvertPdf = async () => {
    if (!uploadedFile) {
      setError({
        title: 'No file selected',
        message: 'Please select a PDF file to convert',
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await pdfToJpgs(uploadedFile, quality);
      const imagesWithIds = result.map((img) => ({
        ...img,
        id: generateId(),
      }));
      setConvertedImages(imagesWithIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert PDF to images';
      setError({
        title: 'Conversion failed',
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadImage = async (image: ConvertedImage) => {
    setDownloadingPage(image.pageNumber);
    try {
      const link = document.createElement('a');
      link.href = image.dataUrl;
      link.download = `page-${image.pageNumber}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError({
        title: 'Download failed',
        message: 'Failed to download the image',
      });
    } finally {
      setDownloadingPage(null);
    }
  };

  const handleDownloadAll = async () => {
    if (convertedImages.length === 0) return;

    // Download all images one after another
    for (const image of convertedImages) {
      await new Promise((resolve) => {
        const link = document.createElement('a');
        link.href = image.dataUrl;
        link.download = `page-${image.pageNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small delay between downloads
        setTimeout(resolve, 500);
      });
    }
  };

  const handleNewConversion = () => {
    setUploadedFile(null);
    setConvertedImages([]);
    setError(null);
    setQuality(2);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <a href="/" className="hover:text-foreground transition-colors">
          Home
        </a>
        <span>/</span>
        <span className="text-foreground">PDF to JPG</span>
      </nav>

      {/* Header */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">PDF to JPG Converter</h1>
        <p className="text-lg text-muted-foreground">
          Extract images from PDF files. Fast, secure, and completely free.
        </p>
      </section>

      {/* Main Tool */}
      {convertedImages.length === 0 ? (
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            {/* Upload */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Step 1: Upload PDF</h2>
              <FileUpload
                onFileSelect={handleFileSelected}
                accept=".pdf"
                multiple={false}
                placeholder="Drag and drop a PDF here or click to browse"
                isLoading={isProcessing}
              />
            </div>

            {uploadedFile && (
              <>
                <Separator />

                {/* Quality Setting */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Step 2: Choose Image Quality</h2>
                  <Card className="p-4 bg-muted/50">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Quality: {quality === 1 ? 'Low' : quality === 2 ? 'Medium' : 'High'}</label>
                        <Slider
                          value={[quality]}
                          onValueChange={(value) => setQuality(value[0])}
                          min={1}
                          max={3}
                          step={1}
                          disabled={isProcessing}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {quality === 1 ? 'Faster processing, smaller file sizes' : quality === 2 ? 'Balanced quality and performance' : 'Best quality, larger file sizes'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Separator />
              </>
            )}

            {/* Error */}
            {error && (
              <ErrorState
                isVisible={true}
                title={error.title}
                message={error.message}
                details={error.details}
                onDismiss={() => setError(null)}
                onRetry={handleConvertPdf}
              />
            )}

            {/* Processing */}
            <ProcessingState
              isProcessing={isProcessing}
              message="Converting PDF to images..."
              subMessage="This may take a few moments"
            />

            {/* Convert Button */}
            {uploadedFile && !isProcessing && (
              <Button
                onClick={handleConvertPdf}
                size="lg"
                className="w-full"
              >
                Convert to JPG
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground mb-1">Conversion Complete!</h2>
                <p className="text-sm text-muted-foreground">
                  {convertedImages.length} page{convertedImages.length !== 1 ? 's' : ''} extracted from your PDF
                </p>
              </div>
              <Button
                onClick={handleDownloadAll}
                size="lg"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download All ({convertedImages.length})
              </Button>
            </div>
          </Card>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {convertedImages.map((image) => (
              <Card key={image.id} className="p-4 space-y-3">
                <div className="relative aspect-video bg-muted rounded overflow-hidden">
                  <img
                    src={image.dataUrl}
                    alt={`Page ${image.pageNumber}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium">Page {image.pageNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {image.width} × {image.height}px
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDownloadImage(image)}
                    disabled={downloadingPage === image.pageNumber}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {downloadingPage === image.pageNumber ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <Card className="p-4 bg-muted/50">
            <Button
              onClick={handleNewConversion}
              variant="outline"
              className="w-full"
            >
              Convert Another PDF
            </Button>
          </Card>
        </div>
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
              How does the quality setting work?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              The quality setting controls the scale (DPI) at which pages are extracted. Low quality is faster and creates smaller files, medium quality is balanced, and high quality produces the best-looking images with larger file sizes.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              Can I extract specific pages?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Currently, all pages from the PDF are extracted as images. You can then download individual pages or all of them at once.
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
              Yes! All PDF processing happens directly in your browser. We don't upload, store, or process your files on our servers. Your files are completely private and secure.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              What is the maximum PDF file size?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Each PDF can be up to 100MB. Processing speed depends on the number of pages and your computer's capabilities.
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
              Yes! Our PDF to JPG converter is completely free. There are no hidden charges, subscriptions, or premium features.
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
        <h2 className="text-2xl font-bold mb-4">Extract Images from PDF</h2>
        <p className="text-muted-foreground mb-4">
          Converting PDF pages to JPG images allows you to extract, edit, share, and view PDF content as standard image files. Whether you need to extract a single page or an entire document, our free PDF to JPG converter handles it all.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Why Convert PDF to JPG?</h3>
        <ul className="text-muted-foreground space-y-2 ml-4">
          <li className="list-disc">✓ Extract pages as individual image files</li>
          <li className="list-disc">✓ Edit PDF content in image editors</li>
          <li className="list-disc">✓ Share pages without sharing the entire PDF</li>
          <li className="list-disc">✓ Upload pages to image platforms</li>
          <li className="list-disc">✓ Create thumbnails and previews</li>
          <li className="list-disc">✓ Compatible with all image viewers and editors</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">How to Use Our Converter</h3>
        <ol className="text-muted-foreground space-y-2 ml-4">
          <li className="list-decimal">1. Click the upload area to select a PDF or drag it in</li>
          <li className="list-decimal">2. Choose your desired image quality (low, medium, or high)</li>
          <li className="list-decimal">3. Click 'Convert to JPG' to start the conversion</li>
          <li className="list-decimal">4. Download individual pages or all images at once</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDF Requirements</h3>
        <p className="text-muted-foreground">
          Ensure your PDF file meets these requirements for successful conversion:
        </p>
        <ul className="text-muted-foreground space-y-2 ml-4">
          <li className="list-disc">Maximum file size: 100MB per PDF</li>
          <li className="list-disc">File format: Standard PDF (.pdf)</li>
          <li className="list-disc">Not corrupted or damaged</li>
          <li className="list-disc">Note: Password-protected PDFs cannot be converted</li>
        </ul>
      </section>

      {/* Related Tools CTA */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">More PDF Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/pdf/merge"
            className="p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              Merge PDF
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Combine multiple PDF files into one
            </p>
          </a>
          <a
            href="/pdf/jpg-to-pdf"
            className="p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              JPG to PDF
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Convert images to PDF files
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
