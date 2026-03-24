'use client';

import React from 'react';
import { mergePdfs } from '@/lib/pdf/mergePdf';
import { FileUpload } from '@/components/tools/FileUpload';
import { FilePreviewList, FileItem } from '@/components/tools/FilePreviewList';
import { ProcessingState } from '@/components/tools/ProcessingState';
import { DownloadResult } from '@/components/tools/DownloadResult';
import { ErrorState } from '@/components/tools/ErrorState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

function generateId(): string {
  return crypto.randomUUID();
}

export default function MergePdfPage() {
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

  const handleMergePdfs = async () => {
    if (uploadedFiles.length < 2) {
      setError({
        title: 'Not enough files',
        message: 'Please select at least 2 PDF files to merge',
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const files = uploadedFiles.map((f) => (f as any).file);
      const result = await mergePdfs(files);

      const url = URL.createObjectURL(result);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `merged-${timestamp}.pdf`;

      setDownloadData({
        url,
        name: fileName,
        size: result.size,
      });

      setUploadedFiles([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to merge PDFs';
      setError({
        title: 'Merge failed',
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewMerge = () => {
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
        <span className="text-foreground">Merge PDF</span>
      </nav>

      {/* Header */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Merge PDF Files</h1>
        <p className="text-lg text-muted-foreground">
          Combine multiple PDF files into a single document. Fast, secure, and completely free.
        </p>
      </section>

      {/* Main Tool */}
      {!downloadData ? (
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            {/* Upload */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Step 1: Upload PDF Files</h2>
              <FileUpload
                onFileSelect={handleFilesSelected}
                accept=".pdf"
                multiple={true}
                maxFiles={20}
                placeholder="Drag and drop PDF files here or click to browse"
                isLoading={isProcessing}
              />
            </div>

            <Separator />

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Step 2: Arrange Files (Optional)</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag files to reorder them. They will be merged in this order.
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
                onRetry={handleMergePdfs}
              />
            )}

            {/* Processing */}
            <ProcessingState
              isProcessing={isProcessing}
              message="Merging your PDF files..."
              subMessage={`Processing ${uploadedFiles.length} files`}
            />

            {/* Merge Button */}
            {uploadedFiles.length >= 2 && !isProcessing && (
              <Button
                onClick={handleMergePdfs}
                size="lg"
                className="w-full"
              >
                Merge PDFs
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
          onNew={handleNewMerge}
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
              How many PDF files can I merge?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              You can merge up to 20 PDF files at once. Each file can be up to 100MB in size for optimal performance.
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
              Can I rearrange the files before merging?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              Absolutely! After uploading your files, you can drag and drop them to reorder before merging. Just grab a file from the list and drag it to a new position.
            </p>
          </details>
        </Card>

        <Card className="p-6">
          <details className="group cursor-pointer">
            <summary className="font-semibold flex items-center gap-2 hover:text-primary transition-colors">
              <span className="inline-block group-open:rotate-90 transition-transform">
                ▶
              </span>
              What formats are supported?
            </summary>
            <p className="mt-3 text-muted-foreground ml-6">
              We support standard PDF files (.pdf). Make sure your PDFs are not password-protected, as encrypted PDFs cannot be merged.
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
              Yes! Our PDF merge tool is completely free. There are no hidden charges, subscriptions, or premium features. Merge as many PDFs as you need.
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
        <h2 className="text-2xl font-bold mb-4">About PDF Merging</h2>
        <p className="text-muted-foreground mb-4">
          Merging PDF files is a common task in document management. Whether you're combining invoices, contracts, reports, or scanned documents, our free merge tool makes the process simple and straightforward.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Why Use Our PDF Merger?</h3>
        <ul className="text-muted-foreground space-y-2 ml-4">
          <li className="list-disc">✓ Fast and efficient merging process</li>
          <li className="list-disc">✓ No file size limits (except individual 100MB per file)</li>
          <li className="list-disc">✓ No registration or software installation required</li>
          <li className="list-disc">✓ Complete privacy - files never leave your browser</li>
          <li className="list-disc">✓ Supports up to 20 files per merge</li>
          <li className="list-disc">✓ Drag-and-drop reordering for custom arrangements</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">How to Use Our PDF Merger</h3>
        <ol className="text-muted-foreground space-y-2 ml-4">
          <li className="list-decimal">1. Click the upload area to select PDF files or drag and drop them</li>
          <li className="list-decimal">2. Add multiple PDF files (up to 20 at a time)</li>
          <li className="list-decimal">3. Optionally drag files to reorder them</li>
          <li className="list-decimal">4. Click the 'Merge PDFs' button to combine your files</li>
          <li className="list-decimal">5. Download your merged PDF file instantly</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDF File Requirements</h3>
        <p className="text-muted-foreground">
          Ensure your PDF files meet these requirements for successful merging:
        </p>
        <ul className="text-muted-foreground space-y-2 ml-4">
          <li className="list-disc">Maximum file size: 100MB per PDF file</li>
          <li className="list-disc">File format: Standard PDF (.pdf)</li>
          <li className="list-disc">Not password-protected or encrypted</li>
          <li className="list-disc">Not corrupted or damaged</li>
        </ul>
      </section>

      {/* Related Tools CTA */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">More PDF Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <a
            href="/pdf/pdf-to-jpg"
            className="p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              PDF to JPG
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Extract images from PDF files
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
