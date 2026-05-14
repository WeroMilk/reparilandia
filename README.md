# Reparilandia — Taller de Reparaciones & Museo de Coleccionismo

Landing futurista para Reparilandia (Hermosillo, Sonora, México). El código de la web vive en **`repariland-next/`** (Next.js); las utilidades de imagen están en **`scripts/`**.

## Características

- **Experiencia inmersiva holográfica**: intro con efectos de luz y partículas
- **Navegación tipo app**: transiciones entre pantallas completas
- **Pantallas**: Inicio, Historia, Servicios, Noticias, Contacto
- **Formularios**: cotizaciones, citas/tours y contacto (por defecto solo consola; enlaza tu backend en `repariland-next/src/lib/formActions.ts`)
- **WhatsApp**: enlaces directos para cotizar
- **Footer legal**: privacidad, cookies y aviso legal en modales

## Stack

- React 19 + TypeScript
- Next.js 15
- Tailwind CSS + shadcn/ui
- Framer Motion
- Lucide React

**Gestor de paquetes:** [pnpm](https://pnpm.io) (fijado en `repariland-next/package.json` → `packageManager`).

## Configuración local

```bash
cd repariland-next
corepack enable
pnpm install
```

Copia variables de entorno si las usas:

```bash
copy .env.example .env
```

(En macOS/Linux: `cp .env.example .env`.)

### Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Producción

```bash
pnpm build
pnpm start
```

## Deploy (Vercel u otro)

- Directorio raíz del proyecto: **`repariland-next`**
- Install: **`pnpm install`**
- Build: **`pnpm build`**

Configura en el panel del proveedor las variables que definas en `.env` / `.env.example`.

## Estructura relevante

- `repariland-next/src/lib/formActions.ts` — envíos de formularios
- `repariland-next/public/assets/` — logo e imágenes

## Licencia

© Reparilandia. Todos los derechos reservados.