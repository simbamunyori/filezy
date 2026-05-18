import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Compress a PDF for Free Online (Without Losing Quality) — Dokly',
  description:
    'Learn how to reduce PDF file size for free online. No uploads, no account, no quality loss. Compress any PDF instantly in your browser.',
  openGraph: {
    title: 'How to Compress a PDF for Free Online',
    description: 'Reduce PDF file size instantly — no account, no uploads, no quality loss.',
    url: 'https://dokly.io/blog/compress-pdf-free-online',
    siteName: 'Dokly',
    type: 'article',
  },
  alternates: {
    canonical: 'https://dokly.io/blog/compress-pdf-free-online',
  },
}

export default function CompressPdfBlogPage() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-accent">Blog</Link>
          <span className="mx-2">/</span>
          <span>Compress PDF Free Online</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-4">
            How to Compress a PDF for Free Online (Without Losing Quality)
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <time dateTime="2026-05-12">May 12, 2026</time>
            <span>·</span>
            <span>4 min read</span>
          </div>
        </header>

        {/* Article body */}
        <div className="prose-custom space-y-8 text-text">

          <p className="text-lg text-muted leading-relaxed">
            A PDF that was 2 MB last week is suddenly 18 MB because someone added a few slides with high-resolution screenshots. Email won&apos;t send it. Uploading to a portal fails. The file is too large to share. You&apos;ve been there.
          </p>

          <p className="leading-relaxed">
            PDF compression is one of those tasks that sounds technical but is actually straightforward once you understand what&apos;s happening. This guide explains the mechanics and shows you how to compress any PDF in under 30 seconds — for free, without uploading anything to a server.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">Why Are PDFs So Large?</h2>
            <p className="text-muted leading-relaxed mb-4">
              PDF size is almost always driven by images. A text-only PDF is tiny — a few kilobytes per page. The moment you embed a scanned image, a photograph, or a screenshot, you&apos;re potentially adding megabytes per page.
            </p>
            <p className="text-muted leading-relaxed">
              The culprit is usually the image compression settings at the time the PDF was created. Many applications embed images at their original resolution and quality — a 24 MP phone camera photo embedded at full quality in a single PDF page will be enormous. Compression works by re-encoding those embedded images at a lower quality level that is still perfectly readable on screen.

            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">What &ldquo;Lossy&rdquo; vs &ldquo;Lossless&rdquo; Compression Means</h2>
            <p className="text-muted leading-relaxed mb-4">
              <strong className="text-text">Lossless compression</strong> removes redundant data without affecting image quality — like zipping a file. The decompressed result is bit-for-bit identical to the original. This typically gives modest size reductions (5–20%).
            </p>
            <p className="text-muted leading-relaxed">
              <strong className="text-text">Lossy compression</strong> re-encodes images at a lower quality level. The output looks nearly identical to the human eye but is significantly smaller — often 60–85% smaller for image-heavy PDFs. For documents you&apos;re going to read on screen or print at standard sizes, the quality difference is invisible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">How to Compress a PDF in Your Browser</h2>
            <ol className="space-y-4 text-muted">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                <span>Open the <Link href="/tools/compress-pdf" className="text-accent hover:underline">Compress PDF tool</Link> on Dokly.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                <span>Drag your PDF onto the upload area, or click to select it from your device. The file never leaves your browser.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                <span>Choose a compression level: High quality (lighter compression), Medium (balanced — recommended), or Low (maximum compression).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
                <span>Click &ldquo;Compress PDF&rdquo;. Processing takes a few seconds. You&apos;ll see the before/after file size comparison, then download the result.</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">Realistic Results to Expect</h2>
            <p className="text-muted leading-relaxed mb-4">
              Results depend heavily on the content. For a PDF made from scanned documents or photographs, compression of 70–85% is common. For a PDF generated from a Word document with mostly text and a few charts, 10–30% is more realistic. For PDFs that are already compressed, you may see minimal reduction.
            </p>
            <p className="text-muted leading-relaxed">
              The tool shows you the exact before and after file sizes, so you always know whether the compression was worthwhile for your specific file.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">A Note on Privacy</h2>
            <p className="text-muted leading-relaxed">
              Most online PDF compressors upload your file to a remote server, run the compression there, and send the result back. Dokly works differently: the entire compression process happens in your browser using JavaScript. Your document never touches our servers — or anyone else&apos;s. For sensitive documents (contracts, medical records, financial statements), this matters.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-surface border border-border rounded-lg text-center">
          <p className="font-semibold text-text mb-2">Ready to compress your PDF?</p>
          <p className="text-sm text-muted mb-4">Free, unlimited, no account required. Your file stays in your browser.</p>
          <Link
            href="/tools/compress-pdf"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Compress PDF Now
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8">
          <Link href="/blog" className="text-sm text-accent hover:underline">
            ← Back to Blog
          </Link>
        </div>

      </div>
    </div>
  )
}
