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

En **Project → Settings → General**:

1. **Node.js Version** → **20.x** (alineado con `engines` del repo).
2. **Root Directory** → déjalo en la **raíz del repo** (`./`). Si lo cambias a solo `repariland-next`, borra en el panel los overrides de Install/Build y usa los comandos por defecto (`npm ci` / `npm run build` desde esa carpeta).
3. **Framework Preset** → **Next.js** (no Vite).
4. Sin overrides de Install / Build en el panel: el **`vercel.json`** en la raíz usa **`npm ci`** y **`npm run build`** (solo dependencias del lockfile; registry `registry.npmjs.org`).
5. **Salida del build:** debe estar el preset **Next.js**. Si ves el error de carpeta **`dist`**, en **Settings → Build & Deployment → Output Directory** deja el campo **vacío** (Next no usa `dist` como Vite; el error viene de un override antiguo).

Variables de app: las de `.env` / `.env.example` en el panel de Vercel.

## Estructura relevante

- `repariland-next/src/lib/formActions.ts` — envíos de formularios
- `repariland-next/public/assets/` — logo e imágenes

## Licencia

© Reparilandia. Todos los derechos reservados.