'use client'

import { useState, useCallback } from 'react'

type Mode = 'encode' | 'decode'

function processURL(text: string, mode: Mode): { result: string; error: string | null } {
  try {
    const result = mode === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text)
    return { result, error: null }
  } catch {
    return { result: '', error: mode === 'decode' ? 'Invalid encoded URL — check for malformed percent-encoding.' : 'Encoding failed.' }
  }
}

const EXAMPLES = [
  { label: 'URL with spaces', value: 'https://example.com/search?q=hello world&lang=en' },
  { label: 'Special characters', value: 'name=John Doe&email=john@example.com' },
  { label: 'Unicode text', value: 'café au lait, résumé, naïve' },
]

export default function URLEncoder() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [copied, setCopied] = useState(false)

  const { result, error } = input ? processURL(input, mode) : { result: '', error: null }

  const handleCopy = useCallback(async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  const handleSwap = useCallback(() => {
    if (result) {
      setInput(result)
      setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    }
  }, [result])

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['encode', 'decode'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-colors ${
              mode === m
                ? 'bg-accent text-white border-accent'
                : 'bg-bg text-text border-border hover:border-accent hover:text-accent'
            }`}
          >
            {m === 'encode' ? 'Encode URL' : 'Decode URL'}
          </button>
        ))}
      </div>

      {/* Example presets */}
      <div>
        <span className="text-xs text-muted mr-2">Try example:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => { setInput(ex.value); setMode('encode') }}
            className="text-xs text-accent hover:text-accent-hover mr-3 transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          {mode === 'encode' ? 'Text or URL to encode' : 'Encoded URL to decode'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? 'https://example.com/path?q=hello world'
              : 'https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world'
          }
          rows={4}
          className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono"
          spellCheck={false}
        />
      </div>

      {/* Result */}
      {(result || error) && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-text">
              {mode === 'encode' ? 'Encoded result' : 'Decoded result'}
            </label>
            {result && (
              <div className="flex items-center gap-3">
                <button onClick={handleSwap} className="text-xs text-muted hover:text-text transition-colors">
                  Use as input ↓
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
              rows={4}
              className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none font-mono"
            />
          )}
        </div>
      )}

      {/* Info note */}
      <p className="text-xs text-muted">
        Uses <code className="font-mono">encodeURIComponent</code> / <code className="font-mono">decodeURIComponent</code> — encodes all characters except{' '}
        <code className="font-mono">A–Z a–z 0–9 - _ . ! ~ * &apos; ( )</code>.
      </p>
    </div>
  )
}
