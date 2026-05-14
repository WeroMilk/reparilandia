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

**Imprescindible:** en **Project → Settings → General → Root Directory** pon **`repariland-next`** y guarda. Si sigues en la raíz del repo (`./`), Vercel no verá `next` en el `package.json` y fallará la detección.

En **Build & Deployment**:

1. **Framework Preset** → **Next.js**.
2. **Node.js Version** → **20.x** (coherente con `engines` y `.nvmrc` dentro de `repariland-next/`).
3. **Output Directory** → vacío (no uses `dist` de Vite).
4. Quita overrides de **Install Command** y **Build Command** si siguen apuntando a la raíz del monorepo; **`repariland-next/vercel.json`** define **`npm ci`**, **`npm run build`** y **`framework": "nextjs"`**.

Variables de app: las de `.env` / `.env.example` en el panel de Vercel.

## Estructura relevante

- `repariland-next/src/lib/formActions.ts` — envíos de formularios
- `repariland-next/public/assets/` — logo e imágenes

## Licencia

© Reparilandia. Todos los derechos reservados.