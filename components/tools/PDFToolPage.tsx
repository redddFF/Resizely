'use client';

/**
 * PDF Tool Page Template
 * 
 * Dynamic page component for PDF conversion tools (merge, split)
 * Handles file uploads, API calls, progress tracking, and downloads
 * 
 * Usage:
 * - Used by /tools/pdf/[slug] pages
 * - Accepts tool configuration from route params
 * - Manages file state and API communication
 */

import React, { useState, useCallback } from 'react';
import { FileUpload } from '@/components/tools/FileUpload';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Download, Loader, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PDFToolPageProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    description: string;
    seoContent: string;
    category: string;
    features?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  };
  toolType: 'merge' | 'split' | 'pdfToImage' | 'pdfToWord';
  apiEndpoint: string;
}

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  successMessage: string | null;
  resultFile: { name: string; url: string } | null;
}

export default function PDFToolPage({
  tool,
  toolType,
  apiEndpoint,
}: PDFToolPageProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    error: null,
    successMessage: null,
    resultFile: null,
  });

  // Tool-specific parameters
  const [toolParams, setToolParams] = useState({
    // Merge params
    order: '', // comma-separated indices

    // Split params
    pages: '', // "1-3" or "1,3,5"

    // PDF to image params
    format: 'png',
    quality: 85,
    page: '1',
    dpi: 150,
  });

  // Handle file selection
  const handleFileSelect = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setProcessingState((prev) => ({
      ...prev,
      error: null,
      successMessage: null,
      resultFile: null,
    }));
  }, []);

  // Remove file from list
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Process PDF
  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      setProcessingState((prev) => ({
        ...prev,
        error: 'Please select at least one file',
      }));
      return;
    }

    if (toolType === 'merge' && selectedFiles.length < 2) {
      setProcessingState((prev) => ({
        ...prev,
        error: 'Select at least 2 PDFs to merge',
      }));
      return;
    }

    if (toolType === 'split' && !toolParams.pages.trim()) {
      setProcessingState((prev) => ({
        ...prev,
        error: 'Specify pages to extract (e.g., "1-3" or "1,3,5")',
      }));
      return;
    }

    setProcessingState({
      isProcessing: true,
      progress: 0,
      error: null,
      successMessage: null,
      resultFile: null,
    });

    try {
      const formData = new FormData();

      if (toolType === 'merge') {
        // Add all files for merge
        selectedFiles.forEach((file, index) => {
          formData.append('files', file);
        });

        // Add optional order parameter
        if (toolParams.order.trim()) {
          formData.append('order', toolParams.order);
        }
      } else if (toolType === 'split') {
        // Add single file for split
        formData.append('file', selectedFiles[0]);
        formData.append('pages', toolParams.pages);
      } else if (toolType === 'pdfToImage') {
        formData.append('file', selectedFiles[0]);
        formData.append('format', toolParams.format);
        formData.append('quality', String(toolParams.quality));
        formData.append('page', toolParams.page.trim() || '1');
        formData.append('dpi', String(toolParams.dpi));
      } else if (toolType === 'pdfToWord') {
        formData.append('file', selectedFiles[0]);
      }

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setProcessingState((prev) => ({ ...prev, progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // Create blob URL for download
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);

          const getFilenameFromContentDisposition = (headerValue: string | null) => {
            if (!headerValue) return null;
            const match = headerValue.match(/filename="?([^";]+)"?/i);
            return match ? match[1] : null;
          };

          const headerFilename = getFilenameFromContentDisposition(
            xhr.getResponseHeader('Content-Disposition')
          );

          const fallbackFilename =
            toolType === 'merge' || toolType === 'split'
              ? `${toolType}-output-${Date.now()}.pdf`
              : toolType === 'pdfToWord'
                ? `pdf-to-word-${Date.now()}.docx`
                : toolParams.page === '*' || toolParams.page.toLowerCase() === 'all'
                  ? `pdf-to-image-${Date.now()}.zip`
                  : `pdf-page-${toolParams.page || '1'}-${Date.now()}.${toolParams.format === 'jpeg' ? 'jpg' : toolParams.format}`;

          const filename = headerFilename || fallbackFilename;

          setProcessingState({
            isProcessing: false,
            progress: 100,
            error: null,
            successMessage:
              toolType === 'merge'
                ? 'Successfully merged PDF files!'
                : toolType === 'split'
                  ? 'Successfully split PDF pages!'
                  : toolType === 'pdfToImage'
                    ? 'Successfully converted PDF to image!'
                    : 'Successfully converted PDF to Word!',
            resultFile: { name: filename, url },
          });
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            setProcessingState((prev) => ({
              ...prev,
              isProcessing: false,
              error: error.error || 'Failed to process PDF',
            }));
          } catch {
            setProcessingState((prev) => ({
              ...prev,
              isProcessing: false,
              error: `Error: ${xhr.status} ${xhr.statusText}`,
            }));
          }
        }
      });

      xhr.addEventListener('error', () => {
        setProcessingState((prev) => ({
          ...prev,
          isProcessing: false,
          error: 'Network error. Please try again.',
        }));
      });

      xhr.responseType = 'blob';
      xhr.open('POST', apiEndpoint);
      xhr.send(formData);
    } catch (error) {
      setProcessingState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  // Download result
  const handleDownload = () => {
    if (processingState.resultFile) {
      const link = document.createElement('a');
      link.href = processingState.resultFile.url;
      link.download = processingState.resultFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      routeType="pdf"
      relatedTools={[]}
    >
      {/* Tool Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          {/* File Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {toolType === 'merge'
                  ? 'Upload PDFs to Merge'
                  : toolType === 'split'
                    ? 'Upload PDF to Split'
                    : toolType === 'pdfToImage'
                      ? 'Upload PDF to Convert'
                      : 'Upload PDF to Convert'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="application/pdf"
                multiple={toolType === 'merge'}
                placeholder={
                  toolType === 'merge'
                    ? 'Select multiple PDFs to merge'
                    : toolType === 'split'
                      ? 'Select a PDF to split'
                      : toolType === 'pdfToImage'
                        ? 'Select a PDF to convert into image(s)'
                        : 'Select a PDF to convert into Word'
                }
              />

              {/* File List */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {toolType === 'merge' && (
                        <div className="flex items-center gap-2 mx-3">
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-slate-400 hover:text-red-600 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tool-Specific Parameters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {toolType === 'merge' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Custom Order (Optional)
                    </label>
                    <input
                      type="text"
                      value={toolParams.order}
                      onChange={(e) =>
                        setToolParams((prev) => ({
                          ...prev,
                          order: e.target.value,
                        }))
                      }
                      placeholder="e.g., 2,1,3 to reorder files"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Leave empty to merge in selected order. Use comma-separated indices to reorder.
                    </p>
                  </div>
                </div>
              )}

              {toolType === 'split' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pages to Extract
                    </label>
                    <input
                      type="text"
                      value={toolParams.pages}
                      onChange={(e) =>
                        setToolParams((prev) => ({
                          ...prev,
                          pages: e.target.value,
                        }))
                      }
                      placeholder="e.g., 1-3 or 1,3,5"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Use ranges (1-3) or individual pages (1,3,5). Both formats supported.
                    </p>
                  </div>
                </div>
              )}

              {toolType === 'pdfToImage' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Output Format</label>
                      <select
                        value={toolParams.format}
                        onChange={(e) =>
                          setToolParams((prev) => ({
                            ...prev,
                            format: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Page</label>
                      <input
                        type="text"
                        value={toolParams.page}
                        onChange={(e) =>
                          setToolParams((prev) => ({
                            ...prev,
                            page: e.target.value,
                          }))
                        }
                        placeholder="1 or * for all pages"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quality ({toolParams.quality})
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={toolParams.quality}
                        onChange={(e) =>
                          setToolParams((prev) => ({
                            ...prev,
                            quality: Number(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        DPI ({toolParams.dpi})
                      </label>
                      <input
                        type="range"
                        min="72"
                        max="300"
                        value={toolParams.dpi}
                        onChange={(e) =>
                          setToolParams((prev) => ({
                            ...prev,
                            dpi: Number(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Use page <span className="font-semibold">*</span> to convert all pages (download as ZIP).
                  </p>
                </div>
              )}

              {toolType === 'pdfToWord' && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    Converts extractable text from the PDF into an editable DOCX file.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Process Button */}
          <Button
            onClick={handleProcess}
            disabled={
              selectedFiles.length === 0 ||
              processingState.isProcessing ||
              (toolType === 'merge' && selectedFiles.length < 2) ||
              (toolType === 'split' && !toolParams.pages.trim())
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {processingState.isProcessing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Processing... ({processingState.progress}%)
              </>
            ) : (
              <>
                {toolType === 'merge'
                  ? 'Merge PDFs'
                  : toolType === 'split'
                    ? 'Split PDF'
                    : toolType === 'pdfToImage'
                      ? 'Convert PDF to Image'
                      : 'Convert PDF to Word'}
              </>
            )}
          </Button>
        </div>

        {/* Status Panel */}
        <div className="md:col-span-1">
          {/* Error Alert */}
          {processingState.error && (
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {processingState.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {processingState.successMessage && (
            <Alert className="border-green-200 bg-green-50 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {processingState.successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Download Button */}
          {processingState.resultFile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Download</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}
