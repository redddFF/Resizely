'use client';

import React, { useState } from 'react';
import { UploadBox } from '@/components/image-resizer/UploadBox';
import { ImagePreview } from '@/components/image-resizer/ImagePreview';
import { ResizeControls } from '@/components/image-resizer/ResizeControls';
import { QualitySlider } from '@/components/image-resizer/QualitySlider';
import { DownloadButton } from '@/components/image-resizer/DownloadButton';
import { AdPlaceholder } from '@/components/image-resizer/AdPlaceholder';
import { FAQ } from '@/components/image-resizer/FAQ';
import { Breadcrumb } from '@/components/image-resizer/Breadcrumb';
import { InternalLinksSections } from '@/components/tools/InternalLinksSections';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link2, RotateCcw } from 'lucide-react';
import {
  loadImageFromFile,
  resizeImageAsync,
  validateImageFile,
} from '@/lib/imageProcessor';
import type { ImageFormat } from '@/lib/formats';

interface ResizeImagePageProps {
  format: ImageFormat;
  relatedFormats: ImageFormat[];
}

export function ResizeImagePage({
  format,
  relatedFormats,
}: ResizeImagePageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [width, setWidth] = useState(format.width);
  const [height, setHeight] = useState(format.height);
  const [quality, setQuality] = useState(85);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [blob, setBlob] = useState<Blob>(new Blob());
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleImageSelect = async (file: File) => {
    setError('');
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const img = await loadImageFromFile(file);
      const newBlob = await resizeImageAsync(img, {
        width,
        height,
        quality,
      });

      // Create preview URL
      const url = URL.createObjectURL(newBlob);
      setPreviewUrl(url);
      setBlob(newBlob);
    } catch (err) {
      setError('Failed to process image. Please try another file.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWidthChange = async (newWidth: number) => {
    setWidth(newWidth);
    if (selectedFile) {
      await updatePreview(newWidth, height);
    }
  };

  const handleHeightChange = async (newHeight: number) => {
    setHeight(newHeight);
    if (selectedFile) {
      await updatePreview(width, newHeight);
    }
  };

  const handleQualityChange = async (newQuality: number) => {
    setQuality(newQuality);
    if (selectedFile) {
      await updatePreview(width, height, newQuality);
    }
  };

  const updatePreview = async (w: number, h: number, q: number = quality) => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const img = await loadImageFromFile(selectedFile);
      const newBlob = await resizeImageAsync(img, {
        width: w,
        height: h,
        quality: q,
      });

      const url = URL.createObjectURL(newBlob);
      setPreviewUrl(url);
      setBlob(newBlob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setWidth(format.width);
    setHeight(format.height);
    setQuality(85);
    setPreviewUrl('');
    setBlob(new Blob());
    setError('');
    setIsLoading(false);
  };

  const copyPageLink = async () => {
    const pageUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopySuccess(true);
      window.setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setError('Unable to copy link. Please copy the URL from your address bar.');
    }
  };

  const filename = `${format.slug}-${width}x${height}.jpg`;
  const categoryLink = `/#popular-tools`;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: format.category, href: categoryLink },
          { label: format.name },
        ]}
      />

      {/* Top Ad */}
      <AdPlaceholder position="top" />

      {/* Main Tool Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload & Preview */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-foreground text-balance">
            {format.name} Image Resizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Easily resize your images to {format.width} × {format.height} pixels
          </p>

          <UploadBox onImageSelect={handleImageSelect} error={error} />

          {selectedFile && previewUrl && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Preview
                </h2>
                <ImagePreview
                  dataUrl={previewUrl}
                  width={width}
                  height={height}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Column - Controls */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border space-y-6 sticky top-4">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>

            <ResizeControls
              width={width}
              height={height}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
              lockAspectRatio={false}
            />

            <Separator />

            <QualitySlider value={quality} onChange={handleQualityChange} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button type="button" variant="secondary" onClick={copyPageLink}>
                <Link2 className="mr-2 h-4 w-4" />
                {copySuccess ? 'Copied' : 'Copy Link'}
              </Button>
            </div>

            <DownloadButton
              blob={blob}
              filename={filename}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Middle Ad */}
      <AdPlaceholder position="middle" />

      {/* SEO Content Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          About {format.name}
        </h2>
        <p className="text-foreground leading-relaxed">
          {format.seoContent}
        </p>
      </div>

      <Separator />

      {/* FAQ Section */}
      <FAQ items={format.faqs} />

      {/* Bottom Ad */}
      <AdPlaceholder position="bottom" />

      <Separator />
      <InternalLinksSections
        current={{
          slug: format.slug,
          name: format.name,
          routeType: 'image',
          category: format.category,
          href: `/resize-image/${format.slug}`,
        }}
        relatedTools={relatedFormats.map((related) => ({
          name: related.name,
          slug: related.slug,
          category: related.category,
        }))}
      />
    </div>
  );
}
