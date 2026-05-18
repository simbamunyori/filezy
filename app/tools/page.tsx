import type { Metadata } from 'next'
import ToolCard from '@/components/ui/ToolCard'
import { tools, toolsByCategory, categoryLabels, type ToolCategory } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'All Tools — Filezy',
  description:
    'Browse all free online tools on Filezy. PDF tools, image tools, text tools — all free, unlimited, no account required.',
}

const CATEGORIES: ToolCategory[] = ['pdf', 'image', 'text', 'converter']

export default function AllToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">All Tools</h1>
        <p className="text-sm text-muted mt-1">
          {tools.length} free tools — no account, no limits, no watermarks.
        </p>
      </div>

      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const catTools = toolsByCategory(cat)
          if (catTools.length === 0) return null
          return (
            <section key={cat}>
              <h2 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">
                {categoryLabels[cat]}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
