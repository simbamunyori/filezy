'use client'

interface ProgressBarProps {
  progress: number
  label?: string
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted">{label}</p>
          <p className="text-sm font-mono text-muted">{clamped}%</p>
        </div>
      )}
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
