/**
 * Añade un reel copiando el video a public/reels/ y actualizando el manifiesto.
 *
 * Uso:
 *   npm run reels:add -- --file ./videos/mi-clip.mp4 --title "Título" [--caption "Texto"] [--duration 28]
 *   npm run reels:list
 *   npm run reels:remove -- --id reel-abc123
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const manifestPath = path.join(projectRoot, 'public', 'data', 'reels-manifest.json');
const reelsDir = path.join(projectRoot, 'public', 'reels');
const MAX_REELS = 5;
const MAX_DURATION = 90;
const ALLOWED_EXT = new Set(['.mp4', '.webm']);

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file' || a === '-f') out.file = argv[++i];
    else if (a === '--title' || a === '-t') out.title = argv[++i];
    else if (a === '--caption' || a === '-c') out.caption = argv[++i];
    else if (a === '--duration' || a === '-d') out.duration = Number(argv[++i]);
    else if (a === '--id') out.id = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
    else if (!a.startsWith('-')) out._.push(a);
  }
  return out;
}

function readManifest() {
  if (!fs.existsSync(manifestPath)) {
    return { version: 1, items: [] };
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function writeManifest(manifest) {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

function createId() {
  return `reel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function printHelp() {
  console.log(`
Reparilandia — gestión de REELS (sin clave, archivos en el repo)

  npm run reels:add -- --file <ruta.mp4|webm> --title "Título" [opciones]
  npm run reels:list
  npm run reels:remove -- --id <id-del-reel>

Opciones de add:
  --file, -f       Ruta al video (obligatorio)
  --title, -t      Título visible (obligatorio)
  --caption, -c    Descripción opcional
  --duration, -d   Segundos (máx. ${MAX_DURATION}); si omites, se guarda 0

Ejemplo:
  npm run reels:add -- -f ./mi-video.mp4 -t "Buzz restaurado" -d 24
`);
}

function cmdList() {
  const manifest = readManifest();
  if (!manifest.items?.length) {
    console.log('No hay reels. Añade uno con: npm run reels:add -- --file ... --title ...');
    return;
  }
  console.log(`${manifest.items.length}/${MAX_REELS} reels:\n`);
  for (const item of manifest.items) {
    console.log(`  ${item.id}`);
    console.log(`    título: ${item.title}`);
    console.log(`    video:  ${item.videoUrl}`);
    console.log(`    ${item.durationSec}s · ${item.likeCount} likes\n`);
  }
}

function cmdRemove(id) {
  if (!id) {
    console.error('Indica --id <reel-id>. Lista con: npm run reels:list');
    process.exit(1);
  }
  const manifest = readManifest();
  const before = manifest.items?.length ?? 0;
  manifest.items = (manifest.items ?? []).filter((item) => item.id !== id);
  if (manifest.items.length === before) {
    console.error('No se encontró el reel:', id);
    process.exit(1);
  }
  writeManifest(manifest);
  const fileStem = path.join(reelsDir, id);
  for (const ext of ALLOWED_EXT) {
    const p = fileStem + ext;
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log('Eliminado archivo:', p);
    }
  }
  console.log('Reel eliminado del manifiesto:', id);
}

function cmdAdd(args) {
  if (!args.file || !args.title) {
    console.error('Faltan --file y --title.\n');
    printHelp();
    process.exit(1);
  }

  const src = path.resolve(args.file);
  if (!fs.existsSync(src)) {
    console.error('No existe el archivo:', src);
    process.exit(1);
  }

  const ext = path.extname(src).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    console.error('Formato no válido. Usa .mp4 o .webm');
    process.exit(1);
  }

  const durationSec =
    typeof args.duration === 'number' && Number.isFinite(args.duration)
      ? Math.round(args.duration * 10) / 10
      : 0;

  if (durationSec > MAX_DURATION) {
    console.error(`Duración máxima: ${MAX_DURATION} segundos.`);
    process.exit(1);
  }

  if (durationSec === 0) {
    console.warn('Aviso: no indicaste --duration. Comprueba que el video dure ≤ 90 s.');
  }

  const manifest = readManifest();
  manifest.items = manifest.items ?? [];
  if (manifest.items.length >= MAX_REELS) {
    console.error(`Ya hay ${MAX_REELS} reels. Elimina uno: npm run reels:remove -- --id <id>`);
    process.exit(1);
  }

  const id = createId();
  fs.mkdirSync(reelsDir, { recursive: true });
  const destName = `${id}${ext}`;
  const destPath = path.join(reelsDir, destName);
  fs.copyFileSync(src, destPath);

  const reel = {
    id,
    title: args.title.trim(),
    ...(args.caption?.trim() ? { caption: args.caption.trim() } : {}),
    videoUrl: `/reels/${destName}`,
    durationSec,
    likeCount: 0,
    createdAt: new Date().toISOString(),
  };

  manifest.version = 1;
  manifest.items.push(reel);
  writeManifest(manifest);

  console.log('Reel añadido correctamente.');
  console.log('  id:    ', id);
  console.log('  url:   ', reel.videoUrl);
  console.log('  manifiesto:', path.relative(projectRoot, manifestPath));
  console.log('\nRecarga la app (pestaña REELS). En dev no hace falta reiniciar el servidor.');
}

const rawArgv = process.argv.slice(2);
const args = parseArgs(rawArgv);
const subcommand = rawArgv.find((a) => a === 'list' || a === 'remove');

if (args.help) {
  printHelp();
  process.exit(0);
}

if (subcommand === 'list') {
  cmdList();
} else if (subcommand === 'remove') {
  cmdRemove(args.id);
} else {
  cmdAdd(args);
}
