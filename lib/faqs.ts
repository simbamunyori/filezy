export interface FAQ {
  question: string
  answer: string
}

const DEFAULT_FAQS = (toolName: string, inputFormat: string, outputFormat: string): FAQ[] => [
  {
    question: `Is ${toolName} really free?`,
    answer: `Yes, completely free with no hidden limits. No account, no watermarks, no task caps — ever.`,
  },
  {
    question: `Do my files get uploaded to a server?`,
    answer: `No. All processing happens entirely in your browser. Your ${inputFormat} files never leave your device.`,
  },
  {
    question: `Is there a file size limit?`,
    answer: `There is no imposed limit. Processing is done in-browser so performance depends on your device, but most files up to 100 MB work without issues.`,
  },
  {
    question: `What browsers does ${toolName} work on?`,
    answer: `It works on all modern browsers including Chrome, Firefox, Safari, and Edge — on desktop and mobile.`,
  },
  {
    question: `Do I need to create an account?`,
    answer: `No account required. Just upload your file, process it, and download the result. Nothing to sign up for.`,
  },
]

const toolFaqs: Record<string, FAQ[]> = {
  'merge-pdf': [
    {
      question: 'How many PDF files can I merge at once?',
      answer: 'There is no limit. You can merge 2, 10, or 50+ PDF files in one go. All processing happens in your browser.',
    },
    {
      question: 'Can I reorder files before merging?',
      answer: 'Yes. After uploading, drag and drop the files in the list to set the order they will appear in the merged PDF.',
    },
    {
      question: 'Will the merged PDF lose quality?',
      answer: 'No. The merge operation copies pages exactly as-is using pdf-lib. There is no re-rendering or quality loss.',
    },
    {
      question: 'Are my PDF files uploaded to a server?',
      answer: 'No. All merging happens entirely in your browser using JavaScript. Your files never leave your device.',
    },
    {
      question: 'Is Merge PDF free with no watermarks?',
      answer: 'Yes. Completely free, unlimited, and the output PDF has no watermarks added by Filezy.',
    },
  ],
  'compress-pdf': [
    {
      question: 'How much will my PDF be compressed?',
      answer: 'Results vary by content. Text-heavy PDFs may see 20–40% reduction; image-heavy PDFs can see 50–80% reduction depending on the quality setting you choose.',
    },
    {
      question: 'What are the quality settings?',
      answer: 'High quality gives moderate compression with excellent visual output. Medium (default) balances quality and size. Low gives the smallest file with some visible quality reduction.',
    },
    {
      question: 'Will the compressed PDF still be readable?',
      answer: 'Yes. Even at Low quality the text remains sharp. The compression mainly affects embedded images inside the PDF.',
    },
    {
      question: 'Does compression work on password-protected PDFs?',
      answer: 'No. Password-protected PDFs must be unlocked before they can be compressed. Use the Unlock PDF tool first.',
    },
    {
      question: 'Is my PDF uploaded to any server during compression?',
      answer: 'No. The entire compression process runs in your browser. Nothing is uploaded anywhere.',
    },
  ],
  'split-pdf': [
    {
      question: 'How do I specify page ranges to extract?',
      answer: 'Enter ranges like "1-3, 5, 7-9" in the input field. Each range or single page becomes a separate PDF download.',
    },
    {
      question: 'Can I extract a single page from a PDF?',
      answer: 'Yes. Enter just the page number (e.g. "3") to extract that page as a new PDF.',
    },
    {
      question: 'Can I split a PDF into individual pages?',
      answer: 'Yes. For a 5-page PDF, enter "1, 2, 3, 4, 5" to get five separate single-page PDFs.',
    },
    {
      question: 'Is there a limit on how many pages I can split?',
      answer: 'No limit. You can split PDFs with hundreds of pages. Processing happens locally in your browser.',
    },
    {
      question: 'Are my files safe to upload here?',
      answer: 'Your files are not uploaded anywhere. Split PDF runs entirely client-side in your browser.',
    },
  ],
  'rotate-pdf': [
    {
      question: 'Can I rotate only specific pages?',
      answer: 'Currently the tool rotates all pages in the PDF by the same amount. Per-page rotation is on our roadmap.',
    },
    {
      question: 'What rotation options are available?',
      answer: 'You can rotate 90° clockwise, 90° counter-clockwise, or 180° (upside down).',
    },
    {
      question: 'Will rotating affect the PDF text quality?',
      answer: 'No. Rotation is a metadata operation — text, images, and formatting are preserved perfectly.',
    },
    {
      question: 'Does it work on scanned PDFs?',
      answer: 'Yes. Rotation works on all PDF types including scanned documents and image-based PDFs.',
    },
    {
      question: 'Is Rotate PDF free and unlimited?',
      answer: 'Yes. Completely free, no file size limits, no watermarks, no account needed.',
    },
  ],
  'pdf-to-jpg': [
    {
      question: 'Does it convert every page to a separate JPG?',
      answer: 'Yes. Each page in the PDF becomes its own JPG image file. You can download them individually or all at once.',
    },
    {
      question: 'What resolution are the output JPGs?',
      answer: 'Images are rendered at 2× scale (144 DPI equivalent) for sharp, clear output. The quality slider lets you control JPEG compression.',
    },
    {
      question: 'Can I convert just one page from a multi-page PDF?',
      answer: 'Currently all pages are converted. To convert a specific page, first use Split PDF to extract that page, then convert.',
    },
    {
      question: 'Will the JPGs have transparent backgrounds?',
      answer: 'No. PDFs render to JPG with a white background. For transparent output, the page would need to be rendered to PNG.',
    },
    {
      question: 'Are my files uploaded to process?',
      answer: 'No. PDF to JPG conversion runs entirely in your browser using PDF.js. Nothing is sent to any server.',
    },
  ],
  'jpg-to-pdf': [
    {
      question: 'Can I combine multiple images into one PDF?',
      answer: 'Yes. Add multiple images and they will be combined into a single PDF, each image on its own page.',
    },
    {
      question: 'What image formats are supported?',
      answer: 'JPG, JPEG, PNG, and WebP are supported. Each is embedded optimally in the output PDF.',
    },
    {
      question: 'Can I control the page size of the PDF?',
      answer: 'Each page is sized to match the image dimensions exactly. Standard paper size options are on our roadmap.',
    },
    {
      question: 'Will image quality be reduced in the PDF?',
      answer: 'JPG and PNG images are embedded directly without re-encoding, preserving original quality. WebP images are converted to PNG first.',
    },
    {
      question: 'Is there a limit on how many images I can add?',
      answer: 'No limit. Add as many images as you need. All conversion happens in your browser.',
    },
  ],
  'unlock-pdf': [
    {
      question: 'What type of PDF protection does this remove?',
      answer: 'It removes permissions restrictions — the kind that prevents printing, copying, or editing. These PDFs open normally but restrict what you can do.',
    },
    {
      question: 'Can it unlock a PDF that requires a password to open?',
      answer: 'No. If a PDF requires a password just to open it, browser-based tools cannot decrypt it. You would need the owner password and a desktop tool like Adobe Acrobat.',
    },
    {
      question: 'Is this legal to use?',
      answer: 'Yes, for PDFs you own or have permission to modify. Removing restrictions from your own documents or those you have rights to is legitimate.',
    },
    {
      question: 'Will the unlocked PDF look different?',
      answer: 'No. Content, layout, images, and formatting are fully preserved. Only the restriction metadata is removed.',
    },
    {
      question: 'Is the PDF uploaded to a server?',
      answer: 'No. All processing runs locally in your browser. Your document is never sent anywhere.',
    },
  ],
  'protect-pdf': [
    {
      question: 'What kind of password protection does this add?',
      answer: 'It adds a PDF JavaScript action that prompts for a password when opened in Adobe Acrobat or Reader. Note: browser-based PDF viewers do not enforce this protection.',
    },
    {
      question: 'Will this work in all PDF viewers?',
      answer: 'It works in Adobe Acrobat/Reader and Foxit Reader. Chrome, Firefox, and Safari PDF viewers do not run PDF JavaScript, so the protection will not be enforced there.',
    },
    {
      question: 'Can someone bypass the protection?',
      answer: 'This is a deterrent, not cryptographic encryption. For strong AES encryption, use dedicated software like Adobe Acrobat Pro or LibreOffice.',
    },
    {
      question: 'What is the minimum password length?',
      answer: 'Minimum 4 characters. We recommend a strong password of 12+ characters for better security.',
    },
    {
      question: 'Is my file or password sent to any server?',
      answer: 'No. The password is hashed and embedded in the PDF entirely in your browser. Nothing leaves your device.',
    },
  ],
  'watermark-pdf': [
    {
      question: 'Can I customize the watermark text?',
      answer: 'Yes. Type any text up to 50 characters — CONFIDENTIAL, DRAFT, your name, or anything else.',
    },
    {
      question: 'Can I change the watermark position?',
      answer: 'Yes. Choose from Diagonal (center, 45° angle), Center (horizontal), or Bottom Right. More positions are on the roadmap.',
    },
    {
      question: 'Is the watermark on every page?',
      answer: 'Yes. The watermark is applied to every page in the PDF with the same settings.',
    },
    {
      question: 'Can the watermark be removed by the recipient?',
      answer: 'The watermark is embedded in the PDF page content. It can technically be removed with advanced PDF editing tools. For irremovable watermarking, flatten the PDF afterward.',
    },
    {
      question: 'Does adding a watermark change the file size significantly?',
      answer: 'Minimal increase — typically a few kilobytes. Text watermarks are very compact in PDF format.',
    },
  ],
  'compress-image': [
    {
      question: 'What image formats can I compress?',
      answer: 'JPG, PNG, and WebP are supported. The tool uses browser-image-compression to intelligently reduce file size.',
    },
    {
      question: 'How much smaller will my image be?',
      answer: 'Typical reductions are 40–80% depending on the original image and quality setting. The tool shows before/after file sizes.',
    },
    {
      question: 'Will my image lose visible quality?',
      answer: 'At higher quality settings the loss is imperceptible. Lower settings produce smaller files with some visible compression artifacts.',
    },
    {
      question: 'Is there a maximum file size?',
      answer: 'No hard limit. Files up to 50 MB compress comfortably. Larger files may take a few seconds depending on your device.',
    },
    {
      question: 'Are images uploaded to a server for compression?',
      answer: 'No. Everything runs in your browser using the browser-image-compression library. Your images stay on your device.',
    },
  ],
  'remove-background': [
    {
      question: 'How does background removal work?',
      answer: 'It uses a machine learning model (run entirely in your browser via WebAssembly) that segments the foreground subject from the background.',
    },
    {
      question: 'What is the output format after background removal?',
      answer: 'A PNG file with a transparent background. You can place it over any color or design.',
    },
    {
      question: 'Why does the first removal take longer?',
      answer: 'The AI model (~5 MB WASM file) is downloaded and cached on first use. After that it runs instantly without any re-download.',
    },
    {
      question: 'Does it work on all types of images?',
      answer: 'It works best on portraits, product shots, and images with clear foreground subjects. Complex scenes with similar colors may have less precise edges.',
    },
    {
      question: 'Is the AI model running on a server?',
      answer: 'No. The model runs entirely in your browser via WebAssembly. Your images are never uploaded anywhere.',
    },
  ],
  'word-count': [
    {
      question: 'What statistics does the word count tool show?',
      answer: 'Words, characters (with and without spaces), sentences, paragraphs, and estimated reading time based on 200 words per minute.',
    },
    {
      question: 'Does it count words in real time?',
      answer: 'Yes. Stats update instantly on every keystroke. No button needed.',
    },
    {
      question: 'Can I upload a text file instead of pasting?',
      answer: 'Yes. Click the upload button to load a .txt file directly into the text area.',
    },
    {
      question: 'Is there a maximum text length?',
      answer: 'No limit. Paste your entire essay, book chapter, or document — it handles any length.',
    },
    {
      question: 'Is my text sent to any server?',
      answer: 'No. Word counting happens locally in your browser using JavaScript. Nothing is transmitted.',
    },
  ],
  'diff-checker': [
    {
      question: 'What algorithm does the diff checker use?',
      answer: 'It uses the Longest Common Subsequence (LCS) algorithm to identify added and removed lines between two texts.',
    },
    {
      question: 'What do the colors mean in the diff view?',
      answer: 'Green highlights indicate lines added in the right text. Red highlights indicate lines removed (present in left but not right).',
    },
    {
      question: 'Can I compare code files?',
      answer: 'Yes. Paste any plain text including code, JSON, CSV, or prose. The diff operates line by line.',
    },
    {
      question: 'Is there a text size limit?',
      answer: 'No hard limit. Very large texts (10,000+ lines) may take a moment to diff due to the LCS computation.',
    },
    {
      question: 'Is my text sent to any server?',
      answer: 'No. The diff algorithm runs entirely in your browser. Your text is never transmitted.',
    },
  ],
}

export function getToolFaqs(slug: string, toolName: string, inputFormats: string[], outputFormat: string): FAQ[] {
  return toolFaqs[slug] ?? DEFAULT_FAQS(toolName, inputFormats[0] ?? 'file', outputFormat)
}
