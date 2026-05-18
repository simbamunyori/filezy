import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Belt-and-suspenders: set COOP + COEP on every response so
// window.crossOriginIsolated is true for @imgly/background-removal's
// onnxruntime-web WASM backend. The async headers() in next.config.mjs
// does the same, but middleware runs before the Next.js page handler and
// ensures headers are present even when next.config headers are missed
// (e.g. dev server quirks, Vercel edge cache serving stale responses).
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless')
  return response
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
