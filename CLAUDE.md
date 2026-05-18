# CLAUDE.md — Filezy Build Brief
## "Every tool you need. Instant. Free. Forever."

---

## 1. THE PRODUCT

**Name:** Filezy
**Domain:** filezy.io *(register this first — check availability on Namecheap)*
**Tagline:** Every tool you need. Instant. Free. Forever.
**Positioning:** The only online tool suite that is genuinely unlimited and free —
no task caps, no watermarks, no CAPTCHAs, no account required. Ever.

### Why this exists (the competitor gap we are exploiting)

| Competitor | Critical Weakness |
|---|---|
| Smallpdf | 2 tasks/hour free limit. Watermarks. Paywall constant nudging. |
| iLovePDF | 15 MB file size cap on free. Daily limits. Ad-heavy. |
| TinyWow | CAPTCHA on every task. Daily AI limits. 250+ tools but messy UX. |
| PDF24 | No task limits but dated 2010-era UI. No brand. Ugly. |
| Adobe Acrobat | $19.99/month. No free option for basic tasks. |

**Filezy wins on three things competitors cannot easily copy:**
1. Genuinely unlimited free (client-side processing — zero server cost per operation)
2. Premium-grade UI that feels like a funded startup, not a hobbyist tool
3. Speed — files processed in the browser instantly, nothing uploaded unless unavoidable

---

## 2. TECH STACK

### Framework
- **Next.js 14** with App Router and TypeScript
- Static generation (`generateStaticParams`) for every tool page — critical for SEO
- Each tool at `/tools/[tool-slug]` generates a fully static HTML page

### Hosting
- **Vercel** — free tier, zero config, global CDN, perfect for static Next.js

### Processing Libraries (client-side only)
All processing happens in the user's browser. Nothing is uploaded to a server.
This is the architectural decision that makes the free model sustainable.

| Tool Category | Library |
|---|---|
| PDF merge, split, rotate, compress, protect | `pdf-lib` (MIT) |
| PDF rendering/reading, PDF to image | `pdfjs-dist` (Apache 2.0) |
| Image compress | `browser-image-compression` (MIT) |
| Image resize, crop, convert format, filters | Browser Canvas API (native) |
| Background removal | `@imgly/background-removal` (runs WASM in browser) |
| Text tools | Pure JavaScript — no library needed |
| File conversion (video trimming if needed later) | `ffmpeg.wasm` (LGPL) — load on demand |

### Styling
- **Tailwind CSS** — utility classes only
- Custom design tokens defined in `tailwind.config.ts`
- No component library (MUI, Shadcn etc.) — custom components throughout for design control

### Analytics
- **Plausible Analytics** (self-hosted or cloud) — privacy-first, no cookie banner needed
- No Google Analytics — signals trustworthiness to privacy-conscious users

### Monetisation (v1)
- **Google AdSense** — single leaderboard ad on the results/download step only
- Never on the upload or processing step — do not interrupt the workflow
- Optional **$4/month ad-free plan** — introduced at month 3 when traffic is established

---

## 3. DESIGN SYSTEM

### Aesthetic Direction
**Refined utilitarian.** Think Linear.app meets Vercel's dashboard — clean whites,
precise typography, functional beauty. Not corporate. Not playful. Confident and fast.

The one thing a user remembers: "This felt like a premium product. And it was free."

### Color Palette
```
--color-bg:         #FAFAFA   (off-white, not pure white)
--color-surface:    #FFFFFF   (cards, tool areas)
--color-border:     #E5E7EB   (subtle dividers)
--color-text:       #111827   (near-black, sharp)
--color-muted:      #6B7280   (secondary text)
--color-accent:     #2563EB   (electric blue — primary action)
--color-accent-hover: #1D4ED8
--color-success:    #16A34A
--color-error:      #DC2626
```

Never use purple gradients. Never use teal. Never use orange CTAs.
The accent is electric blue — it signals speed and trust, not hype.

### Typography
- **Display/Headlines:** `Geist` (Vercel's font — modern, geometric, confident)
  Import: `https://vercel.com/font` or use `next/font`
- **Body/UI:** `Geist Mono` for file names/sizes, regular `Geist` for everything else
- Font sizes: 12px / 14px / 16px / 20px / 24px / 32px / 48px — no in-between

### Spacing
- Base unit: 4px
- All spacing multiples of 4: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Components (build these as reusable)

**DropZone** — the core of every tool page
- Large drag-and-drop area: 280px tall minimum
- Dashed border (2px dashed `--color-border`) on default state
- Solid blue border + light blue background (`#EFF6FF`) on drag-hover
- File icon centered with label "Drag & drop your file here"
- "or click to browse" in muted text below
- Accepted file types shown as pills below the label
- On file load: show filename, file size, preview thumbnail if image

**ProcessButton**
- Full-width, `--color-accent` background, white text
- 48px height, 6px border-radius
- Loading state: spinner + "Processing..." text
- Never disabled unless no file is selected

**ResultCard** — shown after processing
- Green checkmark icon
- File size comparison ("4.2 MB → 890 KB — 79% smaller")
- Large "Download" button
- Secondary "Process Another File" link
- This is where the AdSense unit sits — below the download button,
  clearly separated, labeled "Advertisement"

**ToolCard** — used on home page and category pages
- 200px × 120px cards in a responsive grid
- Category icon (SVG, 24px)
- Tool name in 15px semibold
- One-line description in 12px muted
- Hover: subtle shadow lift + accent border-left

**Breadcrumb** — on every tool page
- Home > PDF Tools > Merge PDF
- Helps SEO and user orientation

### UX Rules (non-negotiable)

1. **Zero account required.** Not even optional on v1. No signup wall anywhere.
2. **Zero CAPTCHA.** Never. Not even on free tier.
3. **Zero watermarks.** Output is always clean.
4. **Zero task limits.** Process 100 files in a row — it works every time.
5. **Zero upload spinners.** Processing happens instantly in-browser.
   If there is any delay, show a progress bar — never a blank screen.
6. **One ad placement only.** Below the download button on the result screen.
   No interstitials, no modals, no "upgrade to continue" screens.
7. **Mobile-first.** Every tool must work perfectly on a phone.
   DropZone becomes a "tap to select file" button on mobile.
8. **Keyboard accessible.** Tab order logical. Enter triggers primary action.
9. **File privacy copy.** Show a one-line note: "Your files never leave your device.
   All processing happens in your browser." — on every tool page, below the DropZone.
   This is a genuine differentiator vs. competitors who upload everything.

---

## 4. SITE STRUCTURE

```
/                           → Home page (tool grid + categories)
/tools/                     → All tools listing page
/tools/merge-pdf            → Merge PDF tool
/tools/compress-pdf         → Compress PDF tool
/tools/split-pdf            → Split PDF tool
/tools/pdf-to-word          → PDF to Word converter
/tools/word-to-pdf          → Word to PDF converter
/tools/pdf-to-jpg           → PDF to JPG tool
/tools/jpg-to-pdf           → JPG to PDF tool
/tools/rotate-pdf           → Rotate PDF tool
/tools/unlock-pdf           → Remove PDF password
/tools/protect-pdf          → Add PDF password
/tools/watermark-pdf        → Add text watermark to PDF
/tools/compress-image       → Image compression tool
/tools/resize-image         → Image resize tool
/tools/convert-image        → Image format converter (JPG/PNG/WebP/AVIF)
/tools/crop-image           → Image crop tool
/tools/remove-background    → AI background removal
/tools/word-count           → Word and character counter
/tools/case-converter       → Text case converter
/tools/remove-duplicate-lines → Duplicate line remover
/tools/diff-checker         → Text diff/comparison tool
/tools/url-encoder          → URL encode/decode
/tools/base64               → Base64 encode/decode
/privacy                    → Privacy policy (short, plain English)
/about                      → About page (one paragraph)
```

---

## 5. SEO STRATEGY

Each tool page must have:

```tsx
// In generateMetadata() for each tool
export async function generateMetadata({ params }) {
  return {
    title: `${tool.name} — Free Online Tool | Filezy`,
    description: `${tool.seoDescription}. No limits, no watermarks, no account required.
                  Completely free and works in your browser.`,
    openGraph: {
      title: `${tool.name} — Free & Unlimited | Filezy`,
      description: tool.seoDescription,
      url: `https://filezy.io/tools/${tool.slug}`,
      siteName: 'Filezy',
      type: 'website',
    },
    alternates: {
      canonical: `https://filezy.io/tools/${tool.slug}`,
    },
  }
}
```

Each tool page must contain (in the page body, not just meta):
- H1: exact keyword (e.g. "Merge PDF Files Online — Free")
- H2: "How to merge PDF files" with 3-step numbered list
- H2: "Why use Filezy to merge PDFs?" with 3 bullet points
- FAQ section with 3–5 questions using FAQ schema markup
- Tool description paragraph (150–200 words, keyword-rich but natural)

**Target keywords per tool (examples):**
- merge pdf — 550K monthly searches
- compress pdf online free — 450K monthly searches
- pdf to word — 900K monthly searches
- remove background free — 1M monthly searches
- word count tool — 800K monthly searches
- image compressor — 600K monthly searches

**robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://filezy.io/sitemap.xml
```

**sitemap.xml:** Auto-generated by Next.js. Include all tool pages with
`changeFrequency: 'monthly'` and `priority: 0.8`.

---

## 6. TOOL IMPLEMENTATION SPECS

### Merge PDF (`/tools/merge-pdf`)
```
Library: pdf-lib
Input: Multiple PDF files (drag to reorder)
Process: PDFDocument.create() → copyPages() from each source → save()
Output: merged.pdf download
UI extra: Drag-to-reorder list of uploaded files before processing
```

### Compress PDF (`/tools/compress-pdf`)
```
Library: pdf-lib + pdfjs-dist
Input: Single PDF
Process: Re-render each page as compressed JPEG image, rebuild PDF
Output: compressed.pdf with file size comparison shown
UI extra: Quality slider (High / Medium / Low) — default Medium
```

### PDF to Word (`/tools/pdf-to-word`)
```
Note: True PDF→DOCX conversion requires server-side LibreOffice or a paid API.
v1 approach: Use pdf.js to extract text, generate a basic .docx using docx.js
Be honest in UI: "Best for text-based PDFs. Complex layouts may vary."
Future: Integrate CloudConvert API for $0.01/conversion (pass cost only to heavy users)
```

### Remove Background (`/tools/remove-background`)
```
Library: @imgly/background-removal
Input: JPG or PNG image
Process: Load WASM model (~5MB, cached after first use), run segmentation
Output: PNG with transparent background
UI: Show before/after preview side by side
Loading state: "Loading AI model... (first time only)" then "Removing background..."
```

### Word Count (`/tools/word-count`)
```
Library: None — pure JS
Input: Textarea (paste text) or upload .txt file
Process: Real-time as user types
Output: Words / Characters / Characters (no spaces) / Sentences / Paragraphs / Reading time
UI: Live update on every keystroke — no button needed
```

### Image Compress (`/tools/compress-image`)
```
Library: browser-image-compression
Input: JPG, PNG, WebP (up to 50MB)
Process: Compress with quality slider
Output: Compressed file + size comparison ("4.2 MB → 890 KB")
UI: Quality slider 10%–100%, live preview of output file size estimate
```

---

## 7. FILE/FOLDER STRUCTURE

```
filezy/
├── app/
│   ├── layout.tsx              ← Root layout: nav, footer, font loading
│   ├── page.tsx                ← Home page
│   ├── tools/
│   │   ├── page.tsx            ← All tools listing
│   │   └── [slug]/
│   │       └── page.tsx        ← Dynamic tool page (SSG)
│   ├── privacy/page.tsx
│   └── about/page.tsx
├── components/
│   ├── ui/
│   │   ├── DropZone.tsx        ← Core file input component
│   │   ├── ProcessButton.tsx   ← CTA button with loading state
│   │   ├── ResultCard.tsx      ← Download result + ad placement
│   │   ├── ProgressBar.tsx     ← For longer operations
│   │   └── ToolCard.tsx        ← Card for home/listing pages
│   ├── layout/
│   │   ├── Header.tsx          ← Nav: logo + search + GitHub link
│   │   └── Footer.tsx          ← Minimal: links + "All processing in your browser"
│   └── tools/                  ← One component per tool category
│       ├── MergePDF.tsx
│       ├── CompressPDF.tsx
│       ├── RemoveBackground.tsx
│       └── WordCount.tsx       ← etc.
├── lib/
│   ├── tools.ts                ← Tool definitions (slug, name, description, category, SEO)
│   ├── pdf.ts                  ← PDF processing functions
│   ├── image.ts                ← Image processing functions
│   └── text.ts                 ← Text processing functions
├── public/
│   ├── icons/                  ← SVG icons for each tool category
│   ├── og-image.png            ← Open Graph image (1200x630)
│   └── favicon.ico
├── styles/
│   └── globals.css             ← Tailwind base + custom CSS variables
├── CLAUDE.md                   ← This file
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. TOOLS DATA STRUCTURE

Define all tools in `lib/tools.ts`:

```typescript
export interface Tool {
  slug: string
  name: string
  shortDescription: string        // shown on tool card (max 60 chars)
  seoDescription: string          // used in meta description
  h1: string                      // exact H1 for the tool page
  category: ToolCategory
  inputFormats: string[]          // e.g. ['PDF']
  outputFormat: string            // e.g. 'PDF'
  icon: string                    // icon name from /public/icons/
  featured: boolean               // show on home page
}

export type ToolCategory =
  | 'pdf'
  | 'image'
  | 'text'
  | 'converter'

export const tools: Tool[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDFs into one file',
    seoDescription: 'Merge multiple PDF files into one instantly. Free, unlimited, no watermarks.',
    h1: 'Merge PDF Files Online — Free, Unlimited',
    category: 'pdf',
    inputFormats: ['PDF'],
    outputFormat: 'PDF',
    icon: 'merge',
    featured: true,
  },
  // ... all other tools
]
```

---

## 9. HEADER & NAV

```
[Filezy logo]     PDF Tools  Image Tools  Text Tools  All Tools     [Search]
```

- Logo: "Filezy" in Geist Bold, electric blue dot after the "y"
- Nav links: 4 categories + All Tools
- Search: opens a command-palette style modal (Cmd+K) — search tools by name
- No hamburger menu on mobile: nav collapses to a bottom tab bar on mobile

---

## 10. HOME PAGE LAYOUT

```
[HERO]
  H1: Every tool you need. Free. Forever.
  Subtitle: No limits. No watermarks. No account. Just tools that work.
  Search bar: "Search 30+ tools..." with placeholder examples rotating
  
[FEATURED TOOLS] — 8 cards in 4-col grid
  Most searched: Merge PDF, Compress PDF, PDF to Word, Remove Background,
                 Compress Image, Word Count, Image Resize, PDF to JPG

[CATEGORIES]
  PDF Tools (12 tools) | Image Tools (8 tools) | Text Tools (6 tools)
  Each as a horizontal scrollable row of tool cards

[TRUST BAR]
  🔒 Files never leave your device  ·  ⚡ Instant processing  ·  ✓ No account needed  ·  ∞ Truly unlimited

[FOOTER]
  Filezy — Free online tools for everyone
  Privacy Policy · About · GitHub
  "Built with pdf-lib, pdfjs-dist, and browser-image-compression"
```

---

## 11. BUILD ORDER (execute in this sequence)

Claude Code should build in this exact order. Do not skip steps.

**Phase 1: Foundation (Session 1)**
1. Init Next.js 14 project with TypeScript, Tailwind, App Router
2. Set up design tokens in `tailwind.config.ts`
3. Install all libraries: pdf-lib, pdfjs-dist, browser-image-compression, @imgly/background-removal
4. Build reusable components: DropZone, ProcessButton, ResultCard, ToolCard
5. Build Header and Footer
6. Create `lib/tools.ts` with all 24 tool definitions
7. Build home page layout (hero + featured tools + categories + trust bar)
8. Build `/tools` listing page

**Phase 2: PDF Tools (Session 2)**
1. Merge PDF — with drag-to-reorder
2. Compress PDF — with quality slider
3. Split PDF — select page ranges
4. Rotate PDF — per-page rotation
5. PDF to JPG — page selection
6. JPG to PDF
7. Unlock PDF
8. Protect PDF
9. Watermark PDF

**Phase 3: Image Tools (Session 3)**
1. Compress Image — with quality slider + live size preview
2. Resize Image — by pixel or percentage
3. Convert Image — format selection dropdown
4. Crop Image — interactive crop handles
5. Remove Background — AI-powered, with before/after preview

**Phase 4: Text Tools (Session 4)**
1. Word Count — live, with full stats panel
2. Case Converter — UPPER / lower / Title / Sentence / camelCase
3. Remove Duplicate Lines
4. Diff Checker — side-by-side comparison with highlighted changes
5. URL Encoder/Decoder
6. Base64 Encode/Decode

**Phase 5: SEO & Launch (Session 5)**
1. Add `generateMetadata()` to every tool page
2. Add H2 "How to use" section to every tool page
3. Add FAQ section with schema markup to every tool page
4. Generate `sitemap.xml`
5. Add `robots.txt`
6. Add Open Graph image
7. Verify Lighthouse scores: Performance >90, Accessibility >95, SEO 100
8. Set up Plausible Analytics
9. Add Google AdSense — result page only

---

## 12. QUALITY GATES

Before considering any phase complete, verify:

- [ ] Tool processes correctly on desktop Chrome, Firefox, Safari
- [ ] Tool works correctly on mobile (iOS Safari, Android Chrome)
- [ ] Files > 10MB process without hanging
- [ ] No file is uploaded to any server (verify in Network tab — zero outbound requests during processing)
- [ ] Download works and output file opens correctly
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse SEO score = 100
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] No CLS (Cumulative Layout Shift) during file processing
- [ ] Ad unit appears only on result screen, not during processing

---

## 13. LAUNCH CHECKLIST

- [ ] Domain registered: filezy.io
- [ ] Vercel project connected to GitHub repo
- [ ] Custom domain configured on Vercel
- [ ] Google Search Console — sitemap submitted
- [ ] Plausible Analytics installed
- [ ] Google AdSense account approved and ad unit placed
- [ ] Privacy policy live at /privacy
- [ ] OG image renders correctly (test on opengraph.xyz)
- [ ] Announced on: Product Hunt, Reddit r/sideprojects, r/webdev, r/entrepreneur,
      HackerNews Show HN, Twitter/X

---

## 14. WHAT NEVER TO BUILD (constraints)

- No user accounts in v1
- No cloud storage — files are processed and gone
- No subscription paywall on core tools
- No email capture popups
- No cookie consent banners (no tracking cookies used)
- No social login
- No "pro" version that removes features from free
- No dark mode in v1 (complexity vs. value tradeoff — add later if requested)

---

## 15. COMPETITIVE MESSAGING

When users search for "[competitor] alternative" or "[tool] free", these are the
pages to build:

- `/alternatives/smallpdf` — "Filezy vs Smallpdf: Same tools, no limits, no paywall"
- `/alternatives/ilovepdf` — "Filezy vs iLovePDF: Unlimited free, no file size cap"
- `/alternatives/tinywow` — "Filezy vs TinyWow: No CAPTCHAs, clean interface"

These pages rank for high-intent search traffic and convert extremely well.
Build them in Phase 5.

---

*Last updated: May 2026*
*Built with Claude Code + Next.js + Vercel*
*Stack: pdf-lib · pdfjs-dist · browser-image-compression · @imgly/background-removal*
