'use client';

/**
 * Image Tool Page Template
 * 
 * Dynamic page component for image conversion tools (resize, compress, convert)
 * Handles file upload, API calls, progress tracking, and downloads
 * 
 * Usage:
 * - Used by /tools/image/[slug] pages
 * - Accepts tool configuration from route params
 * - Manages file state and API communication
 */

import React, { useState, useCallback } from 'react';
import { FileUpload } from '@/components/tools/FileUpload';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Download, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageToolPageProps {
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
  toolType: 'resize' | 'compress' | 'convert';
  apiEndpoint: string;
  currentPath?: string;
  routeType?: 'image' | 'convert';
}

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  successMessage: string | null;
  resultFile: { name: string; url: string } | null;
}

export default function ImageToolPage({
  tool,
  toolType,
  apiEndpoint,
  currentPath,
  routeType = 'image',
}: ImageToolPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    error: null,
    successMessage: null,
    resultFile: null,
  });

  // Tool-specific parameters
  const [toolParams, setToolParams] = useState({
    // Resize params
    width: 1920,
    height: 1080,
    fit: 'inside',

    // Compress params
    quality: 80,
    maxWidth: undefined,
    maxHeight: undefined,

    // Convert params
    format: 'webp',
  });

  // Handle file selection
  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setProcessingState((prev) => ({
        ...prev,
        error: null,
        successMessage: null,
        resultFile: null,
      }));
    }
  }, []);

  // Process image
  const handleProcess = async () => {
    if (!selectedFile) {
      setProcessingState((prev) => ({
        ...prev,
        error: 'Please select a file first',
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
      formData.append('file', selectedFile);

      // Add tool-specific parameters
      if (toolType === 'resize') {
        formData.append('width', String(toolParams.width));
        formData.append('height', String(toolParams.height));
        formData.append('fit', toolParams.fit);
      } else if (toolType === 'compress') {
        formData.append('quality', String(toolParams.quality));
        if (toolParams.maxWidth) {
          formData.append('maxWidth', String(toolParams.maxWidth));
        }
        if (toolParams.maxHeight) {
          formData.append('maxHeight', String(toolParams.maxHeight));
        }
      } else if (toolType === 'convert') {
        formData.append('format', toolParams.format);
        formData.append('quality', String(toolParams.quality));
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
          const filename = `${toolType}-output-${Date.now()}`;

          setProcessingState({
            isProcessing: false,
            progress: 100,
            error: null,
            successMessage: `Successfully ${toolType}ed image!`,
            resultFile: { name: filename, url },
          });
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            setProcessingState((prev) => ({
              ...prev,
              isProcessing: false,
              error: error.error || 'Failed to process image',
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
      routeType={routeType}
      relatedTools={[]}
      actionHref={currentPath}
      actionLabel="Open Converter"
    >
      {/* Tool Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          {/* File Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*"
                multiple={false}
                placeholder="Select an image to process"
              />

              {selectedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Selected:</span> {selectedFile.name}
                    {' '}
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
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
              {toolType === 'resize' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Width (px)</label>
                      <input
                        type="number"
                        value={toolParams.width}
                        onChange={(e) =>
                          setToolParams((prev) => ({
                            ...prev,
                            width: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Height (px)</label>
                      <input
                        type="number"
                        value={toolParams.height}
                        onChange={(e) =>
                          setToolParams((prev) => ({
                            ...prev,
                            height: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {toolType === 'compress' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quality ({toolParams.quality}%)
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
                </div>
              )}

              {toolType === 'convert' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <select
                      value={toolParams.format}
                      onChange={(e) =>
                        setToolParams((prev) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Process Button */}
          <Button
            onClick={handleProcess}
            disabled={!selectedFile || processingState.isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {processingState.isProcessing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Processing... ({processingState.progress}%)
              </>
            ) : (
              <>Process Image</>
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
                  Download File
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}
