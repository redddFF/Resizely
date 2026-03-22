'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formats, type ImageFormat } from '@/lib/formats';

function getPlatformLabel(category: string): string {
  const parts = category.split('-').map((part) => part.trim());
  return parts.length > 1 ? parts[parts.length - 1] : category;
}

function getBestMatch(width: number, height: number, platform: string): ImageFormat | null {
  const candidates =
    platform === 'All Platforms'
      ? formats
      : formats.filter((format) => getPlatformLabel(format.category) === platform);

  const pool = candidates.length > 0 ? candidates : formats;
  const targetRatio = width / height;

  const ranked = pool
    .map((format) => {
      const widthDelta = Math.abs(format.width - width) / Math.max(format.width, width);
      const heightDelta = Math.abs(format.height - height) / Math.max(format.height, height);
      const ratioDelta = Math.abs(format.width / format.height - targetRatio);

      return {
        format,
        score: widthDelta + heightDelta + ratioDelta * 0.75,
      };
    })
    .sort((a, b) => a.score - b.score);

  return ranked[0]?.format ?? null;
}

export function SmartResolutionSearch() {
  const router = useRouter();
  const [width, setWidth] = useState('1080');
  const [height, setHeight] = useState('1080');
  const [platform, setPlatform] = useState('All Platforms');
  const [bestMatch, setBestMatch] = useState<ImageFormat | null>(null);
  const [error, setError] = useState('');

  const platforms = useMemo(() => {
    const unique = new Set<string>();
    formats.forEach((format) => unique.add(getPlatformLabel(format.category)));
    return ['All Platforms', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    if (!Number.isFinite(parsedWidth) || !Number.isFinite(parsedHeight) || parsedWidth <= 0 || parsedHeight <= 0) {
      setError('Please enter valid positive values for width and height.');
      setBestMatch(null);
      return;
    }

    setError('');
    const match = getBestMatch(parsedWidth, parsedHeight, platform);
    setBestMatch(match);
  };

  return (
    <Card className="p-5 md:p-6 mt-8 bg-card/70 backdrop-blur border-border/70">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Smart Resolution Search</h2>
          <p className="text-sm text-muted-foreground">
            Enter width and height, choose a platform, and get the best matching resize page.
          </p>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="number"
            min={1}
            value={width}
            onChange={(event) => setWidth(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Width"
            aria-label="Width"
          />
          <input
            type="number"
            min={1}
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Height"
            aria-label="Height"
          />
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Platform"
          >
            {platforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button type="submit">Find Best Match</Button>
        </form>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {bestMatch ? (
          <div className="rounded-md border border-border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Best Match: {bestMatch.name}</p>
              <p className="text-sm text-muted-foreground">
                {bestMatch.width} x {bestMatch.height} px • {bestMatch.aspectRatio} • {getPlatformLabel(bestMatch.category)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/resize-image/${bestMatch.slug}`}>Preview Page</Link>
              </Button>
              <Button onClick={() => router.push(`/resize-image/${bestMatch.slug}`)}>Open Tool</Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}