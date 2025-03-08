import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Use SSR (remove output: 'export')
  // output: 'standalone' is fine for Docker, but not needed for Netlify
  images: {
    domains: ['localhost', 'your-api-domain.com'],
    // Add any domains you load images from
  },
};

export default nextConfig;
