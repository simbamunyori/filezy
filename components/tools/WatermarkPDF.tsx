'use client'

import { useState } from 'react'
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

type Position = 'diagonal' | 'center' | 'bottom-right'

const POSITIONS: { value: Position; label: string }[] = [
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
]

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(0.3)
  const [fontSize, setFontSize] = useState(48)
  const [position, setPosition] = useState<Position>('diagonal')
  const [color, setColor] = useState('#6B7280')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return rgb(r, g, b)
  }

  const handleWatermark = async () => {
    if (!file || !text.trim()) return
    setProcessing(true)
    setError(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const watermarkColor = hexToRgb(color)
      const pages = pdfDoc.getPages()

      for (const page of pages) {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        const textHeight = fontSize

        let x: number, y: number, rotate: number

        switch (position) {
          case 'diagonal':
            x = width / 2 - textWidth / 2
            y = height / 2 - textHeight / 2
            rotate = 45
            break
          case 'center':
            x = width / 2 - textWidth / 2
            y = height / 2 - textHeight / 2
            rotate = 0
            break
          case 'bottom-right':
            x = width - textWidth - 24
            y = 24
            rotate = 0
            break
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: watermarkColor,
          opacity,
          rotate: degrees(rotate),
        })
      }

      const watermarkedBytes = await pdfDoc.save()
      const blob = new Blob([new Uint8Array(watermarkedBytes)], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: watermarkedBytes.length })
    } catch (err) {
      setError('Failed to add watermark. The file may be corrupted or password-protected.')
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
        fileName={`${baseName}_watermarked.pdf`}
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
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <div>
            <label htmlFor="wm-text" className="block text-sm font-medium text-text mb-1.5">
              Watermark Text
            </label>
            <input
              id="wm-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
              maxLength={50}
              className="w-full h-10 px-3 text-sm border border-border rounded bg-bg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-text mb-2">Position</p>
            <div className="flex gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={[
                    'flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all',
                    position === p.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-bg text-text hover:border-accent/40',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text">Opacity</label>
                <span className="text-xs font-mono text-accent">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text">Font Size</label>
                <span className="text-xs font-mono text-accent">{fontSize}pt</span>
              </div>
              <input
                type="range"
                min={16}
                max={96}
                step={4}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded border border-border cursor-pointer bg-bg"
              />
              <div className="flex gap-2">
                {['#6B7280', '#DC2626', '#2563EB', '#16A34A', '#111827'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={[
                      'w-7 h-7 rounded-full border-2 transition-all',
                      color === c ? 'border-accent scale-110' : 'border-transparent',
                    ].join(' ')}
                    style={{ backgroundColor: c }}
                    aria-label={`Set color to ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview badge */}
          <div className="rounded-lg bg-bg border border-border p-4 flex items-center justify-center min-h-[80px]">
            <span
              style={{
                fontSize: Math.min(fontSize, 32),
                color,
                opacity,
                fontWeight: 700,
                transform: position === 'diagonal' ? 'rotate(-15deg)' : undefined,
                fontFamily: 'Helvetica, Arial, sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              {text || 'WATERMARK'}
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleWatermark} loading={processing} disabled={!file || !text.trim()}>
        Add Watermark
      </ProcessButton>
    </div>
  )
}
