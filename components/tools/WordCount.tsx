'use client'

import { useState, useCallback } from 'react'

function computeStats(text: string) {
  const trimmed = text.trim()

  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const sentences = trimmed === '' ? 0 : (trimmed.match(/[^.!?]*[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0)
  const paragraphs = trimmed === '' ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (trimmed.length > 0 ? 1 : 0)
  const readingTimeSeconds = Math.ceil((words / 238) * 60)
  const readingTimeMin = Math.floor(readingTimeSeconds / 60)
  const readingTimeSec = readingTimeSeconds % 60

  let readingTime = '< 1 sec'
  if (readingTimeMin > 0) {
    readingTime = `${readingTimeMin} min${readingTimeMin !== 1 ? 's' : ''}`
    if (readingTimeSec > 0) readingTime += ` ${readingTimeSec}s`
  } else if (readingTimeSeconds > 0) {
    readingTime = `${readingTimeSeconds} sec`
  }

  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime }
}

export default function WordCount() {
  const [text, setText] = useState('')

  const stats = computeStats(text)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setText((ev.target?.result as string) ?? '')
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const statItems = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: stats.readingTime },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-text">Paste or type your text</label>
        <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
          Upload .txt file
          <input
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        rows={10}
        className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono"
        spellCheck={false}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-bg border border-border rounded-lg px-4 py-3 text-center"
          >
            <div className="text-xl font-bold text-accent tabular-nums">{item.value}</div>
            <div className="text-xs text-muted mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {text.length > 0 && (
        <button
          onClick={() => setText('')}
          className="text-xs text-muted hover:text-error transition-colors"
        >
          Clear text
        </button>
      )}
    </div>
  )
}
