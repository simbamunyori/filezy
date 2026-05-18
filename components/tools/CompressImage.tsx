'use client'

import { useState, useRef, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(70)
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const estimateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!file) {
      setEstimatedSize(null)
      return
    }
    if (estimateTimerRef.current) clearTimeout(estimateTimerRef.current)
    estimateTimerRef.current = setTimeout(async () => {
      try {
        const compressed = await imageCompression(file, {
          initialQuality: quality / 100,
          useWebWorker: true,
          maxSizeMB: 999,
        })
        setEstimatedSize(compressed.size)
      } catch {
        setEstimatedSize(null)
      }
    }, 400)
    return () => {
      if (estimateTimerRef.current) clearTimeout(estimateTimerRef.current)
    }
  }, [file, quality])

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
    setEstimatedSize(null)
  }

  const handleCompress = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    try {
      const compressed = await imageCompression(file, {
        initialQuality: quality / 100,
        useWebWorker: true,
        maxSizeMB: 999,
      })
      const ext = file.name.split('.').pop() ?? 'jpg'
      const baseName = file.name.replace(/\.[^.]+$/, '')
      const outputName = `${baseName}-compressed.${ext}`
      const url = URL.createObjectURL(compressed)
      setResult({ url, size: compressed.size, name: outputName })
    } catch (err) {
      setError('Failed to compress image. Please try a different file.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setEstimatedSize(null)
  }

  if (result) {
    return (
      <ResultCard
        downloadUrl={result.url}
        fileName={result.name}
        originalSize={file?.size}
        resultSize={result.size}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <DropZone onFiles={handleFiles} accept={['jpg', 'jpeg', 'png', 'webp']} />
      ) : (
        <FilePreview file={file} onRemove={() => { setFile(null); setResult(null) }} />
      )}

      {file && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-text">Quality: {quality}%</p>
              {estimatedSize !== null && (
                <p className="text-xs text-muted">
                  Est. output: <span className="font-mono text-text">{formatBytes(estimatedSize)}</span>
                  {file && estimatedSize < file.size && (
                    <span className="ml-1 text-success">
                      ({Math.round((1 - estimatedSize / file.size) * 100)}% smaller)
                    </span>
                  )}
                </p>
              )}
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>Smaller file</span>
              <span>Best quality</span>
            </div>
          </div>

          <div className="flex gap-2 text-xs text-muted">
            <span className="px-2 py-1 bg-bg border border-border rounded">
              Original: <span className="font-mono text-text">{formatBytes(file.size)}</span>
            </span>
            {estimatedSize !== null && (
              <span className="px-2 py-1 bg-bg border border-border rounded">
                Output: <span className="font-mono text-text">{formatBytes(estimatedSize)}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleCompress} loading={processing} disabled={!file}>
        Compress Image
      </ProcessButton>
    </div>
  )
}
