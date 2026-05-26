import type { NextConfig } from 'next';
import path from 'path';

/** Incluye dependencias del monorepo al empaquetar rutas API en Vercel. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  devIndicators: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  images: {
    qualities: [75, 100],
    localPatterns: [
      {
        pathname: '/assets/**',
      },
    ],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'reparilandia.com' }],
        destination: 'https://www.reparilandia.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
