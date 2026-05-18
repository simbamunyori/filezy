'use client'

import { useCallback, useRef, useState } from 'react'

interface DropZoneProps {
  onFiles: (files: File[]) => void
  accept?: string[]
  multiple?: boolean
  label?: string
}

export default function DropZone({
  onFiles,
  accept = [],
  multiple = false,
  label = 'Drag & drop your file here',
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) onFiles(multiple ? files : [files[0]])
    },
    [onFiles, multiple]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) onFiles(multiple ? files : [files[0]])
      e.target.value = ''
    },
    [onFiles, multiple]
  )

  const acceptString = accept.map((ext) => `.${ext.toLowerCase()}`).join(',')

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        'min-h-[280px] rounded-lg border-2 border-dashed cursor-pointer',
        'flex flex-col items-center justify-center gap-3 p-8 text-center',
        'transition-all duration-150 select-none',
        isDragging
          ? 'border-accent bg-[#EFF6FF]'
          : 'border-border bg-surface hover:border-accent/40 hover:bg-bg',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={acceptString || undefined}
        multiple={multiple}
        onChange={handleChange}
        tabIndex={-1}
      />

      <div
        className={[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          isDragging ? 'bg-accent/10' : 'bg-bg',
        ].join(' ')}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={isDragging ? 'text-accent' : 'text-muted'}
          aria-hidden="true"
        >
          <path
            d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M12 4v12M8 8l4-4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <p className="text-base font-medium text-text">{label}</p>
        <p className="text-sm text-muted mt-1">or click to browse</p>
      </div>

      {accept.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-1">
          {accept.map((ext) => (
            <span
              key={ext}
              className="text-xs px-2 py-0.5 bg-bg border border-border rounded font-mono text-muted"
            >
              {ext.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

interface FilePreviewProps {
  file: File
  onRemove?: () => void
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/')
  const [previewUrl] = useState(() =>
    isImage ? URL.createObjectURL(file) : null
  )
  const sizeLabel = formatBytes(file.size)

  return (
    <div className="flex items-center gap-3 p-3 bg-bg border border-border rounded-lg">
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.name}
          className="w-10 h-10 object-cover rounded"
        />
      ) : (
        <div className="w-10 h-10 bg-surface border border-border rounded flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M14 2v6h6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate font-mono">{file.name}</p>
        <p className="text-xs text-muted">{sizeLabel}</p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-muted hover:text-error transition-colors p-1 rounded"
          aria-label="Remove file"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
