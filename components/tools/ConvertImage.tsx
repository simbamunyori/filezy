'use client'

import { useState } from 'react'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

type Format = 'jpg' | 'png' | 'webp' | 'avif'

const FORMAT_OPTIONS: { value: Format; label: string; mime: string; note?: string }[] = [
  { value: 'jpg', label: 'JPEG', mime: 'image/jpeg', note: 'Best for photos' },
  { value: 'png', label: 'PNG', mime: 'image/png', note: 'Lossless, supports transparency' },
  { value: 'webp', label: 'WebP', mime: 'image/webp', note: 'Smaller than JPEG/PNG' },
  { value: 'avif', label: 'AVIF', mime: 'image/avif', note: 'Best compression, modern browsers' },
]

export default function ConvertImage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<Format>('webp')
  const [quality, setQuality] = useState(85)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const handleConvert = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')!

      if (targetFormat === 'jpg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(bitmap, 0, 0)
      bitmap.close()

      const fmt = FORMAT_OPTIONS.find((f) => f.value === targetFormat)!
      const qualityValue = targetFormat === 'png' ? undefined : quality / 100

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error(`${targetFormat.toUpperCase()} export not supported in this browser.`))),
          fmt.mime,
          qualityValue
        )
      })

      const baseName = file.name.replace(/\.[^.]+$/, '')
      const outputName = `${baseName}.${targetFormat}`
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: outputName })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed. Try a different format.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  const currentExt = file?.name.split('.').pop()?.toLowerCase() ?? ''

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
        <DropZone onFiles={handleFiles} accept={['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp']} />
      ) : (
        <FilePreview file={file} onRemove={() => { setFile(null); setResult(null) }} />
      )}

      {file && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-text mb-3">Convert to</p>
            <div className="grid grid-cols-2 gap-2">
              {FORMAT_OPTIONS.map((fmt) => {
                const isCurrentFormat = currentExt === fmt.value || (currentExt === 'jpeg' && fmt.value === 'jpg')
                return (
                  <label
                    key={fmt.value}
                    className={[
                      'flex items-start gap-2 p-3 rounded border cursor-pointer transition-colors',
                      targetFormat === fmt.value
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/40',
                      isCurrentFormat ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={fmt.value}
                      checked={targetFormat === fmt.value}
                      onChange={() => setTargetFormat(fmt.value)}
                      className="mt-0.5 accent-accent"
                      disabled={isCurrentFormat}
                    />
                    <div>
                      <span className="text-sm font-medium text-text">{fmt.label}</span>
                      {isCurrentFormat && <span className="ml-1 text-xs text-muted">(current)</span>}
                      <p className="text-xs text-muted mt-0.5">{fmt.note}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {targetFormat !== 'png' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text">Quality: {quality}%</label>
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
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleConvert} loading={processing} disabled={!file}>
        Convert to {targetFormat.toUpperCase()}
      </ProcessButton>
    </div>
  )
}
