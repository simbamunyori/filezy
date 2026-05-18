/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false

    // @imgly/background-removal ships .mjs files that use import.meta (ESM syntax).
    // Webpack needs to treat them as ESM modules rather than CommonJS.
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/esm',
      resolve: { fullySpecified: false },
    })

    // Enable async WASM for onnxruntime-web used by @imgly/background-removal
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    return config
  },
}

export default nextConfig
