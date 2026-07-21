import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Reparilandia | Hmo, Son.',
    short_name: 'Reparilandia',
    description:
      'Desde 1985 reparando lo que otros dan por perdido. Taller y museo de coleccionismo en Hermosillo, Sonora, México.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#050508',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
