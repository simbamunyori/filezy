'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import DropZone from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

interface Crop {
  x: number
  y: number
  w: number
  h: number
}

type Handle = 'nw' | 'ne' | 'sw' | 'se' | 'move' | null

const MIN_CROP = 20

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number } | null>(null)
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState<Handle>(null)
  const [dragStart, setDragStart] = useState<{ mx: number; my: number; crop: Crop } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const initCrop = useCallback((dw: number, dh: number) => {
    const margin = Math.min(dw, dh) * 0.1
    setCrop({ x: margin, y: margin, w: dw - margin * 2, h: dh - margin * 2 })
  }, [])

  const handleFiles = (files: File[]) => {
    const f = files[0]
    setFile(f)
    setResult(null)
    setError(null)
    const url = URL.createObjectURL(f)
    setImgSrc(url)
  }

  const handleImgLoad = () => {
    const img = imgRef.current
    const container = containerRef.current
    if (!img || !container) return
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    const dw = img.offsetWidth
    const dh = img.offsetHeight
    setDisplaySize({ w: dw, h: dh })
    initCrop(dw, dh)
  }

  const clampCrop = (c: Crop, dw: number, dh: number): Crop => ({
    x: Math.max(0, Math.min(c.x, dw - MIN_CROP)),
    y: Math.max(0, Math.min(c.y, dh - MIN_CROP)),
    w: Math.max(MIN_CROP, Math.min(c.w, dw - Math.max(0, c.x))),
    h: Math.max(MIN_CROP, Math.min(c.h, dh - Math.max(0, c.y))),
  })

  const getHandleAt = (mx: number, my: number): Handle => {
    const ZONE = 12
    const { x, y, w, h } = crop
    const corners: [Handle, number, number][] = [
      ['nw', x, y],
      ['ne', x + w, y],
      ['sw', x, y + h],
      ['se', x + w, y + h],
    ]
    for (const [handle, hx, hy] of corners) {
      if (Math.abs(mx - hx) <= ZONE && Math.abs(my - hy) <= ZONE) return handle
    }
    if (mx > x && mx < x + w && my > y && my < y + h) return 'move'
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!displaySize) return
    e.preventDefault()
    const rect = containerRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const handle = getHandleAt(mx, my)
    if (!handle) return
    setDragging(handle)
    setDragStart({ mx, my, crop: { ...crop } })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !dragStart || !displaySize) return
    const rect = containerRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const dx = mx - dragStart.mx
    const dy = my - dragStart.my
    const { x, y, w, h } = dragStart.crop
    let next: Crop = { x, y, w, h }

    if (dragging === 'move') {
      next = { x: x + dx, y: y + dy, w, h }
    } else if (dragging === 'se') {
      next = { x, y, w: w + dx, h: h + dy }
    } else if (dragging === 'sw') {
      next = { x: x + dx, y, w: w - dx, h: h + dy }
    } else if (dragging === 'ne') {
      next = { x, y: y + dy, w: w + dx, h: h - dy }
    } else if (dragging === 'nw') {
      next = { x: x + dx, y: y + dy, w: w - dx, h: h - dy }
    }

    setCrop(clampCrop(next, displaySize.w, displaySize.h))
  }, [dragging, dragStart, displaySize]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseUp = useCallback(() => {
    setDragging(null)
    setDragStart(null)
  }, [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  const handleCrop = async () => {
    if (!file || !naturalSize || !displaySize) return
    setProcessing(true)
    setError(null)
    try {
      const scaleX = naturalSize.w / displaySize.w
      const scaleY = naturalSize.h / displaySize.h
      const sx = Math.round(crop.x * scaleX)
      const sy = Math.round(crop.y * scaleY)
      const sw = Math.round(crop.w * scaleX)
      const sh = Math.round(crop.h * scaleY)

      const bitmap = await createImageBitmap(file, sx, sy, sw, sh)
      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bitmap, 0, 0)
      bitmap.close()

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Export failed')), mime, 0.92)
      })
      const baseName = file.name.replace(/\.[^.]+$/, '')
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: `${baseName}-cropped.${ext}` })
    } catch (err) {
      setError('Failed to crop image.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setImgSrc(null)
    setResult(null)
    setError(null)
    setNaturalSize(null)
    setDisplaySize(null)
  }

  const scaleX = naturalSize && displaySize ? naturalSize.w / displaySize.w : 1
  const scaleY = naturalSize && displaySize ? naturalSize.h / displaySize.h : 1
  const cropPxW = Math.round(crop.w * scaleX)
  const cropPxH = Math.round(crop.h * scaleY)

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
      {!imgSrc ? (
        <DropZone onFiles={handleFiles} accept={['jpg', 'jpeg', 'png', 'webp']} />
      ) : (
        <div className="space-y-3">
          <div
            ref={containerRef}
            className="relative inline-block w-full overflow-hidden rounded-lg border border-border bg-bg select-none"
            style={{ cursor: dragging ? (dragging === 'move' ? 'grabbing' : 'crosshair') : 'default' }}
            onMouseDown={handleMouseDown}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Crop preview"
              className="block w-full max-h-[500px] object-contain"
              onLoad={handleImgLoad}
              draggable={false}
            />

            {displaySize && (
              <>
                {/* Dark overlay outside crop */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <mask id="crop-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="black" />
                      </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="rgba(0,0,0,0.45)" mask="url(#crop-mask)" />
                  </svg>
                </div>

                {/* Crop border */}
                <div
                  className="absolute border-2 border-accent pointer-events-none"
                  style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
                >
                  {/* Rule of thirds guides */}
                  <div className="absolute inset-0">
                    <div className="absolute border-t border-white/30" style={{ top: '33.33%', left: 0, right: 0 }} />
                    <div className="absolute border-t border-white/30" style={{ top: '66.66%', left: 0, right: 0 }} />
                    <div className="absolute border-l border-white/30" style={{ left: '33.33%', top: 0, bottom: 0 }} />
                    <div className="absolute border-l border-white/30" style={{ left: '66.66%', top: 0, bottom: 0 }} />
                  </div>
                </div>

                {/* Handles */}
                {(['nw', 'ne', 'sw', 'se'] as const).map((pos) => {
                  const hx = pos.includes('e') ? crop.x + crop.w : crop.x
                  const hy = pos.includes('s') ? crop.y + crop.h : crop.y
                  const cursors: Record<string, string> = { nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize' }
                  return (
                    <div
                      key={pos}
                      className="absolute w-3 h-3 bg-white border-2 border-accent rounded-sm"
                      style={{
                        left: hx - 6,
                        top: hy - 6,
                        cursor: cursors[pos],
                        pointerEvents: 'none',
                      }}
                    />
                  )
                })}
              </>
            )}
          </div>

          {naturalSize && (
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Original: <span className="font-mono text-text">{naturalSize.w} × {naturalSize.h}</span></span>
              <span>Crop: <span className="font-mono text-text">{cropPxW} × {cropPxH}</span></span>
              <button
                onClick={() => displaySize && initCrop(displaySize.w, displaySize.h)}
                className="text-accent hover:underline"
              >
                Reset crop
              </button>
              <button
                onClick={() => { setFile(null); setImgSrc(null) }}
                className="text-muted hover:text-error"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleCrop} loading={processing} disabled={!file}>
        Crop Image
      </ProcessButton>
    </div>
  )
}
