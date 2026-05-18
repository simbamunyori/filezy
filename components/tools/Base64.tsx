'use client'

import { useState, useCallback } from 'react'

type Mode = 'encode' | 'decode'

function encodeBase64(text: string): { result: string; error: string | null } {
  try {
    // Handle unicode by encoding to UTF-8 bytes first
    const bytes = new TextEncoder().encode(text)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return { result: btoa(binary), error: null }
  } catch {
    return { result: '', error: 'Encoding failed.' }
  }
}

function decodeBase64(text: string): { result: string; error: string | null } {
  try {
    const binary = atob(text.trim())
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return { result: new TextDecoder().decode(bytes), error: null }
  } catch {
    return { result: '', error: 'Invalid Base64 string — make sure it is correctly encoded.' }
  }
}

function encodeFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      // dataUrl is "data:<mime>;base64,<data>"
      const base64 = dataUrl.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Base64() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [copied, setCopied] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [fileInfo, setFileInfo] = useState<string | null>(null)

  const processResult = input
    ? mode === 'encode'
      ? encodeBase64(input)
      : decodeBase64(input)
    : { result: '', error: null }

  const { result, error } = processResult

  const handleCopy = useCallback(async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  const handleSwap = useCallback(() => {
    if (result && !error) {
      setInput(result)
      setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
      setFileInfo(null)
    }
  }, [result, error])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileLoading(true)
    setFileInfo(null)
    try {
      const base64 = await encodeFileToBase64(file)
      setInput(base64)
      setMode('decode')
      setFileInfo(`${file.name} (${(file.size / 1024).toFixed(1)} KB) — encoded as Base64`)
    } catch {
      setFileInfo('Failed to read file.')
    } finally {
      setFileLoading(false)
      e.target.value = ''
    }
  }, [])

  const handleDownloadResult = useCallback(() => {
    if (!result) return
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.b64' : 'decoded.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [result, mode])

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['encode', 'decode'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setFileInfo(null) }}
            className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-colors ${
              mode === m
                ? 'bg-accent text-white border-accent'
                : 'bg-bg text-text border-border hover:border-accent hover:text-accent'
            }`}
          >
            {m === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-text">
            {mode === 'encode' ? 'Text to encode' : 'Base64 string to decode'}
          </label>
          {mode === 'encode' && (
            <label className={`text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors ${fileLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              {fileLoading ? 'Loading...' : 'Encode a file →'}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>
        {fileInfo && (
          <div className="text-xs text-success bg-success/10 border border-success/20 rounded px-2 py-1 mb-2">
            {fileInfo}
          </div>
        )}
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setFileInfo(null) }}
          placeholder={
            mode === 'encode'
              ? 'Hello, World!'
              : 'SGVsbG8sIFdvcmxkIQ=='
          }
          rows={5}
          className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono"
          spellCheck={false}
        />
      </div>

      {/* Result */}
      {(result || error) && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-text">
              {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
            </label>
            {result && (
              <div className="flex items-center gap-3">
                <button onClick={handleSwap} className="text-xs text-muted hover:text-text transition-colors">
                  Use as input ↓
                </button>
                <button onClick={handleDownloadResult} className="text-xs text-accent hover:text-accent-hover transition-colors">
                  Download
                </button>
                <button onClick={handleCopy} className="text-xs text-accent hover:text-accent-hover transition-colors">
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
          {error ? (
            <div className="px-3 py-2.5 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={result}
              rows={5}
              className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none font-mono break-all"
            />
          )}
        </div>
      )}

      {result && mode === 'encode' && (
        <p className="text-xs text-muted">
          {input.length} chars → {result.length} Base64 chars
          {' '}(~{Math.round((result.length / (input.length || 1) - 1) * 100)}% larger)
        </p>
      )}
    </div>
  )
}
