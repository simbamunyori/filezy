'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { tools } from '@/lib/tools'
import ToolIcon from './ToolIcon'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!open) onClose()
      }
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const results = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : tools.slice(0, 8)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-text/30 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted shrink-0" aria-hidden="true">
            <path d="M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12ZM13 13l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 h-12 bg-transparent text-base text-text placeholder-muted outline-none"
          />
          <kbd className="text-xs bg-bg border border-border px-1.5 py-0.5 rounded font-mono text-muted">
            ESC
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-sm text-muted text-center">No tools found</li>
          ) : (
            results.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg transition-colors text-sm"
                >
                  <span className="text-muted">
                    <ToolIcon icon={tool.icon} size={16} />
                  </span>
                  <span className="font-medium text-text">{tool.name}</span>
                  <span className="text-muted text-xs ml-auto">{tool.category}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
