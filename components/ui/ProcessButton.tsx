'use client'

interface ProcessButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode
}

export default function ProcessButton({
  onClick,
  loading = false,
  disabled = false,
  children = 'Process File',
}: ProcessButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'w-full h-12 rounded font-medium text-base text-white transition-all duration-150',
        'flex items-center justify-center gap-2',
        disabled
          ? 'bg-border text-muted cursor-not-allowed'
          : loading
          ? 'bg-accent cursor-wait'
          : 'bg-accent hover:bg-accent-hover active:scale-[0.99]',
      ].join(' ')}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  )
}
