import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dokly',
  description: 'Dokly privacy policy. Your files are processed in your browser and never uploaded to any server.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-text mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-muted leading-relaxed">
        <p>
          <strong className="text-text">Your files never leave your device.</strong> All processing on Dokly happens
          entirely in your browser using client-side JavaScript. No files are uploaded to any server.
        </p>
        <p>
          We use <strong className="text-text">Plausible Analytics</strong>, a privacy-first analytics tool that
          collects no personal data and sets no cookies. We do not use Google Analytics or any
          tracking pixels.
        </p>
        <p>
          We display a single <strong className="text-text">Google AdSense</strong> ad on the download
          result screen. Google may use cookies for ad personalization. You can opt out via Google&apos;s
          ad settings.
        </p>
        <p>
          We collect no email addresses, no account information, and no usage logs tied to any individual.
        </p>
        <p className="text-xs text-muted/60">Last updated: May 2026</p>
      </div>
    </div>
  )
}
