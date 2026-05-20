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

Abre [http://localhost:3000](http://localhost:3000).

Si ves **404** en `layout.css`, `main-app.js` o `page.js` en la consola:

1. Cierra **todas** las terminales con Node/Next.
2. Ejecuta otra vez **`npm run dev`** (o `npm run dev:clean` dentro de `repariland-next`).
3. En el navegador: **Ctrl+Shift+R** (recarga forzada) o ventana de incógnito.
4. Solo **http://localhost:3000** — no uses otro puerto ni pestañas viejas.

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

### Manual (sin script)

1. Copia `mi-video.mp4` → `public/reels/`
2. Edita `public/data/reels-manifest.json` (máx. 5 entradas en `items`)

### Panel web + nube (opcional)

| Variable | Uso |
|----------|-----|
| `BLOB_READ_WRITE_TOKEN` | Subida y manifiesto en Vercel Blob |
| `REELS_UPLOAD_SECRET` | Clave del panel de administración en la app |
