import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dokly vs TinyWow: No CAPTCHAs, Clean Interface, Truly Free',
  description:
    'Compare Dokly and TinyWow. Dokly has no CAPTCHAs, no AI task limits, and a clean focused interface — not 250+ cluttered tools with constant friction.',
  openGraph: {
    title: 'Dokly vs TinyWow — No CAPTCHAs, No Clutter',
    description:
      'TinyWow requires a CAPTCHA on every task and limits AI tools daily. Dokly removes all friction — just tools that work.',
    url: 'https://dokly.io/alternatives/tinywow',
    siteName: 'Dokly',
    type: 'website',
  },
  alternates: {
    canonical: 'https://dokly.io/alternatives/tinywow',
  },
}

const comparisonRows = [
  { feature: 'CAPTCHA required', dokly: 'Never', competitor: 'Every single task' },
  { feature: 'Daily AI tool limits', dokly: 'Unlimited', competitor: 'Restricted daily quota' },
  { feature: 'Interface clarity', dokly: 'Focused, tool-first design', competitor: '250+ tools, cluttered navigation' },
  { feature: 'Account required', dokly: 'No', competitor: 'Required for some features' },
  { feature: 'Files uploaded to server', dokly: 'Never — browser only', competitor: 'Uploaded for processing' },
  { feature: 'Mobile experience', dokly: 'Mobile-first design', competitor: 'Desktop-oriented, cramped on mobile' },
  { feature: 'Ad frequency', dokly: 'One ad on result screen only', competitor: 'Ads throughout the interface' },
]

const features = [
  { title: 'Zero CAPTCHAs', description: 'Not now, not ever. CAPTCHAs break flow and signal distrust. Dokly never shows one.' },
  { title: 'Focused Tool Set', description: 'The 30 tools you actually use, built well — not 250+ tools built quickly.' },
  { title: 'Unlimited AI Tools', description: 'Background removal and other AI features run in your browser with no daily quota.' },
  { title: 'Mobile-First', description: 'Every tool is designed for phones first. Upload, process, download — all from your thumb.' },
  { title: 'No Server Upload', description: 'Your files stay in your browser. No CAPTCHA needed when there\'s no server to protect.' },
  { title: 'Instant Processing', description: 'Client-side processing means results appear in seconds without waiting for a server queue.' },
]

export default function TinywowAlternativePage() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <span>Dokly vs TinyWow</span>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl font-bold text-text mb-4">
          Dokly vs TinyWow: No CAPTCHAs, Clean Interface, Truly Free
        </h1>
        <p className="text-lg text-muted mb-12 max-w-2xl">
          TinyWow makes you solve a CAPTCHA before every single task and limits AI features to a daily quota. Dokly removes all that friction — just open a tool and use it.
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
                  <th className="text-left px-6 py-4 font-semibold text-muted">TinyWow (Free)</th>
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

        {/* Why no CAPTCHA */}
        <section className="mb-16 bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-3">Why Dokly Never Needs a CAPTCHA</h2>
          <p className="text-muted mb-4">
            CAPTCHAs exist to protect servers from bot abuse — when your service has server-side processing costs, bots hammering your API are a real problem. Dokly sidesteps this entirely: every tool runs in your browser using JavaScript and WebAssembly. There is no server processing pipeline to protect, so there is no need for a CAPTCHA.
          </p>
          <p className="text-muted">
            This isn&apos;t a policy decision — it&apos;s a structural one. The same architecture that makes Dokly free to run also makes it friction-free to use.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-xl font-semibold text-text mb-3">No CAPTCHA. No Wait. Just Tools.</h2>
          <p className="text-muted mb-6">Open any tool and start working immediately — no verification, no account.</p>
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
