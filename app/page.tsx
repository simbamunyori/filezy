import Link from 'next/link'
import ToolCard from '@/components/ui/ToolCard'
import { tools, featuredTools, toolsByCategory, categoryLabels, type ToolCategory } from '@/lib/tools'

const CATEGORIES: ToolCategory[] = ['pdf', 'image', 'text', 'converter']

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-[48px] font-bold text-text leading-tight tracking-tight">
            Every tool you need.{' '}
            <span className="text-accent">Free.</span>{' '}
            Forever.
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            No limits. No watermarks. No account. Just tools that work.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 h-12 px-6 bg-accent hover:bg-accent-hover text-white rounded font-medium transition-colors text-base"
            >
              Browse all tools
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Featured Tools</h2>
          <Link href="/tools" className="text-sm text-accent hover:text-accent-hover transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const catTools = toolsByCategory(cat)
        if (catTools.length === 0) return null
        return (
          <section key={cat} className="max-w-7xl mx-auto px-4 py-8 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text">
                {categoryLabels[cat]}{' '}
                <span className="text-sm font-normal text-muted">({catTools.length} tools)</span>
              </h2>
              <Link
                href={`/tools?category=${cat}`}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {catTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Trust Bar */}
      <section className="border-t border-border bg-surface mt-8">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted">
            <TrustItem icon="🔒" text="Files never leave your device" />
            <TrustItem icon="⚡" text="Instant in-browser processing" />
            <TrustItem icon="✓" text="No account needed" />
            <TrustItem icon="∞" text="Truly unlimited — no task caps" />
          </ul>
        </div>
      </section>
    </>
  )
}

function TrustItem({ icon, text }: { icon: string; text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </li>
  )
}
