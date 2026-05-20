/**
 * Comprime iconos en src/app/ (sin duplicar en public/ — evita conflicto Next.js).
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const appDir = path.join(projectRoot, 'src', 'app');
const srcIcon =
  [path.join(appDir, 'icon.png'), path.join(projectRoot, 'public', 'assets', 'favicon-source.png')].find(
    (p) => fs.existsSync(p),
  ) ?? null;

async function main() {
  if (!srcIcon) {
    console.error('No hay src/app/icon.png ni public/assets/favicon-source.png');
    process.exit(1);
  }

  const base = sharp(srcIcon, { failOn: 'none' });
  await base
    .clone()
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, 'icon.png'));

  await base
    .clone()
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, 'apple-icon.png'));

  console.log('OK src/app/icon.png (32px) y apple-icon.png (180px)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
