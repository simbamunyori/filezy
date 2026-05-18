'use client'

import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ProgressBar from '@/components/ui/ProgressBar'

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

interface PageResult {
  url: string
  label: string
  size: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function dataURLtoBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)![1]
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export default function PDFtoJPG() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(0.9)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<PageResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResults([])
    setError(null)
  }

  const handleConvert = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    setProgress(0)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDocument = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
      const numPages = pdfDocument.numPages
      const pageResults: PageResult[] = []
      const baseName = file.name.replace(/\.pdf$/i, '')

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport }).promise
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        const blob = dataURLtoBlob(dataUrl)
        const url = URL.createObjectURL(blob)
        pageResults.push({
          url,
          label: numPages === 1 ? `${baseName}.jpg` : `${baseName}_page${i}.jpg`,
          size: blob.size,
        })
        setProgress(Math.round((i / numPages) * 100))
      }
      setResults(pageResults)
    } catch (err) {
      setError('Failed to convert PDF. The file may be corrupted or password-protected.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResults([])
    setError(null)
    setProgress(0)
  }

  const downloadAll = () => {
    results.forEach((r, i) => {
      const a = document.createElement('a')
      a.href = r.url
      a.download = r.label
      setTimeout(() => a.click(), i * 200)
    })
  }

  if (results.length > 0) {
    return (
      <div className="space-y-3">
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M16.667 5 7.5 14.167 3.333 10" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-base font-medium text-text">
                {results.length} image{results.length !== 1 ? 's' : ''} ready
              </p>
            </div>
            {results.length > 1 && (
              <button
                onClick={downloadAll}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Download All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 p-3 bg-bg border border-border rounded-lg">
                <div className="min-w-0 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.url} alt="" className="w-10 h-10 object-cover rounded border border-border" />
                  <div>
                    <p className="text-sm font-mono text-text truncate max-w-[200px]">{r.label}</p>
                    <p className="text-xs text-muted">{formatBytes(r.size)}</p>
                  </div>
                </div>
                <a
                  href={r.url}
                  download={r.label}
                  className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1v10M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleReset} className="w-full text-sm text-muted hover:text-text transition-colors text-center py-2">
          Convert another file
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <DropZone onFiles={handleFiles} accept={['pdf']} />
      ) : (
        <FilePreview file={file} onRemove={handleReset} />
      )}

      {file && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text">Image Quality</label>
            <span className="text-sm font-mono text-accent">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.3}
            max={1.0}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>Smaller file</span>
            <span>Best quality</span>
          </div>
        </div>
      )}

      {processing && <ProgressBar progress={progress} label={`Converting pages — ${progress}%`} />}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleConvert} loading={processing} disabled={!file}>
        Convert to JPG
      </ProcessButton>
    </div>
  )
}
