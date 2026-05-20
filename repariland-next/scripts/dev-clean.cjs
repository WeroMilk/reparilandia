/**
 * Reinicio limpio del dev server: evita 404 en /_next/static/chunks/*
 * (caché .next inconsistente o varios `next dev` a la vez).
 */
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const nextDir = path.join(projectRoot, '.next');
const port = Number(process.env.PORT) || 3000;
const extraPorts = [];
for (let p = 3000; p <= 3012; p += 1) extraPorts.push(p);

function rm(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    if (process.env.DEV_CLEAN_VERBOSE === '1') console.log('Eliminado:', dir);
  }
}

function freePort(p) {
  try {
    if (process.platform === 'win32') {
      const out = execSync(`netstat -ano | findstr ":${p}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        if (!line.includes('LISTENING')) continue;
        const pid = line.trim().split(/\s+/).pop();
        if (pid && pid !== '0') pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          if (process.env.DEV_CLEAN_VERBOSE === '1') console.log('Puerto', p, 'liberado (PID', pid + ')');
        } catch {
          /* ya terminado */
        }
      }
      return;
    }
    execSync(`npx --yes kill-port ${p}`, { stdio: 'ignore', cwd: projectRoot });
  } catch {
    /* puerto libre */
  }
}

rm(nextDir);

// Symlink de deploy en raíz del monorepo (vercel.json) puede confundir otro `next dev`
const rootNext = path.join(projectRoot, '..', '.next');
rm(rootNext);

for (const p of extraPorts) {
  freePort(p);
}

try {
  execSync('node scripts/optimize-app-icons.cjs', {
    cwd: projectRoot,
    stdio: 'ignore',
  });
} catch {
  /* iconos opcionales */
}

console.log('');
console.log('  Reparilandia (Next.js App Router)');
console.log('  → http://localhost:' + port);
console.log('  Solo desde repariland-next. Si la página no carga: cierra pestañas localhost y Ctrl+Shift+R');
console.log('');

const child = spawn('npx', ['next', 'dev', '-p', String(port)], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: String(port) },
});

child.on('exit', (code) => process.exit(code ?? 0));
