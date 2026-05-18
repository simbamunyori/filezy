'use client'

import { useState } from 'react'
import DropZone from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ProgressBar from '@/components/ui/ProgressBar'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    const f = files[0]
    setFile(f)
    setResult(null)
    setError(null)
    setPreviewSrc(URL.createObjectURL(f))
  }

  const handleRemove = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    setProgress(0)
    setStatusText('Loading AI model… (first time only, ~5 MB)')
    try {
      const { removeBackground } = await import('@imgly/background-removal')

      setProgress(30)
      setStatusText('Analyzing image…')

      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            setProgress(30 + Math.round((current / total) * 60))
            setStatusText('Removing background…')
          }
        },
        output: { format: 'image/png', quality: 1 },
      })

      setProgress(100)
      setStatusText('Done!')
      const url = URL.createObjectURL(blob)
      setResult({ url, size: blob.size })
    } catch (err) {
      setError('Failed to remove background. Please try a JPG or PNG image.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewSrc(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const outputName = file ? file.name.replace(/\.[^.]+$/, '') + '-no-bg.png' : 'image-no-bg.png'

  return (
    <div className="space-y-4">
      {!file ? (
        <DropZone onFiles={handleFiles} accept={['jpg', 'jpeg', 'png', 'webp']} />
      ) : (
        <>
          {/* Before / After preview */}
          <div className={['grid gap-3', result ? 'grid-cols-2' : 'grid-cols-1'].join(' ')}>
            <div className="space-y-1">
              <p className="text-xs text-muted text-center font-medium">Original</p>
              <div className="rounded-lg border border-border overflow-hidden bg-bg aspect-square flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc!}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-xs text-muted text-center font-mono">{formatBytes(file.size)}</p>
            </div>

            {result && (
              <div className="space-y-1">
                <p className="text-xs text-muted text-center font-medium">Background removed</p>
                <div
                  className="rounded-lg border border-border overflow-hidden aspect-square flex items-center justify-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    backgroundColor: '#fff',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.url}
                    alt="Background removed"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-xs text-muted text-center font-mono">{formatBytes(result.size)}</p>
              </div>
            )}
          </div>

          {!result && (
            <button
              onClick={() => { setFile(null); setPreviewSrc(null) }}
              className="text-xs text-muted hover:text-error transition-colors"
            >
              Remove image
            </button>
          )}
        </>
      )}

      {processing && (
        <ProgressBar progress={progress} label={statusText} />
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      {result ? (
        <div className="space-y-2">
          <a
            href={result.url}
            download={outputName}
            className="w-full h-12 rounded bg-accent hover:bg-accent-hover text-white font-medium text-base flex items-center justify-center gap-2 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1v10M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PNG
          </a>
          <button
            onClick={handleReset}
            className="w-full text-sm text-muted hover:text-text transition-colors text-center py-2"
          >
            Process another image
          </button>

          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted text-center">Advertisement</p>
            <div className="h-16 flex items-center justify-center text-xs text-muted/40 font-mono">
              [AdSense unit]
            </div>
          </div>
        </div>
      ) : (
        <ProcessButton onClick={handleRemove} loading={processing} disabled={!file}>
          Remove Background
        </ProcessButton>
      )}

      {!result && (
        <p className="text-xs text-muted text-center">
          AI model runs entirely in your browser. Images are never uploaded.
        </p>
      )}
    </div>
  )
}
