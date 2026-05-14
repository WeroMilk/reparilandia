import type { NextConfig } from 'next';
import path from 'path';

/** Raíz de tracing para el árbol de archivos del paquete (monorepo / carpeta anidada). */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
