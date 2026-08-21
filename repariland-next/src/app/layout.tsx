import type { Metadata, Viewport } from 'next';
import { Orbitron, Space_Grotesk } from 'next/font/google';
import DevStaleCacheRecovery from '@/components/DevStaleCacheRecovery';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  preload: true,
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Reparilandia | Hmo, Son.',
  description:
    'Desde 1985 reparando lo que otros dan por perdido. Taller y museo de coleccionismo en Hermosillo, Sonora, México.',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Reparilandia',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#050508',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/logo-reparilandia.webp?v=37"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/home-box-carritos.webp?v=37"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/home-box-servicio.webp?v=37"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/home-box-novedades.webp?v=37"
          type="image/webp"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased`}
        style={{ backgroundColor: '#050508', color: '#fafafa' }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=window.visualViewport;var h=Math.round((v&&v.height)||window.innerHeight);var t=Math.round((v&&v.offsetTop)||0);var w=Math.round((v&&v.width)||window.innerWidth);var b=Math.max(0,Math.round(window.innerHeight-t-h));var ua=navigator.userAgent||'';var ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);var safari=ios&&/WebKit/i.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);var stand=window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||!!navigator.standalone;var chrome=0;if(safari&&!stand&&b<8){chrome=36;b=36;h=Math.max(300,h-36);}var r=document.documentElement;r.style.setProperty('--app-width',w+'px');r.style.setProperty('--app-height',h+'px');r.style.setProperty('--app-vv-top',t+'px');r.style.setProperty('--app-bottom-inset',b+'px');r.style.setProperty('--safari-bottom-chrome',chrome+'px');r.style.setProperty('--mobile-viewport-h',h+'px');if(chrome>0)r.dataset.iosSafariChrome='1';}catch(e){}})();`,
          }}
        />
        {process.env.NODE_ENV === 'development' ? <DevStaleCacheRecovery /> : null}
        {children}
      </body>
    </html>
  );
}
