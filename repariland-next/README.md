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

El `vercel.json` en la raíz ejecuta **`npm ci --prefix repariland-next`** y **`npm run build --prefix repariland-next`** (instala solo lo del lockfile).
