/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    // COOP+COEP are required for crossOriginIsolated=true, which onnxruntime-web
    // needs for SharedArrayBuffer / multi-threaded WASM. Apply to the tool page
    // AND to the JS chunks so that the headers are present regardless of how the
    // browser loads the page (direct navigation or full reload).
    const crossOriginIsolationHeaders = [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      // 'credentialless' allows cross-origin fetches to the model CDN without
      // needing CORP headers on every CDN response (unlike 'require-corp').
      { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
    ]
    return [
      {
        source: '/tools/remove-background',
        headers: crossOriginIsolationHeaders,
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
