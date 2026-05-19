import type { NextConfig } from 'next';
import path from 'path';

/** Raíz de tracing para el árbol de archivos del paquete (monorepo / carpeta anidada). */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
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
};

export default nextConfig;
