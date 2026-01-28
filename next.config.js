/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip font optimization during build if fonts can't be fetched
  optimizeFonts: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'peach.blender.org',
      },
      {
        protocol: 'https',
        hostname: 'durian.blender.org',
      },
      {
        protocol: 'https',
        hostname: 'mango.blender.org',
      },
      {
        protocol: 'https',
        hostname: 'orange.blender.org',
      },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
