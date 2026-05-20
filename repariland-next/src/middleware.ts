import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Rutas de chunks del Pages Router (HTML en caché); evitan 404 ruidosos en consola. */
const LEGACY_DEV_CHUNK_PATHS = new Set([
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/react-refresh.js',
  '/_next/static/chunks/pages/_app.js',
  '/_next/static/chunks/pages/_error.js',
  '/main.js',
  '/react-refresh.js',
  '/_app.js',
  '/_error.js',
]);

const STALE_CHUNK_JS = [
  '/* Reparilandia: caché antigua del navegador — recarga forzada */',
  'if(!window.__REPARILANDIA_DEV_RELOAD__){',
  'window.__REPARILANDIA_DEV_RELOAD__=1;',
  'var u=new URL(location.href);',
  'if(!u.searchParams.has("_fresh")){u.searchParams.set("_fresh",String(Date.now()));location.replace(u.toString());}',
  '}',
].join('');

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (!LEGACY_DEV_CHUNK_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  return new NextResponse(STALE_CHUNK_JS, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export const config = {
  matcher: [
    '/_next/static/chunks/main.js',
    '/_next/static/chunks/react-refresh.js',
    '/_next/static/chunks/pages/_app.js',
    '/_next/static/chunks/pages/_error.js',
    '/main.js',
    '/react-refresh.js',
    '/_app.js',
    '/_error.js',
  ],
};
