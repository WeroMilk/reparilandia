# Reparilandia (Next.js)

Sitio con [Next.js](https://nextjs.org). Dependencias con **npm**; el archivo **`package-lock.json`** fija versiones e integridades para installs reproducibles.

## Requisitos

- Node.js **20.x** (recomendado; coincide con Vercel)

## Desarrollo

```bash
npm install
npm run dev
```

Desde la **raíz del repo**, `npm run dev` ya ejecuta un arranque limpio (`dev:clean`).

Abre **[http://localhost:3000](http://localhost:3000)** (puerto por defecto).

Si ves **404** en `main.js`, `react-refresh.js` o `_app.js` en la consola:

1. Cierra **todas** las terminales con Node/Next.
2. Ejecuta **`npm run dev`** o **`npm run dev:clean`** (borra `.next` y libera puertos 3000–3012).
3. En el navegador: **Ctrl+Shift+R** o ventana de incógnito.
4. Usa solo **http://localhost:3000** — no otra pestaña ni otro puerto guardado.

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

## REELS (videos cortos)

Pantalla **REELS** en el dock inferior (tab azul). Hasta **5 videos** de **30 s** (MP4/WebM).

### Forma fácil (recomendada): desde el código / terminal

Sin clave ni panel. El script copia el video a `public/reels/` y actualiza el manifiesto:

```bash
cd repariland-next
npm run reels:add -- --file "C:/ruta/a/mi-video.mp4" --title "Buzz restaurado" --duration 24
```

Opcional: `--caption "Texto debajo del título"`.

Ver reels publicados:

```bash
npm run reels:list
```

Quitar uno:

```bash
npm run reels:remove -- --id reel-xxxxx
```

Desde la **raíz del repo** puedes usar lo mismo con `npm run reels:add --prefix repariland-next -- ...`.

Tras añadir, recarga la pestaña **REELS** en el navegador. Al hacer deploy, los videos van en el repo como archivos estáticos.

**Deploy:** incluye en el commit `public/reels/*.mp4` y `public/data/reels-manifest.json`. Si en Vercel tienes Supabase o Blob configurados pero sin videos subidos, la app usa igual el manifiesto estático del repo (reel de muestra incluido).

### Manual (sin script)

1. Copia `mi-video.mp4` → `public/reels/`
2. Edita `public/data/reels-manifest.json` (máx. 5 entradas en `items`)

### Panel web + nube (recomendado en producción)

**Supabase Storage** (solo si el bucket ya tiene reels en `manifest.json`; si está vacío, se sirven los del repo):


1. En [Supabase](https://supabase.com), crea un bucket público llamado **`reels`**.
2. Variables en Vercel / `.env.local`:

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role (solo servidor; nunca en el cliente) |
| `REELS_UPLOAD_SECRET` | Clave del panel de administración en la app |

Los videos se guardan en `reels/videos/{id}.mp4` y el listado en `reels/manifest.json`.

**Alternativa:** Vercel Blob con `BLOB_READ_WRITE_TOKEN` (se usa si Supabase no está configurado).
