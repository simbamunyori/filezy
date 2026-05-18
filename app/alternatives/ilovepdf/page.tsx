import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Filezy vs iLovePDF: Unlimited Free PDF Tools With No File Size Cap',
  description:
    'Compare Filezy and iLovePDF. Filezy has no 15 MB file size limit, no daily task caps, no ads interrupting your workflow — just unlimited free PDF tools.',
  openGraph: {
    title: 'Filezy vs iLovePDF — No File Size Cap, No Limits',
    description:
      'iLovePDF caps free uploads at 15 MB and restricts daily tasks. Filezy removes all those limits for free.',
    url: 'https://filezy.io/alternatives/ilovepdf',
    siteName: 'Filezy',
    type: 'website',
  },
  alternates: {
    canonical: 'https://filezy.io/alternatives/ilovepdf',
  },
}

const comparisonRows = [
  { feature: 'File size limit (free)', filezy: 'None', competitor: '15 MB per file' },
  { feature: 'Daily task limit', filezy: 'Unlimited', competitor: 'Restricted on free tier' },
  { feature: 'Ad interruptions', filezy: 'One ad on result screen only', competitor: 'Heavy ad placement throughout' },
  { feature: 'Account required', filezy: 'No', competitor: 'Required for full access' },
  { feature: 'Files uploaded to server', filezy: 'Never — browser only', competitor: 'Uploaded to iLovePDF servers' },
  { feature: 'Watermarks on free output', filezy: 'Never', competitor: 'Added on some free operations' },
  { feature: 'Price to remove limits', filezy: 'Free forever', competitor: '$6.61/month' },
]

const features = [
  { title: 'No File Size Cap', description: 'Process PDFs of any size. A 200 MB document works exactly the same as a 1 MB one.' },
  { title: 'No Daily Limits', description: 'Need to process 50 files today? Go ahead. No counters, no resets, no waiting.' },
  { title: 'Minimal Ads', description: 'One clearly labeled ad appears only on the download screen — never during your workflow.' },
  { title: 'No Account, Ever', description: 'Use every tool instantly. No registration, no verification email, no profile.' },
  { title: 'Private by Design', description: 'Files are processed in your browser. Nothing is sent to any server.' },
  { title: 'Clean, Fast Interface', description: 'Purpose-built UI with no clutter. Find your tool, upload your file, download the result.' },
]

export default function IlovepdfAlternativePage() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <span>Filezy vs iLovePDF</span>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl font-bold text-text mb-4">
          Filezy vs iLovePDF: Unlimited Free PDF Tools With No File Size Cap
        </h1>
        <p className="text-lg text-muted mb-12 max-w-2xl">
          iLovePDF&apos;s free tier caps file sizes at 15 MB and limits daily tasks. Filezy removes every restriction — no file size limits, no daily caps, no account required.
        </p>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-text mb-6">Side-by-Side Comparison</h2>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-6 py-4 font-semibold text-text">Feature</th>
                  <th className="text-left px-6 py-4 font-semibold text-accent">Filezy</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted">iLovePDF (Free)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-surface' : 'bg-bg'}>
                    <td className="px-6 py-4 text-text font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-success font-medium">{row.filezy}</td>
                    <td className="px-6 py-4 text-muted">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-text mb-6">Why Filezy is the Better Free Alternative</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-text mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The 15 MB problem */}
        <section className="mb-16 bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-3">The 15 MB Problem</h2>
          <p className="text-muted mb-4">
            A 15 MB file size cap sounds reasonable until you try to compress a scanned document or merge a presentation with embedded images. Real-world PDFs routinely exceed this limit, turning a &ldquo;free&rdquo; tool into a constant paywall prompt.
          </p>
          <p className="text-muted">
            Filezy has no file size limit because processing happens in your browser. Your computer&apos;s memory is the only constraint — and modern devices handle large PDFs without issue. You can merge a 500 MB PDF collection just as easily as a 2 MB one.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-xl font-semibold text-text mb-3">Try It Now — No Sign-Up Required</h2>
          <p className="text-muted mb-6">All PDF tools, completely free, with no size limits or daily caps.</p>
          <Link
            href="/tools"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Explore All Tools
          </Link>
        </section>

      </div>
    </div>
  )
}
