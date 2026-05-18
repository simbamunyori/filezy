import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Remove the Background From Any Image — Free, No App Required — Dokly',
  description:
    'Remove image backgrounds for free using AI — no Photoshop, no subscription, no uploads. Works entirely in your browser in seconds.',
  openGraph: {
    title: 'Remove Image Background Free — No App, No Upload',
    description: 'AI background removal in your browser. Free, instant, no account needed.',
    url: 'https://dokly.io/blog/remove-background-from-image-free',
    siteName: 'Dokly',
    type: 'article',
  },
  alternates: {
    canonical: 'https://dokly.io/blog/remove-background-from-image-free',
  },
}

export default function RemoveBackgroundBlogPage() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-accent">Blog</Link>
          <span className="mx-2">/</span>
          <span>Remove Background From Image Free</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-4">
            How to Remove the Background From Any Image — Free, No App Required
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <time dateTime="2026-05-15">May 15, 2026</time>
            <span>·</span>
            <span>3 min read</span>
          </div>
        </header>

        {/* Article body */}
        <div className="space-y-8 text-text">

          <p className="text-lg text-muted leading-relaxed">
            Background removal was once a time-consuming Photoshop task or an expensive subscription feature. AI changed that. Today you can remove the background from any image in seconds — and you don&apos;t need an app, an account, or a credit card.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">How AI Background Removal Works</h2>
            <p className="text-muted leading-relaxed mb-4">
              Modern background removal uses a neural network trained to distinguish foreground subjects (people, objects, products) from backgrounds. The model examines each pixel and predicts whether it belongs to the subject or the background, then generates an alpha mask — essentially a grayscale map of what to keep and what to remove.
            </p>
            <p className="text-muted leading-relaxed">
              The result is a PNG file with a transparent background, ready to place on any color or new background. Quality depends on image contrast and edge complexity, but for most photos — portraits, product shots, logos — results are excellent without any manual editing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">Step-by-Step: Remove a Background in Your Browser</h2>
            <ol className="space-y-4 text-muted">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                <span>Go to the <Link href="/tools/remove-background" className="text-accent hover:underline">Remove Background tool</Link>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                <span>Upload your image (JPG or PNG). On your first use, the AI model downloads once (~5 MB) and is cached in your browser — subsequent uses are instant.</span>

              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                <span>Wait a few seconds while the model processes your image. You&apos;ll see a before/after preview of the result.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
                <span>Download the PNG with a transparent background. It&apos;s ready to use in any design tool, presentation, or website.</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">What Types of Images Work Best</h2>
            <p className="text-muted leading-relaxed mb-4">
              The AI model performs best when there is clear contrast between the subject and background. Portraits against plain walls, product photos on white backgrounds, and logos on solid colors all produce near-perfect results. Complex scenes with similar colors between subject and background (a green jacket against a forest, for example) may require some manual touch-up.
            </p>
            <p className="text-muted leading-relaxed">
              For e-commerce product photos and professional headshots — the two most common use cases — automatic results are typically clean enough to use without any editing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">Why This Runs in Your Browser</h2>
            <p className="text-muted leading-relaxed">
              Dokly uses <code className="text-sm bg-bg px-1.5 py-0.5 rounded border border-border">@imgly/background-removal</code>, a library that runs the segmentation model entirely in WebAssembly inside your browser. No image data is sent to a server. For anyone processing photos of people, documents, or confidential product images, this is a meaningful privacy advantage over services that process your photos on their cloud infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text mt-10 mb-4">Common Uses for Transparent Backgrounds</h2>
            <ul className="space-y-2 text-muted">
              <li className="flex gap-2"><span className="text-accent">·</span><span>E-commerce product listings — white or custom background required by most marketplaces</span></li>
              <li className="flex gap-2"><span className="text-accent">·</span><span>Professional headshots for LinkedIn, websites, or company directories</span></li>
              <li className="flex gap-2"><span className="text-accent">·</span><span>Logo files for use on different colored backgrounds or materials</span></li>
              <li className="flex gap-2"><span className="text-accent">·</span><span>Presentation graphics where you want an image to float over a slide background</span></li>
              <li className="flex gap-2"><span className="text-accent">·</span><span>Social media profile photos with a custom or branded background</span></li>
            </ul>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-surface border border-border rounded-lg text-center">
          <p className="font-semibold text-text mb-2">Try it on your image now</p>
          <p className="text-sm text-muted mb-4">AI background removal, free and unlimited. No account. Your image stays in your browser.</p>
          <Link
            href="/tools/remove-background"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Remove Background Free
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="text-sm text-accent hover:underline">
            ← Back to Blog
          </Link>
        </div>

      </div>
    </div>
  )
}
