/**
 * Comprime iconos en src/app/ (sin duplicar en public/ — evita conflicto Next.js).
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const appDir = path.join(projectRoot, 'src', 'app');
const faviconSource = path.join(projectRoot, 'public', 'assets', 'favicon-source.png');
const existingIcon = path.join(appDir, 'icon.png');

/** Origen distinto del destino (sharp no permite in-place). */
function resolveSourceIcon() {
  if (fs.existsSync(faviconSource)) return faviconSource;
  if (fs.existsSync(existingIcon)) return existingIcon;
  return null;
}

async function writePng(base, size, dest) {
  const tmp = `${dest}.tmp`;
  const contentFrac = 0.52;
  const maxDim = Math.max(1, Math.round(size * contentFrac));

  const logo = await base
    .clone()
    .resize(maxDim, maxDim, {
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(tmp);

  fs.renameSync(tmp, dest);
}

async function main() {
  const srcIcon = resolveSourceIcon();
  if (!srcIcon) {
    console.error('No hay public/assets/favicon-source.png ni src/app/icon.png');
    process.exit(1);
  }

  const base = sharp(srcIcon, { failOn: 'none' });
  await writePng(base, 32, path.join(appDir, 'icon.png'));
  await writePng(base, 180, path.join(appDir, 'apple-icon.png'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
