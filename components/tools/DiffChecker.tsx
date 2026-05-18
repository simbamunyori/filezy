'use client'

import { useState, useCallback } from 'react'

type DiffType = 'equal' | 'added' | 'removed'

interface DiffLine {
  type: DiffType
  value: string
  lineNum?: number
}

function computeDiff(oldText: string, newText: string): { left: DiffLine[]; right: DiffLine[] } {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const m = oldLines.length
  const n = newLines.length

  // LCS DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  // Trace back to build diff
  const left: DiffLine[] = []
  const right: DiffLine[] = []
  let i = 0
  let j = 0
  let leftLine = 1
  let rightLine = 1

  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      left.push({ type: 'equal', value: oldLines[i], lineNum: leftLine++ })
      right.push({ type: 'equal', value: newLines[j], lineNum: rightLine++ })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      left.push({ type: 'removed', value: oldLines[i], lineNum: leftLine++ })
      right.push({ type: 'equal', value: '', lineNum: undefined })
      i++
    } else {
      left.push({ type: 'equal', value: '', lineNum: undefined })
      right.push({ type: 'added', value: newLines[j], lineNum: rightLine++ })
      j++
    }
  }
  while (i < m) {
    left.push({ type: 'removed', value: oldLines[i++], lineNum: leftLine++ })
    right.push({ type: 'equal', value: '', lineNum: undefined })
  }
  while (j < n) {
    left.push({ type: 'equal', value: '', lineNum: undefined })
    right.push({ type: 'added', value: newLines[j++], lineNum: rightLine++ })
  }

  return { left, right }
}

const LINE_STYLES: Record<DiffType, string> = {
  equal: 'bg-transparent text-text',
  added: 'bg-success/10 text-success',
  removed: 'bg-error/10 text-error',
}

const LINE_GUTTER: Record<DiffType, string> = {
  equal: 'text-muted',
  added: 'text-success font-medium',
  removed: 'text-error font-medium',
}

const LINE_PREFIX: Record<DiffType, string> = {
  equal: ' ',
  added: '+',
  removed: '−',
}

function DiffPanel({ lines, title }: { lines: DiffLine[]; title: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium text-muted px-3 py-1.5 bg-bg border border-border rounded-t-lg border-b-0">
        {title}
      </div>
      <div className="border border-border rounded-b-lg overflow-auto max-h-96 font-mono text-xs">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-stretch ${LINE_STYLES[line.value === '' ? 'equal' : line.type]}`}
          >
            <span
              className={`select-none shrink-0 w-8 text-right pr-2 py-0.5 border-r border-border/50 ${
                LINE_GUTTER[line.value === '' ? 'equal' : line.type]
              }`}
            >
              {line.lineNum ?? ''}
            </span>
            <span
              className={`shrink-0 w-5 text-center py-0.5 ${
                LINE_GUTTER[line.value === '' ? 'equal' : line.type]
              }`}
            >
              {line.value === '' ? '' : LINE_PREFIX[line.type]}
            </span>
            <span className="py-0.5 px-1 whitespace-pre overflow-x-auto">
              {line.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DiffChecker() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [diff, setDiff] = useState<{ left: DiffLine[]; right: DiffLine[] } | null>(null)
  const [summary, setSummary] = useState<{ added: number; removed: number } | null>(null)

  const handleCompare = useCallback(() => {
    const result = computeDiff(original, modified)
    setDiff(result)
    const added = result.right.filter((l) => l.type === 'added').length
    const removed = result.left.filter((l) => l.type === 'removed').length
    setSummary({ added, removed })
  }, [original, modified])

  const handleSwap = useCallback(() => {
    setOriginal(modified)
    setModified(original)
    setDiff(null)
    setSummary(null)
  }, [original, modified])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Original text</label>
          <textarea
            value={original}
            onChange={(e) => { setOriginal(e.target.value); setDiff(null); setSummary(null) }}
            placeholder="Paste the original text here..."
            rows={8}
            className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Modified text</label>
          <textarea
            value={modified}
            onChange={(e) => { setModified(e.target.value); setDiff(null); setSummary(null) }}
            placeholder="Paste the modified text here..."
            rows={8}
            className="w-full px-3 py-2.5 text-sm text-text bg-bg border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCompare}
          disabled={!original && !modified}
          className="flex-1 h-12 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors"
        >
          Compare
        </button>
        <button
          onClick={handleSwap}
          title="Swap original and modified"
          className="h-12 px-4 border border-border text-muted hover:text-text hover:border-accent transition-colors rounded-lg text-sm"
        >
          ⇄ Swap
        </button>
      </div>

      {summary && (
        <div className="flex gap-3">
          <div className="flex-1 text-center bg-success/10 border border-success/20 rounded-lg px-3 py-2">
            <div className="text-base font-bold text-success">+{summary.added}</div>
            <div className="text-xs text-muted">lines added</div>
          </div>
          <div className="flex-1 text-center bg-error/10 border border-error/20 rounded-lg px-3 py-2">
            <div className="text-base font-bold text-error">−{summary.removed}</div>
            <div className="text-xs text-muted">lines removed</div>
          </div>
          <div className="flex-1 text-center bg-bg border border-border rounded-lg px-3 py-2">
            <div className="text-base font-bold text-text">
              {summary.added === 0 && summary.removed === 0 ? '=' : summary.added - summary.removed > 0 ? `+${summary.added - summary.removed}` : summary.added - summary.removed}
            </div>
            <div className="text-xs text-muted">net change</div>
          </div>
        </div>
      )}

      {diff && (
        <div className="flex gap-2 overflow-x-auto">
          <DiffPanel lines={diff.left} title="Original" />
          <DiffPanel lines={diff.right} title="Modified" />
        </div>
      )}

      {diff && summary?.added === 0 && summary?.removed === 0 && (
        <div className="text-center py-4 text-sm text-success font-medium">
          ✓ The texts are identical.
        </div>
      )}
    </div>
  )
}
