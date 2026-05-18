# DOKLY — SEO & Backlink Strategy
## Ranking on Page 1 Without a Budget

---

## THE HONEST REALITY FIRST

On-page SEO (meta tags, H1s, schema, sitemap) gets you technically correct.
Backlinks get you ranked. Google's core ranking signal is still:
*how many authoritative sites link to you, and what do they say about you.*

A technically perfect site with zero backlinks will sit on page 8.
A mediocre site with 50 strong backlinks will sit on page 1.

This document covers both — the technical foundation AND the link building
strategy that actually moves the needle.

---

## PART 1 — TECHNICAL SEO (build into the codebase)

### 1.1 Core Web Vitals — the performance signals Google measures

These must be built into the Next.js app from day one. Not retrofitted later.

**LCP (Largest Contentful Paint) — target: < 2.5 seconds**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],  // modern formats, smaller files
  },
  compress: true,
  poweredByHeader: false,
}

// All images must use next/image — never raw <img> tags
// This gives automatic lazy loading, sizing, and format optimization
import Image from 'next/image'
```

**FID/INP (Interaction to Next Paint) — target: < 200ms**
- Heavy libraries (pdf-lib, pdfjs-dist, @imgly/background-removal) must be
  loaded lazily — only when the user is on that specific tool page
```typescript
// Dynamic import — do NOT import at the top of the file
const processPDF = async () => {
  const { PDFDocument } = await import('pdf-lib')  // loads only when needed
  // ... rest of processing
}
```

**CLS (Cumulative Layout Shift) — target: < 0.1**
- Always define explicit width/height on images
- Reserve space for the DropZone and ResultCard before they render
- Never inject ads in a way that pushes content down

**Measure these before and after each phase:**
```bash
# Run Lighthouse in Chrome DevTools
# Or: npx lighthouse https://dokly.io --output html
# Target: Performance > 90, SEO = 100, Accessibility > 95
```

---

### 1.2 Schema Markup (structured data Google reads)

Add to every tool page — this generates rich results in Google search.

**WebApplication Schema (on each tool page)**
```typescript
// components/SchemaMarkup.tsx
export function ToolSchema({ tool }: { tool: Tool }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `Dokly ${tool.name}`,
    "url": `https://dokly.io/tools/${tool.slug}`,
    "description": tool.seoDescription,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "No account required",
      "No file size limits",
      "No watermarks",
      "Browser-based processing",
      "Unlimited free use"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

**HowTo Schema (on each tool page — generates step-by-step rich results)**
```typescript
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": `How to ${tool.name} online for free`,
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload your file",
      "text": `Click or drag your file into the upload area on Dokly's ${tool.name} tool.`
    },
    {
      "@type": "HowToStep",
      "name": "Process your file",
      "text": `Click the ${tool.name} button. Your file is processed instantly in your browser.`
    },
    {
      "@type": "HowToStep",
      "name": "Download the result",
      "text": "Click Download to save your processed file. No watermarks, no account needed."
    }
  ],
  "totalTime": "PT30S",
  "tool": { "@type": "HowToTool", "name": "Dokly" }
}
```

**FAQ Schema (on each tool page — generates FAQ rich results in Google)**
```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": `Is the ${tool.name} tool really free?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Dokly is completely free with no task limits, no watermarks, and no account required. You can use every tool as many times as you want."
      }
    },
    {
      "@type": "Question",
      "name": "Are my files safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your files never leave your device. All processing happens directly in your browser using local computing power. Nothing is uploaded to any server."
      }
    },
    {
      "@type": "Question",
      "name": `What is the file size limit for ${tool.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dokly has no file size limits. You can process files of any size, as many times as you need, completely free."
      }
    }
  ]
}
```

**Organization Schema (on home page only)**
```typescript
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dokly",
  "url": "https://dokly.io",
  "logo": "https://dokly.io/logo.png",
  "description": "Free online file tools for PDF, images, and text. No limits, no watermarks.",
  "sameAs": [
    "https://twitter.com/doklyio",
    "https://github.com/simbamunyori/dokly"
  ]
}
```

---

### 1.3 Internal Linking Strategy

Internal links distribute "link equity" from strong pages to weaker ones.
Every tool page must link to at least 3 related tools.

**Related tools logic (build into `lib/tools.ts`)**
```typescript
// Each tool definition includes related tools
{
  slug: 'compress-pdf',
  relatedTools: ['merge-pdf', 'split-pdf', 'pdf-to-jpg'],
}

// On every tool page, render a "Related Tools" section
// <RelatedTools tools={tool.relatedTools} />
// This creates a web of internal links that Google crawls deeply
```

**Category pages** (`/tools/pdf`, `/tools/image`, `/tools/text`) must link
to every tool in that category. These pages act as "hub" pages that
concentrate and distribute link equity to individual tool pages.

**Breadcrumbs** on every tool page:
```
Home > PDF Tools > Merge PDF
```
Each breadcrumb is a real link. Adds internal link value and improves
Google's understanding of site structure.

---

### 1.4 URL Structure

Clean, keyword-rich URLs — already in the CLAUDE.md but emphasised here:

```
✓ dokly.io/tools/merge-pdf
✓ dokly.io/tools/compress-pdf-online
✓ dokly.io/tools/remove-background-free

✗ dokly.io/tools/tool?id=123
✗ dokly.io/t/merge
```

---

### 1.5 Page Speed — specific optimisations

```typescript
// next.config.ts additions
const nextConfig = {
  // Enable static export for all tool pages
  // This means pages are served as pure HTML — no server needed
  // Fastest possible loading time
  output: 'export',  // or use ISR with revalidate: 86400

  // Bundle analyzer — run occasionally to catch bloat
  // npx ANALYZE=true next build
}

// For heavy libraries, use next/dynamic with ssr: false
import dynamic from 'next/dynamic'
const RemoveBgTool = dynamic(
  () => import('@/components/tools/RemoveBackground'),
  { ssr: false, loading: () => <ToolSkeleton /> }
)
```

**Target load times:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Tool ready to use: < 3s (before any file is selected)

---

## PART 2 — KEYWORD STRATEGY

### 2.1 Priority keywords by search volume

These are the pages to build and rank first. Sorted by monthly search volume.

| Keyword | Monthly Searches | Difficulty | Priority |
|---|---|---|---|
| pdf to word | 900K | High | 1 |
| remove background free | 1M | High | 1 |
| word count | 800K | Medium | 1 |
| compress pdf online | 450K | High | 1 |
| merge pdf | 550K | High | 1 |
| compress image online | 600K | Medium | 2 |
| pdf to jpg | 400K | Medium | 2 |
| image resizer | 500K | Medium | 2 |
| resize image online | 450K | Medium | 2 |
| split pdf | 300K | Medium | 2 |
| rotate pdf | 200K | Low | 3 |
| word to pdf | 350K | Medium | 2 |
| jpg to pdf | 300K | Medium | 3 |
| remove pdf password | 250K | Low | 3 |
| base64 decode | 400K | Low | 3 |
| url decode | 350K | Low | 3 |
| character counter | 300K | Low | 3 |
| case converter | 200K | Low | 3 |

**The strategy:** Don't chase the highest volume keywords first.
Chase the low-difficulty ones (rows 3, 4 in difficulty).
`word count`, `base64 decode`, `url decode`, `case converter`, `rotate pdf`
have lower competition — you can rank page 1 within 3–6 months.
Use those wins to build domain authority, then go after the big ones.

### 2.2 Long-tail keywords (easier to rank, high intent)

These convert better and rank faster because competition is lower.

```
"merge pdf files online free no sign up"
"compress pdf without losing quality free"
"remove background from image free online"
"how to convert pdf to word online free"
"compress image without losing quality"
"word count tool online free"
"how to unlock a pdf without password"
```

**Each of these gets its own section on the relevant tool page:**
- An H2 matching the long-tail phrase
- 2–3 sentences answering the question directly
- This captures both the exact keyword and the user intent

### 2.3 Competitor alternative keywords

These are high-intent users actively looking to switch.
Build these pages after launch:

```
dokly.io/alternatives/smallpdf
dokly.io/alternatives/ilovepdf
dokly.io/alternatives/adobe-acrobat
dokly.io/alternatives/tinywow

Target searches:
"smallpdf alternative free"       — 40K/month
"ilovepdf alternative"            — 22K/month
"free alternative to adobe acrobat" — 35K/month
"tinywow alternative"             — 8K/month
```

Each page structure:
- H1: "Best Free Smallpdf Alternative — Dokly"
- Comparison table (feature by feature)
- "Why users switch to Dokly" section
- CTA: "Try the [specific tool] free →"

---

## PART 3 — BACKLINK STRATEGY

This is the most important section. Without backlinks, nothing else matters.

### 3.1 Free Tool Directories (submit on launch day)

These sites list free online tools and link back. They have high domain authority.
Each submission = a free backlink from a trusted site.

Submit to all of these within the first week of launch:

| Site | Type | Domain Authority |
|---|---|---|
| alternativeto.net | Software directory | DA 83 |
| producthunt.com | Product launch | DA 91 |
| toolpage.io | Tool directory | DA 45 |
| geekflare.com | Tool listings | DA 72 |
| freetools.io | Tool directory | DA 38 |
| toolbox.google.com | Not a directory but links help | — |
| theresanaiforthat.com | AI tools (for bg removal) | DA 58 |
| futurepedia.io | Tool directory | DA 55 |
| topai.tools | Tool directory | DA 42 |
| saashub.com | Software listings | DA 61 |
| g2.com | Software reviews | DA 91 |
| capterra.com | Software reviews | DA 90 |
| sourceforge.net | Software directory | DA 91 |
| slant.co | Recommendation site | DA 71 |
| stackshare.io | Tech stack listings | DA 72 |

**Process for each:**
1. Create a free account on the directory
2. Submit Dokly with: name, URL, description (use the one from App Store listing),
   screenshots, and category (PDF tools / Image tools / Productivity)
3. Track which ones approve — note the backlink in a spreadsheet

### 3.2 Reddit Strategy (first 30 days)

Reddit posts rank on Google. A well-placed Reddit comment with your link
= backlink from DA 91 + direct traffic.

**Where to post:**

Subreddits to engage with:
- r/productivity (4.2M members)
- r/softwaregore (when showing bad competitor UX)
- r/webdev (2.1M — launch announcement)
- r/sideprojects (230K — launch announcement)
- r/entrepreneur (2.8M)
- r/smallbusiness (1.5M)
- r/freelance (380K)
- r/digitalnomad (2.1M)

**What to post (genuine, not spam):**

*Launch post in r/sideprojects:*
```
"I built a free online tool suite (PDF, images, text) because I got frustrated
paying Smallpdf $9/month just to merge two files. No limits, no watermarks,
no account. Would love feedback from this community."
```

*Helpful comment strategy:*
Search Reddit for people complaining about Smallpdf limits, iLovePDF watermarks,
Adobe pricing. When you find them, post a genuinely helpful reply:
```
"If you're hitting Smallpdf's limit, I just launched Dokly (dokly.io) —
completely free, no task limits, no watermarks. Disclaimer: I built it."
```
This gets upvotes, stays up permanently, and drives ongoing traffic.

**Frequency:** 2–3 posts/week during launch month, then 1–2/month ongoing.

### 3.3 Hacker News (Show HN)

A successful Show HN post = massive traffic spike + permanent backlinks
from people who blog about it.

**Post format:**
```
Show HN: I built a free file tool suite (PDF/images) that works 100% in your browser

dokly.io

Most online PDF tools charge $9–20/month or watermark your output.
I built Dokly because I was tired of the constant "upgrade to continue" screens.

All processing happens in your browser using pdf-lib and browser-image-compression.
Your files never touch a server. Completely free with no task limits.

Would love HN's feedback on the technical approach and UX.
```

**Best time to post:** Tuesday–Thursday, 8–10am US Eastern time
(when US tech workers are starting their day)

**What happens if it works:** 10K–50K visitors in 24 hours,
hundreds of developers linking to it from their own sites and blogs.

### 3.4 Product Hunt Launch

Product Hunt is the most important single launch event.
A strong launch = thousands of visitors, dozens of backlinks, press coverage.

**How to maximise your Product Hunt launch:**

1. **Schedule it** for a Tuesday, Wednesday, or Thursday
   (Mondays and Fridays have lower engagement)
2. **Build a hunter following first** — comment and upvote other products
   for 2–3 weeks before your launch so you have karma
3. **Create a launch kit:**
   - 3 screenshots (tool in action, results screen, mobile view)
   - 60-second GIF demo (use Loom or Kap)
   - Tagline: "Free PDF & image tools — no limits, no watermarks, ever"
   - First comment: personal story of why you built it
4. **Tell your network** the day before — ask them to upvote when it goes live
5. **Respond to every comment** on launch day — engagement signals matter

A top-10 Product Hunt launch consistently generates:
- 2K–10K unique visitors in the first 24 hours
- 15–40 backlinks from blogs writing about Product Hunt launches
- Featured in Product Hunt newsletters (600K subscribers)

### 3.5 Guest Posts and Content Outreach

Write helpful content and get published on sites with high domain authority.
Each published post = a backlink in your author bio or within the article.

**Target publications:**
- dev.to (DA 76) — "How I built a browser-based PDF processor with pdf-lib"
- medium.com / hashnode (DA 96 / 72) — "Why I replaced $9/month PDF tools with free libraries"
- hackernoon.com (DA 76) — "Building a zero-server file processing tool"
- css-tricks.com / smashingmagazine.com — if article is design/UX focused
- freecodecamp.org (DA 91) — tutorial format: "How to process files in the browser"

**Article angles that work:**
1. Technical tutorial — "How we use pdf-lib to merge PDFs without any server"
2. Business angle — "Building a free tool suite: from idea to 100K monthly users"
3. UX story — "Why we removed the upload progress bar and users loved it"
4. Comparison — "We benchmarked every free PDF tool — here's what we found"

**Process:** Write the article, publish it to Dokly's own blog first
(establishes it as original content), then submit to external publications
as a repost with canonical URL pointing back to dokly.io.

### 3.6 HARO (Help A Reporter Out)

Journalists use HARO to find expert sources.
When a journalist quotes you, they link to your site.
These are some of the highest-authority backlinks available.

**Sign up at:** helpareporter.com (free tier)
**Check emails:** 3x daily (6am, 12pm, 6pm US Eastern)
**Respond to queries about:** productivity tools, PDF software,
file management, free software, SaaS pricing, browser technology

**Response template:**
```
Hi [Reporter name],

I'm the founder of Dokly (dokly.io), a free online tool suite
for PDF and image processing. [Answer their specific question in 2–3 sentences].

[Add one relevant stat or insight that makes your quote useful]

Happy to provide more detail or screenshots.
Best,
Simba Marima
Founder, Dokly | simba@dokly.io
```

Aim for 5–10 HARO responses per week. Expect 1–2 placements per month.

### 3.7 Embed Strategy

Create embeddable versions of simple tools that other sites can add to theirs.
When they embed it, they link back to Dokly.

**Best candidates for embedding:**
- Word Count tool — bloggers and writing sites love embedding these
- Character Counter — useful for social media scheduling tools

**How to implement:**
```html
<!-- Embed code Dokly provides -->
<iframe
  src="https://dokly.io/embed/word-count"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
<p>Powered by <a href="https://dokly.io">Dokly</a></p>
```

Reach out to writing blogs, grammar sites, and content creation tools
offering the free embed. Each site that uses it = a backlink.

---

## PART 4 — CONTENT MARKETING

### 4.1 Blog (add to Next.js app)

Route: `dokly.io/blog`

**Why a blog matters for SEO:**
Each blog post is another page that can rank.
Blog posts on informational keywords bring in top-of-funnel traffic
that eventually converts to tool users.

**Post ideas with real search volume:**

| Post Title | Monthly Searches | Target Keyword |
|---|---|---|
| "How to compress a PDF without losing quality" | 90K | compress pdf quality |
| "How to convert PDF to Word for free" | 120K | pdf to word free |
| "Best free PDF editors in 2026" | 80K | free pdf editor |
| "How to remove background from an image free" | 60K | remove background image |
| "How to merge PDF files on iPhone" | 40K | merge pdf iphone |
| "How to reduce image file size without losing quality" | 70K | reduce image size |
| "Smallpdf vs iLovePDF: Which is better in 2026?" | 25K | smallpdf vs ilovepdf |
| "How to unlock a password-protected PDF" | 50K | unlock pdf free |

**Post frequency:** 2 posts per month minimum
**Length:** 1,200–2,000 words per post
**Structure:** Problem → Solution (using Dokly) → Step by step → FAQ

**Internal linking in posts:**
Every blog post must link to at least 2 relevant tool pages.
"...you can compress your PDF using our free tool →"

### 4.2 YouTube (optional but powerful)

A YouTube tutorial for each tool:
- "How to merge PDF files free online (no limits)" — 2 minute screen recording
- Upload to YouTube with keyword-rich title and description
- Embed the YouTube video on the corresponding tool page

Benefits:
- YouTube videos often rank on page 1 of Google above websites
- Embedded video increases dwell time on your page (positive ranking signal)
- YouTube channel = another discovery channel
- Video description links back to dokly.io = backlink from DA 100

---

## PART 5 — MONITORING AND ITERATION

### 5.1 Google Search Console

Set up on launch day. Free. The most important SEO tool you will use.

What to monitor weekly:
- **Coverage:** Are all tool pages indexed? Flag any errors immediately.
- **Performance → Queries:** Which keywords are bringing traffic? Double down.
- **Performance → Pages:** Which tool pages are getting the most clicks?
- **Core Web Vitals report:** Any pages failing performance thresholds?
- **Links:** How many backlinks does Google see? Track growth monthly.

### 5.2 Monthly SEO checklist

- [ ] Check Search Console for new keyword opportunities
- [ ] Check which pages jumped or dropped in ranking
- [ ] Submit 5+ new backlink applications (directories, guest posts, HARO)
- [ ] Publish 2 blog posts
- [ ] Check page speed scores — fix any regressions
- [ ] Review competitor pages — have they added new content?
- [ ] Update FAQ sections on top-performing tool pages with new questions

### 5.3 Ranking timeline expectations (realistic)

| Timeframe | What to expect |
|---|---|
| Month 1–2 | Google indexes all pages. Zero organic traffic. Normal. |
| Month 3 | First rankings appear for low-competition keywords (word count, url encoder, base64) |
| Month 4–5 | 500–2,000 monthly organic visitors. Low-comp tools on page 1. |
| Month 6 | 2,000–8,000 monthly organic visitors. Medium-comp tools appearing. |
| Month 9 | 10,000–30,000 monthly organic visitors. Domain authority building. |
| Month 12 | 30,000–100,000+ monthly organic visitors. Competing for high-volume terms. |

SEO is a 6–12 month investment. The tools that win long-term are the ones
that stayed consistent with content and backlink building in months 1–6
when results feel invisible.

---

## PART 6 — QUICK WINS CHECKLIST (do on launch day)

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools (free, often forgotten, real traffic)
- [ ] Create Twitter/X account: @doklyio — tweet launch
- [ ] Post on r/sideprojects
- [ ] Post on r/webdev
- [ ] Submit to Product Hunt (schedule for Tuesday if possible)
- [ ] Submit to AlternativeTo.net
- [ ] Submit to SaaSHub.com
- [ ] Submit to ToolPage.io
- [ ] Write and publish Show HN post
- [ ] Email 10 people who complained about Smallpdf/iLovePDF on Twitter
  with a genuine "built this for you" message
- [ ] Set up Plausible Analytics — track which tools get most usage
- [ ] Set up HARO account and respond to first relevant queries

---

*Last updated: May 2026*
*This document covers: Technical SEO · Core Web Vitals · Schema Markup ·
Keyword Strategy · Backlink Building · Content Marketing · Launch Strategy*
