import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-sm font-bold text-text">
              Filezy<span className="text-accent">.</span>
            </Link>
            <p className="text-xs text-muted mt-1">
              Free online tools for everyone
            </p>
          </div>

          <nav className="flex items-center gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-text transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-text transition-colors">
              About
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">
            All processing happens in your browser — your files never leave your device.
          </p>
          <p className="text-xs text-muted">
            Built with pdf-lib · pdfjs-dist · browser-image-compression
          </p>
        </div>
      </div>
    </footer>
  )
}
