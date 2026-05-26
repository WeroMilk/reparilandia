# Reparilandia — Taller de Reparaciones & Museo de Coleccionismo

Landing futurista para Reparilandia (Hermosillo, Sonora, México). El código de la web vive en **`repariland-next/`** (Next.js); las utilidades de imagen están en **`scripts/`**.

## Características

- **Experiencia inmersiva holográfica**: intro con efectos de luz y partículas
- **Navegación tipo app**: transiciones entre pantallas completas
- **Pantallas**: Inicio, Historia, Servicios, Noticias, Contacto
- **Formularios**: cotizaciones y contacto se envían a **reparilandia@hotmail.com** (SMTP Hotmail recomendado o Resend; ver `repariland-next/.env.example`)
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

Desde la **raíz del repo** o desde `repariland-next/`:

```bash
npm run dev
```

Abre **[http://localhost:3000](http://localhost:3000)** (el script `dev:clean` libera puertos 3000–3012 y borra `.next` corrupto).

Si la consola muestra 404 en `main.js`, `react-refresh.js` o `_app.js`: es HTML en caché de un arranque viejo → **Ctrl+Shift+R** o cierra la pestaña y vuelve a abrir esa URL.

### Producción

```bash
npm run build
npm run start
```

## Deploy (Vercel)

**Obligatorio en Vercel:** **Settings → Build & Deployment → Root Directory** = **`repariland-next`**. Sin esto, `/api/cotizacion`, `/api/contacto` y `/api/form-email/health` responden **500**.

Si el Root Directory ya es `repariland-next`, deja **Build Command** e **Install Command** vacíos (usa `repariland-next/vercel.json`).

En **Project → Settings → Build & Deployment**:

1. **Framework Preset** → **Next.js** (no Vite).
2. Si Root Directory = raíz del repo: **Build Command** vacío (usa `vercel.json`). Si Root Directory = `repariland-next`: build por defecto.
3. **Output Directory** → vacío (sin `dist`).
4. **Node.js** → **20.x**.

Tras un deploy, comprueba: `https://www.reparilandia.com/api/form-email/health` debe responder JSON con `"configured": true` (no HTML de error 500).

Variables en Vercel (Production), copia desde `repariland-next/.env.example` — **no** subas `.env.local` al repo:

| Variable | Uso |
|----------|-----|
| `FORM_TO_EMAIL` | Destino (p. ej. `reparilandia@hotmail.com`) |
| `RESEND_API_KEY` | API key de Resend |
| `RESEND_DOMAIN_VERIFIED` | `true` cuando reparilandia.com esté **Verified** en Resend |
| `RESEND_FROM_EMAIL` | p. ej. `Reparilandia <cotizaciones@reparilandia.com>` |

## Estructura relevante

- `repariland-next/src/lib/formActions.ts` — envíos de formularios
- `repariland-next/public/assets/` — logo e imágenes

## Licencia

© Reparilandia. Todos los derechos reservados.