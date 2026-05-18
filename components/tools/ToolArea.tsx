'use client'

import dynamic from 'next/dynamic'

// Dynamic imports keep each tool's library code out of the initial bundle
const MergePDF = dynamic(() => import('./MergePDF'), { ssr: false })
const CompressPDF = dynamic(() => import('./CompressPDF'), { ssr: false })
const SplitPDF = dynamic(() => import('./SplitPDF'), { ssr: false })
const RotatePDF = dynamic(() => import('./RotatePDF'), { ssr: false })
const PDFtoJPG = dynamic(() => import('./PDFtoJPG'), { ssr: false })
const JPGtoPDF = dynamic(() => import('./JPGtoPDF'), { ssr: false })
const UnlockPDF = dynamic(() => import('./UnlockPDF'), { ssr: false })
const ProtectPDF = dynamic(() => import('./ProtectPDF'), { ssr: false })
const WatermarkPDF = dynamic(() => import('./WatermarkPDF'), { ssr: false })

const TOOL_MAP: Record<string, React.ComponentType> = {
  'merge-pdf': MergePDF,
  'compress-pdf': CompressPDF,
  'split-pdf': SplitPDF,
  'rotate-pdf': RotatePDF,
  'pdf-to-jpg': PDFtoJPG,
  'jpg-to-pdf': JPGtoPDF,
  'unlock-pdf': UnlockPDF,
  'protect-pdf': ProtectPDF,
  'watermark-pdf': WatermarkPDF,
}

export default function ToolArea({ slug }: { slug: string }) {
  const Tool = TOOL_MAP[slug]
  if (!Tool) return null
  return <Tool />
}
