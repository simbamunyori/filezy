interface ToolIconProps {
  icon: string
  size?: number
  className?: string
}

const iconPaths: Record<string, string> = {
  merge:
    'M8 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M16 3h-4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M12 8h4M12 12h4M4 8h4M4 12h4',
  compress:
    'M12 2v6m0 0 3-3m-3 3-3-3M12 22v-6m0 0 3 3m-3-3-3 3M2 12h6m0 0-3 3m3-3-3-3M22 12h-6m0 0 3 3m-3-3 3-3',
  split:
    'M4 4h6v16H4zM14 4h6v16h-6zM10 12h4',
  'pdf-to-word':
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 17l1.5-6L12 16l1.5-5L15 17',
  'word-to-pdf':
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M8 13h8M8 17h5',
  'pdf-to-image':
    'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm3 9 3-3 2 2 3-4 3 5H7z',
  'image-to-pdf':
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM8 15l3-3 2 2 3-4 2 5H8z',
  rotate:
    'M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38',
  unlock:
    'M8 11V7a4 4 0 0 1 8 0M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
  lock:
    'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v13H2zM6 8V5a3 3 0 0 1 6 0v3',
  watermark:
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'compress-image':
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  resize:
    'M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7',
  convert:
    'M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4',
  crop:
    'M6.13 1L6 16a2 2 0 0 0 2 2h15M1 6.13l15-.13',
  'remove-bg':
    'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-9H7l5-8 5 8h-4v5h-2v-5z',
  'word-count':
    'M4 6h16M4 10h16M4 14h8M4 18h8',
  case:
    'M4 19V5M20 19V5M4 12h16M9 5v14M15 5v14',
  dedup:
    'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  diff:
    'M4 6h16M4 10h16M4 14h8M12 18h8M4 18h4',
  url:
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  base64:
    'M7 7h.01M7 12h.01M7 17h.01M11 7h6M11 12h6M11 17h6',
  default:
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6',
}

export default function ToolIcon({ icon, size = 24, className = '' }: ToolIconProps) {
  const path = iconPaths[icon] ?? iconPaths.default

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}
