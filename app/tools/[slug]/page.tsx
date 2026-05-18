import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { tools } from '@/lib/tools'
import { getToolFaqs } from '@/lib/faqs'
import ToolIcon from '@/components/ui/ToolIcon'
import ToolArea from '@/components/tools/ToolArea'
import { IMPLEMENTED_SLUGS } from '@/lib/implementedTools'

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)
  if (!tool) return {}

  return {
    title: `${tool.name} — Free Online Tool | Dokly`,
    description: `${tool.seoDescription} No limits, no watermarks, no account required. Completely free and works in your browser.`,
    openGraph: {
      title: `${tool.name} — Free & Unlimited | Dokly`,
      description: tool.seoDescription,
      url: `https://dokly.io/tools/${tool.slug}`,
      siteName: 'Dokly',
      type: 'website',
    },
    alternates: {
      canonical: `https://dokly.io/tools/${tool.slug}`,
    },
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)
  if (!tool) notFound()

  const faqs = getToolFaqs(slug, tool.name, tool.inputFormats, tool.outputFormat)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-text transition-colors">
          Home
        </Link>
        <span aria-hidden="true">›</span>
        <Link href="/tools" className="hover:text-text transition-colors">
          Tools
        </Link>
        <span aria-hidden="true">›</span>
        <span className="text-text font-medium">{tool.name}</span>
      </nav>

      {/* Heading */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
          <ToolIcon icon={tool.icon} size={20} />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-text">{tool.h1}</h1>
      </div>

      <p className="text-sm text-muted mb-6">
        {tool.seoDescription}
      </p>

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-xs text-muted bg-bg border border-border rounded px-3 py-2 mb-6">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 1a5 5 0 0 1 5 5v1h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 1 5-5z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        Your files never leave your device. All processing happens in your browser.
      </div>

      {/* Tool area */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <ToolArea slug={slug} />
        {!IMPLEMENTED_SLUGS.has(slug) && (
          <div className="text-center py-8">
            <ToolIcon icon={tool.icon} size={40} className="mx-auto text-border mb-3" />
            <p className="text-sm text-muted">
              <strong className="text-text">{tool.name}</strong> — coming soon.
            </p>
            <p className="text-xs text-muted mt-1">
              Accepts: {tool.inputFormats.join(', ')} → {tool.outputFormat}
            </p>
          </div>
        )}
      </div>

      {/* SEO content */}
      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-base font-bold text-text mb-3">
            How to use {tool.name}
          </h2>
          <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
            <li>Upload your {tool.inputFormats.join(' or ')} file by dragging and dropping or clicking to browse.</li>
            <li>Adjust any settings if available, then click the process button.</li>
            <li>Download your {tool.outputFormat} file instantly — no account required.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-bold text-text mb-3">
            Why use Dokly for {tool.name.toLowerCase()}?
          </h2>
          <ul className="space-y-2 text-sm text-muted list-disc list-inside">
            <li>Completely free — no task limits, no watermarks, no paywall.</li>
            <li>All processing happens in your browser — files never leave your device.</li>
            <li>Works on any device without installing software or creating an account.</li>
          </ul>
        </section>

        {/* FAQ section */}
        <section>
          <h2 className="text-base font-bold text-text mb-4">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-text mb-1.5">{faq.question}</h3>
                <p className="text-sm text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
