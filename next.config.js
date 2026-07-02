/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/doner-gourmet',
  assetPrefix: '/doner-gourmet/',
  images: {
    unoptimized: true,
  },
}
module.exports = nextConfig
