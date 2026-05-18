'use client'

import { useState, useEffect } from 'react'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

type Mode = 'pixels' | 'percentage'

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null)
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null)
  const [mode, setMode] = useState<Mode>('pixels')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [percentage, setPercentage] = useState('50')
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setOriginalDims(null)
      setWidth('')
      setHeight('')
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight })
      setWidth(String(img.naturalWidth))
      setHeight(String(img.naturalHeight))
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [file])

  const handleWidthChange = (val: string) => {
    setWidth(val)
    if (maintainAspect && originalDims && val) {
      const w = parseInt(val)
      if (!isNaN(w)) setHeight(String(Math.round((w / originalDims.w) * originalDims.h)))
    }
  }

  const handleHeightChange = (val: string) => {
    setHeight(val)
    if (maintainAspect && originalDims && val) {
      const h = parseInt(val)
      if (!isNaN(h)) setWidth(String(Math.round((h / originalDims.h) * originalDims.w)))
    }
  }

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const handleResize = async () => {
    if (!file || !originalDims) return
    setProcessing(true)
    setError(null)
    try {
      let targetW: number
      let targetH: number

      if (mode === 'percentage') {
        const pct = parseFloat(percentage) / 100
        targetW = Math.round(originalDims.w * pct)
        targetH = Math.round(originalDims.h * pct)
      } else {
        targetW = parseInt(width)
        targetH = parseInt(height)
        if (isNaN(targetW) || isNaN(targetH) || targetW < 1 || targetH < 1) {
          throw new Error('Please enter valid width and height values.')
        }
      }

      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bitmap, 0, 0, targetW, targetH)
      bitmap.close()

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      const baseName = file.name.replace(/\.[^.]+$/, '')

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Canvas export failed')), mimeType, 0.9)
      })

      const outputName = `${baseName}-${targetW}x${targetH}.${ext}`
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: outputName })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resize image.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setOriginalDims(null)
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

      {file && originalDims && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <p className="text-xs text-muted">
            Original: <span className="font-mono text-text">{originalDims.w} × {originalDims.h} px</span>
          </p>

          <div className="flex gap-2">
            {(['pixels', 'percentage'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={[
                  'px-3 py-1.5 rounded text-sm font-medium border transition-colors',
                  mode === m
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-muted border-border hover:border-accent/40',
                ].join(' ')}
              >
                {m === 'pixels' ? 'By pixels' : 'By percentage'}
              </button>
            ))}
          </div>

          {mode === 'pixels' ? (
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <label className="text-xs text-muted block mb-1">Width (px)</label>
                  <input
                    type="number"
                    min={1}
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full border border-border rounded px-3 py-2 text-sm text-text bg-bg font-mono focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="pt-5 text-muted text-sm">×</div>
                <div className="flex-1">
                  <label className="text-xs text-muted block mb-1">Height (px)</label>
                  <input
                    type="number"
                    min={1}
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full border border-border rounded px-3 py-2 text-sm text-text bg-bg font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="accent-accent"
                />
                Maintain aspect ratio
              </label>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text">Scale: {percentage}%</label>
                {originalDims && (
                  <span className="text-xs text-muted font-mono">
                    → {Math.round(originalDims.w * parseFloat(percentage) / 100)} × {Math.round(originalDims.h * parseFloat(percentage) / 100)} px
                  </span>
                )}
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>5%</span>
                <span>200%</span>
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

      <ProcessButton onClick={handleResize} loading={processing} disabled={!file}>
        Resize Image
      </ProcessButton>
    </div>
  )
}
