import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Changed from 'standalone' to 'export' for Netlify
  output: 'export',
  // Add images configuration for Netlify
  images: {
    unoptimized: true, // Required for Netlify static deployment
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Remove experimental config as appDir is now standard
  // If you need experimental features, check Next.js docs for current options
};

export default nextConfig;
