import Link from 'next/link'
import type { Tool } from '@/lib/tools'
import ToolIcon from './ToolIcon'

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col gap-3 p-4 bg-surface border border-border rounded-lg
                 shadow-card hover:shadow-card-hover transition-all duration-150
                 hover:border-l-accent border-l-[3px] border-l-transparent"
    >
      <div className="w-8 h-8 flex items-center justify-center text-muted group-hover:text-accent transition-colors">
        <ToolIcon icon={tool.icon} size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-text leading-tight">{tool.name}</p>
        <p className="text-xs text-muted mt-1 leading-snug line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>
    </Link>
  )
}
