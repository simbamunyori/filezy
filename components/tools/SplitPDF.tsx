'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'

interface SplitResult {
  url: string
  label: string
  size: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function parseRanges(input: string, totalPages: number): number[][] | null {
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean)
  const ranges: number[][] = []
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-')
      const start = parseInt(startStr)
      const end = parseInt(endStr)
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) return null
      ranges.push(Array.from({ length: end - start + 1 }, (_, i) => start + i - 1))
    } else {
      const n = parseInt(part)
      if (isNaN(n) || n < 1 || n > totalPages) return null
      ranges.push([n - 1])
    }
  }
  return ranges.length > 0 ? ranges : null
}

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)
  const [rangeInput, setRangeInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<SplitResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: File[]) => {
    const f = files[0]
    setFile(f)
    setResults([])
    setError(null)
    setRangeInput('')
    try {
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
    } catch {
      setError('Could not read the PDF. It may be corrupted or password-protected.')
    }
  }

  const handleSplit = async () => {
    if (!file || !rangeInput.trim()) return
    const ranges = parseRanges(rangeInput, pageCount)
    if (!ranges) {
      setError(`Invalid page range. Enter values between 1 and ${pageCount}, e.g. "1-3, 5, 7-9".`)
      return
    }
    setProcessing(true)
    setError(null)
    try {
      const srcBytes = await file.arrayBuffer()
      const srcDoc = await PDFDocument.load(srcBytes)
      const newResults: SplitResult[] = []

      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i]
        const newDoc = await PDFDocument.create()
        const copiedPages = await newDoc.copyPages(srcDoc, range)
        copiedPages.forEach((page) => newDoc.addPage(page))
        const bytes = await newDoc.save()
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const label =
          range.length === 1
            ? `page_${range[0] + 1}.pdf`
            : `pages_${range[0] + 1}-${range[range.length - 1] + 1}.pdf`
        newResults.push({ url, label, size: bytes.length })
      }
      setResults(newResults)
    } catch (err) {
      setError('Failed to split PDF. Please try again.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPageCount(0)
    setRangeInput('')
    setResults([])
    setError(null)
  }

  if (results.length > 0) {
    return (
      <div className="space-y-3">
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16.667 5 7.5 14.167 3.333 10" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-base font-medium text-text">
              {results.length} PDF{results.length !== 1 ? 's' : ''} ready
            </p>
          </div>
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 p-3 bg-bg border border-border rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-mono text-text truncate">{r.label}</p>
                  <p className="text-xs text-muted">{formatBytes(r.size)}</p>
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
          Split another file
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

      {file && pageCount > 0 && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <p className="text-sm text-muted">
            This PDF has <span className="font-medium text-text">{pageCount} pages</span>.
          </p>
          <div>
            <label htmlFor="ranges" className="block text-sm font-medium text-text mb-1.5">
              Page ranges to extract
            </label>
            <input
              id="ranges"
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder={`e.g. 1-3, 5, 7-${pageCount}`}
              className="w-full h-10 px-3 text-sm border border-border rounded bg-bg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            <p className="mt-1.5 text-xs text-muted">
              Each range becomes a separate PDF. Use commas to separate ranges.
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton
        onClick={handleSplit}
        loading={processing}
        disabled={!file || !rangeInput.trim()}
      >
        Split PDF
      </ProcessButton>
    </div>
  )
}
