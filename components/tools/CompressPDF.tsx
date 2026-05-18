'use client'

import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'
import ProgressBar from '@/components/ui/ProgressBar'

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
}

type Quality = 'high' | 'medium' | 'low'

const QUALITY_SETTINGS: Record<Quality, { scale: number; jpegQuality: number; label: string }> = {
  high: { scale: 1.5, jpegQuality: 0.85, label: 'High — best quality, moderate size reduction' },
  medium: { scale: 1.2, jpegQuality: 0.65, label: 'Medium — balanced quality and size' },
  low: { scale: 1.0, jpegQuality: 0.45, label: 'Low — smallest file, reduced quality' },
}

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState<Quality>('medium')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const handleCompress = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    setProgress(0)
    try {
      const { scale, jpegQuality } = QUALITY_SETTINGS[quality]
      const arrayBuffer = await file.arrayBuffer()
      const pdfData = new Uint8Array(arrayBuffer)
      const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise
      const numPages = pdfDocument.numPages

      const newPdf = await PDFDocument.create()

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        canvas.width = Math.round(viewport.width)
        canvas.height = Math.round(viewport.height)
        const ctx = canvas.getContext('2d')!

        await page.render({ canvasContext: ctx, viewport }).promise

        const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality)
        const base64 = dataUrl.split(',')[1]
        const jpegBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))

        const image = await newPdf.embedJpg(jpegBytes)
        const newPage = newPdf.addPage([canvas.width, canvas.height])
        newPage.drawImage(image, { x: 0, y: 0, width: canvas.width, height: canvas.height })

        setProgress(Math.round((i / numPages) * 100))
      }

      const compressedBytes = await newPdf.save()
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResult({ url, size: compressedBytes.length })
    } catch (err) {
      setError('Failed to compress PDF. The file may be corrupted or password-protected.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  if (result) {
    return (
      <ResultCard
        downloadUrl={result.url}
        fileName="compressed.pdf"
        originalSize={file?.size}
        resultSize={result.size}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <DropZone onFiles={handleFiles} accept={['pdf']} />
      ) : (
        <FilePreview file={file} onRemove={() => { setFile(null); setResult(null) }} />
      )}

      {file && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-text">Compression Quality</p>
          {(Object.keys(QUALITY_SETTINGS) as Quality[]).map((q) => (
            <label key={q} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="quality"
                value={q}
                checked={quality === q}
                onChange={() => setQuality(q)}
                className="mt-0.5 accent-accent"
              />
              <div>
                <span className="text-sm font-medium text-text capitalize">{q}</span>
                <p className="text-xs text-muted">{QUALITY_SETTINGS[q].label}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {processing && (
        <ProgressBar progress={progress} label={`Compressing page ${Math.ceil(progress / 100 * 100)}%`} />
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton
        onClick={handleCompress}
        loading={processing}
        disabled={!file}
      >
        Compress PDF
      </ProcessButton>
    </div>
  )
}
