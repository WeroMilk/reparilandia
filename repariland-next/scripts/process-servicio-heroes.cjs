/**
 * @deprecated Usar scripts/knockout-servicio-heroes.py (flood-fill desde bordes).
 * Procesa ilustraciones de servicios: quita fondo sólido (blanco/negro) y exporta PNG con alpha.
 * Uso: node scripts/process-servicio-heroes.cjs
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const ASSETS_CURSOR =
  process.env.SERVICIOS_SRC_DIR ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'e-proyectos-listos-reparilandia-listo',
    'assets'
  );

const OUT_DIR = path.join(__dirname, '..', 'public', 'assets');

const MAPPING = [
  {
    slug: 'laptops',
    glob: 'Gemini_Generated_Image_iy268eiy268eiy26-3bb834b6-332f-4cc1-8a9a-0c98de2eeebb.png',
  },
  {
    slug: 'pc',
    glob: 'Gemini_Generated_Image_ia28i9ia28i9ia28-6b53fbc6-9a03-46c1-b0bd-cc6bcbbcc723.png',
  },
  {
    slug: 'consolas',
    glob: 'Gemini_Generated_Image_e707ete707ete707-9c0b24eb-4fb0-4dea-83fb-8410caf8e571.png',
  },
  {
    slug: 'juguetes',
    glob: 'Gemini_Generated_Image_gzzpvsgzzpvsgzzp-3fe595aa-81c6-40c3-8d8f-cd1c4a3d952e.png',
  },
  {
    slug: 'diagnostico',
    glob: 'Gemini_Generated_Image_c532alc532alc532-fe80e92e-6128-4ab8-bae3-b503b52c6c1e.png',
  },
  {
    slug: 'impresoras',
    glob: 'Gemini_Generated_Image_gcxsbigcxsbigcxs-364d8e2d-0e34-45a4-a252-b4de8d97d650.png',
  },
  {
    slug: 'camaras',
    glob: 'Gemini_Generated_Image_8ookm68ookm68ook-29843bf5-dceb-41c5-8ae7-c5ee2e6dc018.png',
  },
  {
    slug: 'cafeteras',
    glob: 'Gemini_Generated_Image_2ljadj2ljadj2lja-3d6e1eaf-4d51-447c-b4d1-8fa17732c1b9.png',
  },
  {
    slug: 'aspiradoras',
    glob: 'Gemini_Generated_Image_pvzz2cpvzz2cpvzz-484b2eb9-33e4-4983-a478-fa1376fd4654.png',
  },
  {
    slug: 'otros',
    glob: 'Gemini_Generated_Image_4620lz4620lz4620-098e5255-9f19-4555-92cd-9cb45e3a7855.png',
  },
];

function findSourceFile(globPart) {
  const files = fs.readdirSync(ASSETS_CURSOR);
  const hit = files.find((f) => f.includes(globPart));
  if (!hit) throw new Error(`No se encontró imagen con patrón: ${globPart}`);
  return path.join(ASSETS_CURSOR, hit);
}

function sampleBgColor(data, width, height, channels) {
  const samples = [];
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
  ];
  for (const [x, y] of points) {
    const i = (y * width + x) * channels;
    samples.push([data[i], data[i + 1], data[i + 2]]);
  }
  const avg = [0, 0, 0];
  for (const [r, g, b] of samples) {
    avg[0] += r;
    avg[1] += g;
    avg[2] += b;
  }
  avg[0] /= samples.length;
  avg[1] /= samples.length;
  avg[2] /= samples.length;
  const lum = (avg[0] + avg[1] + avg[2]) / 3;
  return { avg, isLight: lum > 128 };
}

function removeSolidBackground(buffer, info) {
  const { width, height, channels } = info;
  const data = Buffer.from(buffer);
  const { avg, isLight } = sampleBgColor(data, width, height, channels);
  const threshold = 42;
  const soft = 18;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const dist = Math.sqrt((r - avg[0]) ** 2 + (g - avg[1]) ** 2 + (b - avg[2]) ** 2);
      const lum = (r + g + b) / 3;

      let alpha = 255;
      if (isLight) {
        if (lum > 252 || dist < threshold) alpha = 0;
        else if (lum > 252 - soft || dist < threshold + soft) {
          const t = Math.min(1, Math.max((252 - lum) / soft, (dist - threshold) / soft));
          alpha = Math.round(255 * t);
        }
      } else {
        if (lum < 8 || dist < threshold) alpha = 0;
        else if (lum < 8 + soft || dist < threshold + soft) {
          const t = Math.min(1, Math.max((lum - 8) / soft, (dist - threshold) / soft));
          alpha = Math.round(255 * t);
        }
      }
      data[i + 3] = alpha;
    }
  }
  return data;
}

async function processOne({ slug, glob }) {
  const src = findSourceFile(glob);
  const out = path.join(OUT_DIR, `hero-servicio-${slug}.png`);

  const base = sharp(src).ensureAlpha();
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const rgba = removeSolidBackground(data, info);

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 12 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`OK ${slug} -> ${path.basename(out)} (${meta.width}x${meta.height}, alpha=${meta.hasAlpha})`);
}

async function main() {
  if (!fs.existsSync(ASSETS_CURSOR)) {
    console.error('Carpeta de origen no encontrada:', ASSETS_CURSOR);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const only = process.env.ONLY_SLUGS
    ? process.env.ONLY_SLUGS.split(',').map((s) => s.trim())
    : null;
  for (const item of MAPPING) {
    if (only && !only.includes(item.slug)) continue;
    await processOne(item);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
