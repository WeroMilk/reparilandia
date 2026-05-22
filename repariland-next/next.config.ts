import type { NextConfig } from 'next';
import path from 'path';

/** Raíz de tracing para el árbol de archivos del paquete (monorepo / carpeta anidada). */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
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
