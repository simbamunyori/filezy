'use client'

import { useState, useCallback } from 'react'

type CaseOption = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab'

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}

function toSnakeCase(str: string): string {
  return str
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase()
}

function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

function convertCase(text: string, mode: CaseOption): string {
  switch (mode) {
    case 'upper': return text.toUpperCase()
    case 'lower': return text.toLowerCase()
    case 'title': return toTitleCase(text)
    case 'sentence': return toSentenceCase(text)
    case 'camel': return toCamelCase(text)
    case 'snake': return toSnakeCase(text)
    case 'kebab': return toKebabCase(text)
  }
}

const CASES: { id: CaseOption; label: string; example: string }[] = [
  { id: 'upper', label: 'UPPER CASE', example: 'HELLO WORLD' },
  { id: 'lower', label: 'lower case', example: 'hello world' },
  { id: 'title', label: 'Title Case', example: 'Hello World' },
  { id: 'sentence', label: 'Sentence case', example: 'Hello world.' },
  { id: 'camel', label: 'camelCase', example: 'helloWorld' },
  { id: 'snake', label: 'snake_case', example: 'hello_world' },
  { id: 'kebab', label: 'kebab-case', example: 'hello-world' },
]

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<CaseOption>('upper')
  const [copied, setCopied] = useState(false)

  const output = input ? convertCase(input, selected) : ''

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
    a.download = `converted-${selected}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [output, selected])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Input text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here..."
          rows={6}
          className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          spellCheck={false}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Choose conversion</label>
        <div className="flex flex-wrap gap-2">
          {CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              title={c.example}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                selected === c.id
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg text-text border-border hover:border-accent hover:text-accent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-text">Result</label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="text-xs text-accent hover:text-accent-hover transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="text-xs text-accent hover:text-accent-hover transition-colors"
              >
                Download .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none font-mono"
          />
        </div>
      )}
    </div>
  )
}
