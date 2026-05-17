/**
 * Quita solo el fondo negro conectado a los bordes (flood fill), sin comer piernas/cables oscuros.
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

/** Usar el PNG original completo; evitar recorte por luminancia (borra piernas/cables). */
const SRC =
  process.env.CONTACTO_SRC ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'e-proyectos-listos-reparilandia-listo',
    'assets',
    'c__Users_alfon_AppData_Roaming_Cursor_User_workspaceStorage_3a4a7ddea0519858bbdace4df32bbcff_images_image-9b0fe7e4-610f-4507-aad6-d87a390bc533.png'
  );

const OUT = path.join(__dirname, '..', 'public', 'assets', 'contacto-ilustracion-recuerdos.png');

function isBgPixel(r, g, b, bg, tolerance) {
  return Math.abs(r - bg[0]) <= tolerance && Math.abs(g - bg[1]) <= tolerance && Math.abs(b - bg[2]) <= tolerance;
}

function floodRemoveBackground(data, width, height, channels, tolerance = 28) {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  const bg = corners.map(([x, y]) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bgAvg = [
    Math.round(bg.reduce((s, c) => s + c[0], 0) / 4),
    Math.round(bg.reduce((s, c) => s + c[1], 0) / 4),
    Math.round(bg.reduce((s, c) => s + c[2], 0) / 4),
  ];

  const visited = new Uint8Array(width * height);
  const queue = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const p = idx * channels;
    if (!isBgPixel(data[p], data[p + 1], data[p + 2], bgAvg, tolerance)) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx - x) / width;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }

  for (let i = 0; i < width * height; i++) {
    if (visited[i]) data[i * channels + 3] = 0;
  }

  return data;
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Origen no encontrado:', SRC);
    process.exit(1);
  }

  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = floodRemoveBackground(Buffer.from(data), info.width, info.height, 4, 32);

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 8 })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`OK -> ${OUT} (${meta.width}x${meta.height}, alpha=${meta.hasAlpha})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
