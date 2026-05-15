/**
 * Reinicio limpio del dev server: evita "missing required error components, refreshing..."
 * (caché .next inconsistente o varios `next dev` a la vez).
 */
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const nextDir = path.join(projectRoot, '.next');

function rm(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Eliminado:', dir);
  }
}

rm(nextDir);

// Symlink de deploy en raíz del monorepo (vercel.json) puede confundir otro `next dev`
const rootNext = path.join(projectRoot, '..', '.next');
rm(rootNext);

console.log('Iniciando next dev…');
const child = spawn('npm', ['run', 'dev'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));
