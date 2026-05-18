/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // SharedArrayBuffer (required by onnxruntime-web / @imgly/background-removal)
        // is only available in cross-origin isolated contexts.
        source: '/tools/remove-background',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // 'credentialless' allows cross-origin fetches (model CDN) without CORP headers,
          // unlike 'require-corp' which would block them.
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
