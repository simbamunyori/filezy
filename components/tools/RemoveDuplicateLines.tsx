'use client'

import { useState, useCallback } from 'react'

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<{ total: number; unique: number; removed: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleProcess = useCallback(() => {
    const lines = input.split('\n')
    const seen = new Set<string>()
    const result: string[] = []

    for (const line of lines) {
      const normalized = trimWhitespace ? line.trim() : line
      const key = caseSensitive ? normalized : normalized.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        result.push(trimWhitespace ? normalized : line)
      }
    }

    const removed = lines.length - result.length
    setOutput(result.join('\n'))
    setStats({ total: lines.length, unique: result.length, removed })
  }, [input, caseSensitive, trimWhitespace])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'deduplicated.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setInput((ev.target?.result as string) ?? '')
      setOutput('')
      setStats(null)
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-text">Input text (one item per line)</label>
          <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
            Upload .txt
            <input type="file" accept=".txt,text/plain" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(''); setStats(null) }}
          placeholder={'apple\nbanana\napple\norange\nbanana'}
          rows={8}
          className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="accent-accent"
          />
          <span className="text-text">Case-sensitive</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimWhitespace}
            onChange={(e) => setTrimWhitespace(e.target.checked)}
            className="accent-accent"
          />
          <span className="text-text">Trim whitespace</span>
        </label>
      </div>

      <button
        onClick={handleProcess}
        disabled={!input.trim()}
        className="w-full h-12 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors"
      >
        Remove Duplicate Lines
      </button>

      {stats && (
        <div className="flex gap-3 text-center">
          {[
            { label: 'Total lines', value: stats.total },
            { label: 'Unique lines', value: stats.unique },
            { label: 'Removed', value: stats.removed },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-bg border border-border rounded-lg px-3 py-2">
              <div className="text-lg font-bold text-accent tabular-nums">{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-text">Result</label>
            <div className="flex items-center gap-3">
              <button onClick={handleCopy} className="text-xs text-accent hover:text-accent-hover transition-colors">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="text-xs text-accent hover:text-accent-hover transition-colors">
                Download .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none font-mono"
          />
        </div>
      )}
    </div>
  )
}
