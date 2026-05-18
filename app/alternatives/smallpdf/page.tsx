import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dokly vs Smallpdf: Free, Unlimited PDF Tools Without the Paywall',
  description:
    'Compare Dokly and Smallpdf. Dokly offers unlimited free PDF tools with no task caps, no watermarks, and no account required — everything Smallpdf charges for.',
  openGraph: {
    title: 'Dokly vs Smallpdf — No Limits, No Paywall',
    description:
      'Dokly gives you everything Smallpdf does — for free, forever, with zero restrictions.',
    url: 'https://dokly.io/alternatives/smallpdf',
    siteName: 'Dokly',
    type: 'website',
  },
  alternates: {
    canonical: 'https://dokly.io/alternatives/smallpdf',
  },
}

const comparisonRows = [
  { feature: 'Free tasks per hour', dokly: 'Unlimited', competitor: '2 tasks/hour' },
  { feature: 'Watermarks on output', dokly: 'Never', competitor: 'Yes, on free tier' },
  { feature: 'Account required', dokly: 'No', competitor: 'Required for most features' },
  { feature: 'File size limit (free)', dokly: 'None', competitor: 'Limited on free tier' },
  { feature: 'Files uploaded to server', dokly: 'Never — browser only', competitor: 'Yes, uploaded to cloud' },
  { feature: 'CAPTCHA', dokly: 'Never', competitor: 'Occasional' },
  { feature: 'Price for unlimited', dokly: 'Free forever', competitor: '$12/month' },
]

const features = [
  { title: 'Truly Unlimited', description: 'Process as many files as you need. No hourly caps, no daily limits, no cooldowns.' },
  { title: 'No Account Needed', description: 'Jump straight to your tool. No sign-up, no email, no password.' },
  { title: 'Zero Watermarks', description: 'Every file you download is clean. No Dokly branding ever added to your output.' },
  { title: 'Browser-Only Processing', description: 'Your files never leave your device. All processing happens locally in your browser.' },
  { title: 'No Paywall', description: 'Every tool is free. No premium tier, no "upgrade to continue" interruptions.' },
  { title: 'Instant Results', description: 'Client-side processing means your files are ready in seconds, not minutes.' },
]

export default function SmallpdfAlternativePage() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <span>Dokly vs Smallpdf</span>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl font-bold text-text mb-4">
          Dokly vs Smallpdf: Free, Unlimited PDF Tools Without the Paywall
        </h1>
        <p className="text-lg text-muted mb-12 max-w-2xl">
          Smallpdf limits free users to 2 tasks per hour, adds watermarks, and pushes a $12/month subscription. Dokly gives you the same tools — unlimited, free, forever.
        </p>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-text mb-6">Side-by-Side Comparison</h2>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-6 py-4 font-semibold text-text">Feature</th>
                  <th className="text-left px-6 py-4 font-semibold text-accent">Dokly</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted">Smallpdf (Free)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-surface' : 'bg-bg'}>
                    <td className="px-6 py-4 text-text font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-success font-medium">{row.dokly}</td>
                    <td className="px-6 py-4 text-muted">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-text mb-6">Why Dokly is the Better Free Alternative</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-text mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy note */}
        <section className="mb-16 bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-3">Your Files Stay on Your Device</h2>
          <p className="text-muted">
            Smallpdf uploads your documents to their servers for processing. Dokly is different: every operation — merging, compressing, splitting — runs entirely in your browser using JavaScript. Your files never touch our servers because we don&apos;t have any processing servers. This isn&apos;t a marketing claim; you can verify it yourself by opening your browser&apos;s Network tab while using any Dokly tool.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-xl font-semibold text-text mb-3">Ready to Switch?</h2>
          <p className="text-muted mb-6">Browse all free PDF and file tools — no account, no limits.</p>
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
