const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'api.ts'],
  transpilePackages: ['@bluemarble/bm-components'],
  images: {
    // domains: ['bm-geopi.s3.sa-east-1.amazonaws.com']
  }
}

module.exports = nextConfig
