/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve from root path
  basePath: '',
  
  // No asset prefix needed for root path
  assetPrefix: undefined,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Experimental features
  experimental: {
    // Remove deprecated serverComponents option
  },
  
  // Configure images if you're using next/image
  images: {
    unoptimized: true, // Disable image optimization if not needed
  },
  
  // Enable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Enable ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig