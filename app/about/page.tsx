import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Filezy',
  description: 'About Filezy — free online tools for PDF, image, and text processing.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-text mb-6">About Filezy</h1>
      <div className="space-y-4 text-sm text-muted leading-relaxed">
        <p>
          Filezy is a suite of free online tools for working with PDFs, images, and text.
          We built it because every other tool online either puts a task cap on the free tier,
          adds watermarks to your output, or nags you to create an account.
        </p>
        <p>
          Everything on Filezy runs entirely in your browser — no uploads, no servers, no waiting.
          Your files are processed instantly using modern browser APIs and open-source libraries,
          then downloaded directly to your device.
        </p>
        <p>
          The tools are genuinely unlimited, genuinely free, and genuinely private.
        </p>
      </div>
    </div>
  )
}
