'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const handleUnlock = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      // ignoreEncryption: true loads PDFs with permissions restrictions (print/copy locks)
      // without requiring the owner password. Re-saving removes those restrictions.
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const unlockedBytes = await pdfDoc.save()
      const blob = new Blob([new Uint8Array(unlockedBytes)], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: unlockedBytes.length })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      if (msg.includes('encrypt') || msg.includes('password') || msg.includes('decrypt')) {
        setError(
          'This PDF requires a password to open. Browser-based decryption is not supported — use Adobe Acrobat or a desktop PDF tool to unlock it.'
        )
      } else {
        setError('Failed to process PDF. The file may be corrupted.')
      }
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
        fileName={`${baseName}_unlocked.pdf`}
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
        <div className="flex items-start gap-2 bg-accent/5 border border-accent/20 rounded px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-accent mt-0.5 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-muted">
            Removes printing, copying, and editing restrictions from PDFs. Works on permission-locked PDFs that open without a password.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleUnlock} loading={processing} disabled={!file}>
        Remove Restrictions
      </ProcessButton>
    </div>
  )
}
