/**
 * Tras `npm run build` en repariland-next, copia .next, public y src a la raíz del repo.
 * Vercel despliega desde la raíz: sin src el NFT falla (ENOENT en /src/lib/...).
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const appDir = path.join(repoRoot, 'repariland-next');

const COPIES = [
  { src: path.join(appDir, '.next'), dest: path.join(repoRoot, '.next'), label: 'repariland-next/.next' },
  { src: path.join(appDir, 'public'), dest: path.join(repoRoot, 'public'), label: 'repariland-next/public' },
  { src: path.join(appDir, 'src'), dest: path.join(repoRoot, 'src'), label: 'repariland-next/src' },
];

function copyDir(src, dest, label) {
  if (!fs.existsSync(src)) {
    console.error('[vercel-sync] Falta:', src);
    process.exit(1);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log('[vercel-sync]', label, '→', path.relative(repoRoot, dest));
}

for (const item of COPIES) {
  copyDir(item.src, item.dest, item.label);
}
console.log('[vercel-sync] Listo.');
