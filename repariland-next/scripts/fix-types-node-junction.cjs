/**
 * Algunas herramientas resuelven @types/node como si existiera node_modules/.pnpm/...
 * (por ejemplo tras usar pnpm antes). Con npm plano esa ruta no existe y tsconfig parece "roto".
 * En Windows recreamos una unión (junction) hacia node_modules/@types/node.
 */
const fs = require('fs');
const path = require('path');

if (process.platform !== 'win32') {
  process.exit(0);
}

const projectRoot = path.join(__dirname, '..');
const typesNodeDir = path.join(projectRoot, 'node_modules', '@types', 'node');
const pkgJson = path.join(typesNodeDir, 'package.json');

if (!fs.existsSync(pkgJson)) {
  process.exit(0);
}

let version;
try {
  version = JSON.parse(fs.readFileSync(pkgJson, 'utf8')).version;
} catch {
  process.exit(0);
}

const linkDir = path.join(
  projectRoot,
  'node_modules',
  '.pnpm',
  `@types+node@${version}`,
  'node_modules',
  '@types',
);
const linkPath = path.join(linkDir, 'node');

try {
  fs.mkdirSync(linkDir, { recursive: true });
  if (fs.existsSync(linkPath)) {
    process.exit(0);
  }
  fs.symlinkSync(typesNodeDir, linkPath, 'junction');
} catch {
  process.exit(0);
}
