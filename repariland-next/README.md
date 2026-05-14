# Reparilandia (Next.js)

Sitio de Reparilandia con [Next.js](https://nextjs.org). Este proyecto usa **pnpm** como gestor de paquetes (`packageManager` en `package.json`).

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/installation) (recomendado: `corepack enable` y usar la versión fijada en el campo `packageManager`)

## Desarrollo

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
pnpm build
pnpm start
```

## Lint

```bash
pnpm lint
```

## Despliegue

En Vercel u otro proveedor, configura el comando de instalación como `pnpm install` y el de build como `pnpm build` (directorio raíz del proyecto: `repariland-next` si el repo incluye más carpetas).
