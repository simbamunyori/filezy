import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Dokly',
  description:
    'Tips, guides, and how-tos for working with PDFs, images, and files — all free tools, all in your browser.',
  alternates: {
    canonical: 'https://dokly.io/blog',
  },
}

const articles = [
  {
    slug: 'compress-pdf-free-online',
    title: 'How to Compress a PDF for Free Online (Without Losing Quality)',
    description:
      'A practical guide to reducing PDF file size — why it matters, how compression works, and how to do it instantly in your browser.',
    date: 'May 12, 2026',
    readTime: '4 min read',
  },
  {
    slug: 'remove-background-from-image-free',
    title: 'How to Remove the Background From Any Image — Free, No App Required',
    description:
      'AI background removal used to require expensive software or subscriptions. Here\'s how to do it in seconds, entirely in your browser.',
    date: 'May 15, 2026',
    readTime: '3 min read',
  },
  {
    slug: 'pdf-tools-without-uploading-files',
    title: 'Why the Best PDF Tools Don\'t Upload Your Files',
    description:
      'Most PDF tools send your documents to a remote server. Here\'s why that\'s a privacy risk — and how browser-based tools solve it.',
    date: 'May 18, 2026',
    readTime: '5 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <h1 className="text-3xl font-bold text-text mb-3">Blog</h1>
        <p className="text-muted mb-12">Guides and tips for working with files, PDFs, and images — all free tools.</p>

        <div className="space-y-8">
          {articles.map((article) => (
            <article key={article.slug} className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors">
              <Link href={`/blog/${article.slug}`} className="block group">
                <h2 className="text-lg font-semibold text-text group-hover:text-accent transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted mb-4">{article.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}
