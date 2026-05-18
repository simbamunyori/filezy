'use client'

import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

const ROTATION_OPTIONS = [
  { label: '90° Clockwise', value: 90 },
  { label: '90° Counter-clockwise', value: 270 },
  { label: '180°', value: 180 },
]

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null)
  const [rotation, setRotation] = useState(90)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const handleRotate = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()
      for (const page of pages) {
        const currentAngle = page.getRotation().angle
        page.setRotation(degrees((currentAngle + rotation) % 360))
      }
      const rotatedBytes = await pdfDoc.save()
      const blob = new Blob([new Uint8Array(rotatedBytes)], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: rotatedBytes.length })
    } catch (err) {
      setError('Failed to rotate PDF. The file may be corrupted or password-protected.')
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

  if (result) {
    const baseName = file?.name.replace(/\.pdf$/i, '') ?? 'document'
    return (
      <ResultCard
        downloadUrl={result.url}
        fileName={`${baseName}_rotated.pdf`}
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
          <p className="text-sm font-medium text-text">Rotation Direction</p>
          <div className="grid grid-cols-3 gap-2">
            {ROTATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRotation(opt.value)}
                className={[
                  'p-3 rounded-lg border text-sm font-medium transition-all',
                  rotation === opt.value
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-border bg-bg text-text hover:border-accent/40',
                ].join(' ')}
              >
                <div className="flex justify-center mb-1.5">
                  <RotationIcon angle={opt.value} active={rotation === opt.value} />
                </div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleRotate} loading={processing} disabled={!file}>
        Rotate PDF
      </ProcessButton>
    </div>
  )
}

function RotationIcon({ angle, active }: { angle: number; active: boolean }) {
  const color = active ? '#2563EB' : '#6B7280'
  const transform =
    angle === 90
      ? 'rotate(90, 12, 12)'
      : angle === 270
      ? 'rotate(-90, 12, 12)'
      : 'rotate(180, 12, 12)'

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={angle === 270 ? 'scale(-1,1) translate(-24,0)' : undefined}
      />
      <path
        d="M21 3v5h-5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={angle === 270 ? 'scale(-1,1) translate(-24,0)' : undefined}
      />
    </svg>
  )
}
