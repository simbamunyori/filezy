/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply COOP + COEP to every route so that window.crossOriginIsolated is
        // true regardless of whether the user hard-navigated or arrived via a
        // Next.js client-side <Link>. If only the remove-background page had these
        // headers, a user arriving via soft navigation (e.g. home → tool) would
        // inherit the home page's document context (no COOP) and crossOriginIsolated
        // would be false, making SharedArrayBuffer unavailable for onnxruntime-web.
        //
        // COEP: credentialless allows cross-origin fetches (model CDN, WASM assets)
        // without requiring CORP headers on those servers — unlike require-corp.
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
    ]
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false }

    // @imgly/background-removal ships .mjs files with import.meta — treat as ESM.
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/esm',
      resolve: { fullySpecified: false },
    })

    if (!isServer) {
      // Required for onnxruntime-web WASM backend used by @imgly/background-removal.
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
        layers: true,
      }

      // Emit WASM files to a stable, serveable path.
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    }

    return config
  },
}

export default nextConfig
