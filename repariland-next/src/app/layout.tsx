import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Reparilandia | Hmo, Son.',
  description:
    'Desde 1985 reparando lo que otros dan por perdido. Taller y museo de coleccionismo en Hermosillo, Sonora, México.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#050508',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased`}
        style={{ backgroundColor: '#050508', color: '#fafafa' }}
      >
        {children}
      </body>
    </html>
  );
}
