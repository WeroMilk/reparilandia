/**
 * Redimensiona y convierte PNG de public/assets a WebP (alpha).
 * Uso: node scripts/optimize-public-assets.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const WEBP_QUALITY = 80;

/** Ancho máximo por archivo (display real no necesita 1536px). */
const MAX_WIDTH = {
  'logo-reparilandia.png': 960,
  'home-box-servicio.png': 900,
  'home-box-carritos.png': 900,
  'home-box-novedades.png': 900,
  'noticias-monito-nave.png': 960,
  'contacto-ilustracion-recuerdos.png': 900,
  'contacto-monito-izq-busto.png': 720,
  'historia-linea-tiempo.png': 900,
  'historia-panel-2.png': 720,
  'historia-panel-3.png': 720,
  'historia-panel-4.png': 720,
  'hero-carritos-montables-taller.png': 900,
};

const DEFAULT_MAX_WIDTH = 840;

async function optimizeOne(fileName) {
  if (!fileName.endsWith('.png') || fileName.startsWith('.')) return null;

  const inputPath = path.join(ASSETS_DIR, fileName);
  const outName = fileName.replace(/\.png$/i, '.webp');
  const outputPath = path.join(ASSETS_DIR, outName);
  const before = fs.statSync(inputPath).size;
  const maxW = MAX_WIDTH[fileName] ?? DEFAULT_MAX_WIDTH;

  const meta = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath).rotate();
  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize({
      width: maxW,
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  await pipeline
    .webp({
      quality: WEBP_QUALITY,
      alphaQuality: 90,
      effort: 6,
    })
    .toFile(outputPath);

  const after = fs.statSync(outputPath).size;
  return {
    fileName,
    outName,
    before,
    after,
    width: meta.width,
  };
}

async function main() {
  const files = fs.readdirSync(ASSETS_DIR).filter((f) => f.endsWith('.png'));
  const results = [];

  for (const file of files) {
    results.push(await optimizeOne(file));
  }

  let beforeTotal = 0;
  let afterTotal = 0;
  for (const r of results.filter(Boolean)) {
    beforeTotal += r.before;
    afterTotal += r.after;
    const pct = ((1 - r.after / r.before) * 100).toFixed(0);
    console.log(
      `${r.fileName} → ${r.outName}: ${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB (−${pct}%)`
    );
  }

  console.log(
    `\nTotal assets: ${(beforeTotal / 1024).toFixed(0)}KB → ${(afterTotal / 1024).toFixed(0)}KB (−${((1 - afterTotal / beforeTotal) * 100).toFixed(0)}%)`
  );
  console.log('WebP escritos. Actualiza referencias .png → .webp y borra PNG si quieres.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
