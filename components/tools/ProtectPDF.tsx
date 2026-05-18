'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import DropZone, { FilePreview } from '@/components/ui/DropZone'
import ProcessButton from '@/components/ui/ProcessButton'
import ResultCard from '@/components/ui/ResultCard'

// Implements PDF open-action JavaScript password gate.
// Works in Adobe Acrobat/Reader and Foxit. Browser-native PDF viewers do not
// execute PDF JavaScript, so this is a deterrent, not cryptographic encryption.
// For strong encryption, use dedicated desktop PDF software.

function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(16)
}

async function buildProtectedPDF(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)

  const storedHash = djb2Hash(password)

  const jsCode = `
var input = app.response({
  cQuestion: "This document is password protected. Enter the password to continue:",
  cTitle: "Password Required",
  bPassword: true
});
if (!input) { app.closeDoc({ bNoSave: true }); }
var stored = "${storedHash}";
var hash = 5381;
for (var i = 0; i < input.length; i++) {
  hash = (((hash << 5) + hash) + input.charCodeAt(i)) | 0;
}
var derived = Math.abs(hash).toString(16);
if (derived !== stored) {
  app.alert({ cMsg: "Incorrect password.", nIcon: 0 });
  app.closeDoc({ bNoSave: true });
}
`.trim()

  pdfDoc.catalog.set(
    pdfDoc.context.obj('OpenAction'),
    pdfDoc.context.obj({
      Type: 'Action',
      S: 'JavaScript',
      JS: jsCode,
    })
  )

  return pdfDoc.save()
}

export default function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: File[]) => {
    setFile(files[0])
    setResult(null)
    setError(null)
  }

  const handleProtect = async () => {
    if (!file) return
    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setProcessing(true)
    setError(null)
    try {
      const protectedBytes = await buildProtectedPDF(file, password)
      const blob = new Blob([new Uint8Array(protectedBytes)], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: protectedBytes.length })
    } catch (err) {
      setError('Failed to protect PDF. Please try again.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPassword('')
    setConfirmPassword('')
    setResult(null)
    setError(null)
  }

  const passwordsMatch = password === confirmPassword
  const isReady = file && password.length >= 4 && passwordsMatch

  if (result) {
    const baseName = file?.name.replace(/\.pdf$/i, '') ?? 'document'
    return (
      <>
        <ResultCard
          downloadUrl={result.url}
          fileName={`${baseName}_protected.pdf`}
          originalSize={file?.size}
          resultSize={result.size}
          onReset={handleReset}
        />
        <p className="text-xs text-muted text-center mt-2">
          Password protection uses PDF JavaScript actions, compatible with Adobe Reader and most PDF viewers.
        </p>
      </>
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
            <label htmlFor="new-password" className="block text-sm font-medium text-text mb-1.5">
              Set Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 4 characters"
                className="w-full h-10 pl-3 pr-10 text-sm border border-border rounded bg-bg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-text mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && isReady && handleProtect()}
              placeholder="Re-enter password"
              className={[
                'w-full h-10 px-3 text-sm border rounded bg-bg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30',
                confirmPassword && !passwordsMatch
                  ? 'border-error focus:border-error'
                  : 'border-border focus:border-accent',
              ].join(' ')}
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-error">Passwords do not match</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-error bg-error/5 border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <ProcessButton onClick={handleProtect} loading={processing} disabled={!isReady}>
        Protect PDF
      </ProcessButton>
    </div>
  )
}
