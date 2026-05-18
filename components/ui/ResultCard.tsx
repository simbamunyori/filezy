'use client'

interface ResultCardProps {
  downloadUrl: string
  fileName: string
  originalSize?: number
  resultSize?: number
  onReset: () => void
}

export default function ResultCard({
  downloadUrl,
  fileName,
  originalSize,
  resultSize,
  onReset,
}: ResultCardProps) {
  const savings =
    originalSize && resultSize && originalSize > resultSize
      ? Math.round((1 - resultSize / originalSize) * 100)
      : null

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16.667 5 7.5 14.167 3.333 10"
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-text">Done!</p>
            <p className="text-sm font-mono text-muted truncate mt-0.5">{fileName}</p>
            {originalSize && resultSize && (
              <p className="text-sm text-muted mt-1">
                <span className="font-mono">{formatBytes(originalSize)}</span>
                {' → '}
                <span className="font-mono text-success">{formatBytes(resultSize)}</span>
                {savings !== null && savings > 0 && (
                  <span className="ml-1 text-success font-medium">({savings}% smaller)</span>
                )}
              </p>
            )}
          </div>
        </div>

        <a
          href={downloadUrl}
          download={fileName}
          className="mt-5 w-full h-12 rounded bg-accent hover:bg-accent-hover text-white font-medium text-base flex items-center justify-center gap-2 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 1v10M4 7l4 4 4-4M2 13h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download
        </a>

        <button
          onClick={onReset}
          className="mt-3 w-full text-sm text-muted hover:text-text transition-colors text-center py-2"
        >
          Process another file
        </button>
      </div>

      <div className="border-t border-border px-6 py-3 bg-bg">
        <p className="text-xs text-muted text-center">Advertisement</p>
        <div className="h-16 flex items-center justify-center text-xs text-muted/40 font-mono">
          [AdSense unit]
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
