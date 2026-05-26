/**
 * Tras `npm run build` en repariland-next, copia .next y public a la raíz del repo.
 * Vercel despliega desde la raíz: los symlinks rompen /api/* (chunks 500).
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const appDir = path.join(repoRoot, 'repariland-next');
const nextSrc = path.join(appDir, '.next');
const publicSrc = path.join(appDir, 'public');
const nextDest = path.join(repoRoot, '.next');
const publicDest = path.join(repoRoot, 'public');

function copyDir(src, dest, label) {
  if (!fs.existsSync(src)) {
    console.error('[vercel-sync] Falta:', src);
    process.exit(1);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log('[vercel-sync]', label, '→', path.relative(repoRoot, dest));
}

copyDir(nextSrc, nextDest, 'repariland-next/.next');
copyDir(publicSrc, publicDest, 'repariland-next/public');
console.log('[vercel-sync] Listo.');
