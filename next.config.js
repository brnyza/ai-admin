const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'api.ts'],
  images: {
    // domains: ['bm-geopi.s3.sa-east-1.amazonaws.com']
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}

module.exports = nextConfig
