'use client'

import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

interface FileEntry {
  id: string
  file: File
}

export default function MergePDF() {
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleFiles = useCallback((files: File[]) => {
    const newEntries = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }))
    setFileEntries((prev) => [...prev, ...newEntries])
    setResult(null)
    setError(null)
  }, [])

  const removeFile = (id: string) => {
    setFileEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (sourceIndex === targetIndex) return

    setFileEntries((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(sourceIndex, 1)
      updated.splice(targetIndex, 0, moved)
      return updated
    })
    setDragOverIndex(null)
  }

  const handleDragEnd = () => setDragOverIndex(null)

  const totalSize = fileEntries.reduce((sum, e) => sum + e.file.size, 0)

  const handleMerge = async () => {
    if (fileEntries.length < 2) {
      setError('Add at least 2 PDF files to merge.')
      return
    }
    setProcessing(true)
    setError(null)
    try {
      const mergedPdf = await PDFDocument.create()
      for (const entry of fileEntries) {
        const bytes = await entry.file.arrayBuffer()
        const srcDoc = await PDFDocument.load(bytes)
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResult({ url, size: mergedBytes.length })
    } catch (err) {
      setError('Failed to merge PDFs. Make sure all files are valid PDF documents.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFileEntries([])
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <ResultCard
        downloadUrl={result.url}
        fileName="merged.pdf"
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
        accept={['pdf']}
        multiple
        label="Drag & drop PDF files here"
      />

      {fileEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted">
            {fileEntries.length} file{fileEntries.length !== 1 ? 's' : ''} — drag to reorder
          </p>
          {fileEntries.map((entry, index) => (
            <div
              key={entry.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={[
                'rounded-lg transition-all duration-100',
                dragOverIndex === index ? 'ring-2 ring-accent ring-offset-1' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <div className="cursor-grab active:cursor-grabbing text-muted px-1 shrink-0">
                  <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
                    <circle cx="4" cy="3" r="1.5" />
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="4" cy="8" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="4" cy="13" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <FilePreview file={entry.file} onRemove={() => removeFile(entry.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton
        onClick={handleMerge}
        loading={processing}
        disabled={fileEntries.length < 2}
      >
        Merge {fileEntries.length > 0 ? `${fileEntries.length} PDFs` : 'PDFs'}
      </ProcessButton>
    </div>
  )
}
