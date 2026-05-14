# Reparilandia (Next.js)

Sitio con [Next.js](https://nextjs.org). Dependencias con **npm**; el archivo **`package-lock.json`** fija versiones e integridades para installs reproducibles.

## Requisitos

- Node.js **20.x** (recomendado; coincide con Vercel)

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Despliegue (Vercel)

En la **raíz del repositorio** está **`vercel.json`** (Next + `npm ci` / `npm run build` en este paquete o con `--prefix repariland-next` según cómo esté configurado el proyecto). En el panel de Vercel, **no dejes** **Build Command** en `vite build`. Registry: `repariland-next/.npmrc`.
