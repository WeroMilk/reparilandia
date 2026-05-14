import type { NextConfig } from 'next';
import path from 'path';

/** Evita que Next tome el lockfile del repo padre al haber varios package-lock. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
