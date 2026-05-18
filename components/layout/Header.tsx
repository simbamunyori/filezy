'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchModal from '@/components/ui/SearchModal'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-base font-bold text-text tracking-tight">
              Filezy
              <span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/tools?category=pdf">PDF Tools</NavLink>
            <NavLink href="/tools?category=image">Image Tools</NavLink>
            <NavLink href="/tools?category=text">Text Tools</NavLink>
            <NavLink href="/tools">All Tools</NavLink>
          </nav>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted bg-bg border border-border rounded hover:border-accent/50 transition-colors"
            aria-label="Search tools"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12ZM13 13l2 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline text-xs bg-border px-1 py-0.5 rounded font-mono">⌘K</kbd>
          </button>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-sm text-muted hover:text-text rounded transition-colors hover:bg-bg"
    >
      {children}
    </Link>
  )
}
