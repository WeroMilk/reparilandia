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
  title: 'Reparilandia — Taller de Reparaciones & Museo de Coleccionismo',
  description:
    '40 años reparando lo que otros desechan. Taller de reparaciones y museo de coleccionismo en Hermosillo, México.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      >
        {children}
      </body>
    </html>
  );
}
