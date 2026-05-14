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

**Gestor de paquetes:** **npm** con **`package-lock.json`** en `repariland-next/` (install reproducible con `npm ci`). El registry oficial está fijado en `repariland-next/.npmrc`.

## Configuración local

```bash
cd repariland-next
npm install
```

Copia variables de entorno si las usas:

```bash
copy .env.example .env
```

(En macOS/Linux: `cp .env.example .env`.)

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Producción

```bash
npm run build
npm run start
```

## Deploy (Vercel)

El **`vercel.json` en la raíz del repo** fuerza **Next.js** y **`npm run build`** (y **`npm ci`** en `repariland-next` cuando el proyecto usa la raíz del monorepo). Los comandos también valen si **Root Directory** es **`repariland-next`**.

En **Project → Settings → Build & Deployment**:

1. **Framework Preset** → **Next.js** (no Vite).
2. **Build Command** → **vacío / por defecto**. Si aparece **`vite build`**, **elimínalo**: es un override viejo del panel y provoca el error 127.
3. **Install Command** → vacío por defecto salvo override manual; `vercel.json` ya define el install.
4. **Output Directory** → vacío (sin `dist`).
5. **Node.js** → **20.x** recomendado.

El **`package.json` en la raíz** declara **`next`** solo para que Vercel detecte Next cuando la app vive en **`repariland-next/`**; el lock real del sitio es **`repariland-next/package-lock.json`**.

Variables de app: `.env` / `.env.example` en el panel de Vercel.

## Estructura relevante

- `repariland-next/src/lib/formActions.ts` — envíos de formularios
- `repariland-next/public/assets/` — logo e imágenes

## Licencia

© Reparilandia. Todos los derechos reservados.