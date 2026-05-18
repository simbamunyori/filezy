'use client'

import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

interface ImageEntry {
  id: string
  file: File
}

export default function JPGtoPDF() {
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback((files: File[]) => {
    const newEntries = files.map((f) => ({ id: crypto.randomUUID(), file: f }))
    setImageEntries((prev) => [...prev, ...newEntries])
    setResult(null)
    setError(null)
  }, [])

  const removeFile = (id: string) => {
    setImageEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const handleConvert = async () => {
    if (imageEntries.length === 0) return
    setProcessing(true)
    setError(null)
    try {
      const pdfDoc = await PDFDocument.create()

      for (const entry of imageEntries) {
        const bytes = new Uint8Array(await entry.file.arrayBuffer())
        const isJpeg = entry.file.type === 'image/jpeg'
        const isPng = entry.file.type === 'image/png'
        const isWebp = entry.file.type === 'image/webp'

        let image
        if (isJpeg) {
          image = await pdfDoc.embedJpg(bytes)
        } else if (isPng) {
          image = await pdfDoc.embedPng(bytes)
        } else if (isWebp) {
          // Convert WebP to PNG via canvas first
          const blob = new Blob([bytes], { type: 'image/webp' })
          const bitmapUrl = URL.createObjectURL(blob)
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image()
            el.onload = () => resolve(el)
            el.onerror = reject
            el.src = bitmapUrl
          })
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          canvas.getContext('2d')!.drawImage(img, 0, 0)
          URL.revokeObjectURL(bitmapUrl)
          const pngDataUrl = canvas.toDataURL('image/png')
          const pngBytes = Uint8Array.from(atob(pngDataUrl.split(',')[1]), (c) => c.charCodeAt(0))
          image = await pdfDoc.embedPng(pngBytes)
        } else {
          // Fallback: draw to canvas and embed as JPEG
          const blob = new Blob([bytes], { type: entry.file.type })
          const bitmapUrl = URL.createObjectURL(blob)
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image()
            el.onload = () => resolve(el)
            el.onerror = reject
            el.src = bitmapUrl
          })
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          canvas.getContext('2d')!.drawImage(img, 0, 0)
          URL.revokeObjectURL(bitmapUrl)
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92)
          const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), (c) => c.charCodeAt(0))
          image = await pdfDoc.embedJpg(jpegBytes)
        }

        const { width, height } = image
        const page = pdfDoc.addPage([width, height])
        page.drawImage(image, { x: 0, y: 0, width, height })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: pdfBytes.length })
    } catch (err) {
      setError('Failed to convert images. Please make sure all files are valid images.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setImageEntries([])
    setResult(null)
    setError(null)
  }

  const totalSize = imageEntries.reduce((sum, e) => sum + e.file.size, 0)

  if (result) {
    return (
      <ResultCard
        downloadUrl={result.url}
        fileName="images.pdf"
        originalSize={totalSize}
        resultSize={result.size}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="space-y-4">
      <DropZone
        onFiles={handleFiles}
        accept={['jpg', 'jpeg', 'png', 'webp']}
        multiple
        label="Drag & drop images here"
      />

      {imageEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted">
            {imageEntries.length} image{imageEntries.length !== 1 ? 's' : ''} — will be added in this order
          </p>
          {imageEntries.map((entry) => (
            <FilePreview key={entry.id} file={entry.file} onRemove={() => removeFile(entry.id)} />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton
        onClick={handleConvert}
        loading={processing}
        disabled={imageEntries.length === 0}
      >
        Convert to PDF
      </ProcessButton>
    </div>
  )
}
