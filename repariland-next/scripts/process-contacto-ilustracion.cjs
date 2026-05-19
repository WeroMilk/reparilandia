/**
 * Quita fondo oscuro de borde + tablero gris/blanco (incluso islas entre personajes).
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC =
  process.env.CONTACTO_SRC ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'e-proyectos-listos-reparilandia-listo',
    'assets',
    'c__Users_alfon_AppData_Roaming_Cursor_User_workspaceStorage_3a4a7ddea0519858bbdace4df32bbcff_images_Dise_o_sin_t_tulo__18_-cc07776d-894c-4cf9-9818-acd2e2c49dcf.png'
  );

const OUT = path.join(__dirname, '..', 'public', 'assets', 'contacto-ilustracion-recuerdos.png');

function channelSpread(r, g, b) {
  return Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
}

function isNeutral(r, g, b, spread = 14) {
  return channelSpread(r, g, b) <= spread;
}

/** Tablero y grises claros de “transparencia falsa”. */
function isCheckerboardBg(r, g, b) {
  if (!isNeutral(r, g, b, 12)) return false;
  const avg = (r + g + b) / 3;
  return avg >= 178 && avg <= 255;
}

/** Marco oscuro alrededor del PNG (exports con borde). */
function isDarkBorderBg(r, g, b) {
  if (!isNeutral(r, g, b, 18)) return false;
  return r <= 58 && g <= 58 && b <= 78;
}

/** Solo negro casi puro del export (nunca la tela de las camisetas). */
function isExactBlackBg(r, g, b) {
  return r <= 5 && g <= 5 && b <= 5;
}

function cornersAreBlackBackdrop(data, width, height, channels) {
  const pts = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  return pts.every(([x, y]) => {
    const p = (y * width + x) * channels;
    return data[p] <= 8 && data[p + 1] <= 8 && data[p + 2] <= 8;
  });
}

function isEdgeRemovable(r, g, b, blackBackdrop) {
  if (isCheckerboardBg(r, g, b)) return true;
  if (blackBackdrop) return isExactBlackBg(r, g, b);
  return isDarkBorderBg(r, g, b) || isExactBlackBg(r, g, b);
}

function floodFromBorder(data, width, height, channels, isRemovableFn) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const p = idx * channels;
    if (!isRemovableFn(data[p], data[p + 1], data[p + 2])) return;
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

  return visited;
}

function clearVisited(data, width, height, channels, visited) {
  for (let i = 0; i < width * height; i++) {
    if (visited[i]) data[i * channels + 3] = 0;
  }
}

/** Expande transparencia al tablero atrapado entre personajes. */
function expandCheckerboardIntoTransparent(data, width, height, channels, passes = 48) {
  const alphaAt = (idx) => data[idx * channels + 3];
  const setTransparent = (idx) => {
    data[idx * channels + 3] = 0;
  };

  for (let pass = 0; pass < passes; pass++) {
    let changed = false;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (alphaAt(idx) === 0) continue;
        const p = idx * channels;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        if (!isCheckerboardBg(r, g, b)) continue;

        const neighbors = [
          idx - 1,
          idx + 1,
          idx - width,
          idx + width,
        ];
        if (neighbors.some((n) => n >= 0 && n < width * height && alphaAt(n) === 0)) {
          setTransparent(idx);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
}

/** Solo tablero en islas internas; nunca negro global (rompe camisetas). */
function removeRemainingCheckerboardIslands(data, width, height, channels) {
  for (let i = 0; i < width * height; i++) {
    if (data[i * channels + 3] === 0) continue;
    const p = i * channels;
    if (isCheckerboardBg(data[p], data[p + 1], data[p + 2])) {
      data[p + 3] = 0;
    }
  }
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Origen no encontrado:', SRC);
    process.exit(1);
  }

  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.from(data);

  const blackBackdrop = cornersAreBlackBackdrop(rgba, info.width, info.height, 4);
  const removable = (r, g, b) => isEdgeRemovable(r, g, b, blackBackdrop);
  const borderVisited = floodFromBorder(rgba, info.width, info.height, 4, removable);
  clearVisited(rgba, info.width, info.height, 4, borderVisited);
  expandCheckerboardIntoTransparent(rgba, info.width, info.height, 4);
  if (!blackBackdrop) {
    removeRemainingCheckerboardIslands(rgba, info.width, info.height, 4);
  }

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 8 })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  const { data: outData, info: outInfo } = await sharp(OUT).raw().toBuffer({ resolveWithObject: true });
  let leftoverBg = 0;
  for (let i = 0; i < outInfo.width * outInfo.height; i++) {
    const r = outData[i * 4];
    const g = outData[i * 4 + 1];
    const b = outData[i * 4 + 2];
    const a = outData[i * 4 + 3];
    if (a > 20 && isCheckerboardBg(r, g, b)) leftoverBg++;
  }

  console.log(`OK -> ${OUT} (${meta.width}x${meta.height}, alpha=${meta.hasAlpha}, leftover=${leftoverBg})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
