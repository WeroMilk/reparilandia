"""
Reprocesa ilustraciones de servicios desde PNG originales (Gemini):
- Quita fondo por flood-fill desde bordes (no borra playeras negras al centro).
- Quita suelos/mesas grises o blancos desde el borde inferior.
- Normaliza proporciones al lienzo de referencia (pc / consolas / aspiradoras).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS_CURSOR = Path(
    r"C:\Users\alfon\.cursor\projects\e-proyectos-listos-reparilandia-listo\assets"
)
OUT_DIR = ROOT / "public" / "assets"

CANVAS_W = 960
CANVAS_H = 620
CONTENT_FILL = 0.82  # fracción de alto del lienzo ocupada por el sujeto

# Categorías con mesa/suelo visible (gris, blanco, madera)
FLOOR_SLUGS = frozenset({"carritos", "juguetes", "impresoras", "cafeteras", "camaras"})
# Origen con fondo blanco: halos claros en el contorno
WHITE_HALO_SLUGS = frozenset({"otros", "cafeteras", "camaras", "laptops", "diagnostico"})
MAPPING: list[tuple[str, str, str | None]] = [
    ("carritos", "hero-reparamos-carritos.png", "Dise_o_sin_t_tulo__6_"),
    ("laptops", "hero-servicio-laptops.png", "Dise_o_sin_t_tulo__7_"),
    ("pc", "hero-servicio-pc.png", "Dise_o_sin_t_tulo__8_"),
    ("consolas", "hero-servicio-consolas.png", "Dise_o_sin_t_tulo__9_"),
    ("juguetes", "hero-servicio-juguetes.png", "Dise_o_sin_t_tulo__10_"),
    ("diagnostico", "hero-servicio-diagnostico.png", "Dise_o_sin_t_tulo__11_"),
    ("impresoras", "hero-servicio-impresoras.png", "Dise_o_sin_t_tulo__12_"),
    ("camaras", "hero-servicio-camaras.png", "Dise_o_sin_t_tulo__13_"),
    ("cafeteras", "hero-servicio-cafeteras.png", "Dise_o_sin_t_tulo__14_"),
    ("aspiradoras", "hero-servicio-aspiradoras.png", "Dise_o_sin_t_tulo__15_"),
    ("otros", "hero-servicio-otros.png", "Dise_o_sin_t_tulo__16_"),
]

EDGE_TOL = 40
FLOOR_TOL = 68
FLOOR_UP_START = 0.52  # desde ~mitad inferior: quita mesa/suelo sin tocar el centro
FRINGE_TOL = 28
TRIM_PAD = 6


def find_source(glob_part: str | None, out_name: str) -> Path:
    if glob_part is None:
        local = OUT_DIR / out_name
        if local.exists():
            return local
        raise FileNotFoundError(out_name)
    for p in ASSETS_CURSOR.iterdir():
        if glob_part in p.name:
            return p
    raise FileNotFoundError(glob_part)


def corner_bg(rgb: np.ndarray) -> tuple[np.ndarray, bool]:
    h, w = rgb.shape[:2]
    pts = [
        rgb[0, 0],
        rgb[0, w - 1],
        rgb[h - 1, 0],
        rgb[h - 1, w - 1],
        rgb[0, w // 2],
        rgb[h - 1, w // 2],
    ]
    bg = np.mean(np.stack(pts, axis=0), axis=0)
    lum = float(bg.mean())
    return bg, lum > 140


def _flood(
    rgb: np.ndarray,
    alpha: np.ndarray,
    seeds: list[tuple[int, int]],
    bg: np.ndarray,
    tol: int,
) -> None:
    h, w = rgb.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    stack = list(seeds)
    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x]:
            continue
        if alpha[y, x] == 0:
            visited[y, x] = True
            continue
        if int(np.abs(rgb[y, x] - bg).max()) > tol:
            continue
        visited[y, x] = True
        alpha[y, x] = 0
        stack.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])


def knock_background(arr: np.ndarray, slug: str) -> np.ndarray:
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3].copy()
    h, w = rgb.shape[:2]
    bg, is_light = corner_bg(rgb)

    edge_seeds: list[tuple[int, int]] = []
    for x in range(w):
        edge_seeds.extend([(0, x), (h - 1, x)])
    for y in range(h):
        edge_seeds.extend([(y, 0), (y, w - 1)])

    _flood(rgb, alpha, edge_seeds, bg, EDGE_TOL)

    if is_light:
        white = np.array([255, 255, 255], dtype=np.int16)
        _flood(rgb, alpha, edge_seeds, white, 48)
        _flood(rgb, alpha, edge_seeds, np.array([248, 248, 248]), 40)

    if slug in FLOOR_SLUGS:
        _remove_floor_flood(rgb, alpha)
        _remove_midtone_surfaces(rgb, alpha)
    if slug == "juguetes":
        _remove_white_plane(rgb, alpha)
    if slug in WHITE_HALO_SLUGS or is_light:
        _strip_white_halos(rgb, alpha)
        _flood_light_holes(rgb, alpha)
        _clean_white_spill(rgb, alpha)
    _defringe(rgb, alpha, bg)
    if slug in WHITE_HALO_SLUGS or is_light:
        _defringe_white(rgb, alpha)
    arr[:, :, 3] = alpha
    return arr


def _remove_midtone_surfaces(rgb: np.ndarray, alpha: np.ndarray) -> None:
    """Mesa gris/blanca/madera: tonos medios poco saturados en la mitad inferior."""
    h, w = rgb.shape[:2]
    y0 = int(h * 0.42)
    samples: list[np.ndarray] = []
    for y in range(y0, h):
        for x in range(0, w, 3):
            if alpha[y, x] < 128:
                continue
            c = rgb[y, x]
            lum = float(c.mean())
            if 105 < lum < 235 and float(c.max() - c.min()) < 48:
                samples.append(c)
    if len(samples) < 24:
        return
    floor = np.median(np.stack(samples, axis=0), axis=0)
    seeds = [(h - 1, x) for x in range(w)]
    _flood(rgb, alpha, seeds, floor, FLOOR_TOL + 8)


def _remove_white_plane(rgb: np.ndarray, alpha: np.ndarray) -> None:
    h, w = rgb.shape[:2]
    white = np.array([252, 252, 252], dtype=np.int16)
    seeds = [(h - 1, x) for x in range(w)]
    _flood(rgb, alpha, seeds, white, 52)


def _remove_floor_flood(rgb: np.ndarray, alpha: np.ndarray) -> None:
    """Flood-fill de mesa/suelo desde el borde inferior (solo gris/blanco/madera)."""
    h, w = rgb.shape[:2]
    y_start = int(h * FLOOR_UP_START)
    samples = []
    for x in range(0, w, max(1, w // 20)):
        if int(alpha[h - 1, x]) <= 128:
            continue
        c = rgb[h - 1, x]
        if float(c.mean()) > 95:
            samples.append(c)
    if len(samples) < 4:
        return
    floor = np.median(np.stack(samples, axis=0), axis=0)
    if float(floor.mean()) < 52:
        return

    seeds = [(h - 1, x) for x in range(w)]
    _flood(rgb, alpha, seeds, floor, FLOOR_TOL)


def _flood_light_holes(rgb: np.ndarray, alpha: np.ndarray) -> None:
    """Borra blanco/gris claro en huecos que tocan transparencia (entre brazos, etc.)."""
    h, w = rgb.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    stack: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            if alpha[y, x] == 0:
                continue
            lum = float(rgb[y, x].mean())
            sat = float(rgb[y, x].max() - rgb[y, x].min())
            if lum < 188 or sat > 50:
                continue
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and alpha[ny, nx] == 0:
                    stack.append((y, x))
                    break
    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x]:
            continue
        if alpha[y, x] == 0:
            visited[y, x] = True
            continue
        lum = float(rgb[y, x].mean())
        sat = float(rgb[y, x].max() - rgb[y, x].min())
        if lum < 175 or sat > 55:
            continue
        visited[y, x] = True
        alpha[y, x] = 0
        stack.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])


def _strip_white_halos(rgb: np.ndarray, alpha: np.ndarray, passes: int = 8) -> None:
    """Quita píxeles casi blancos pegados al borde del recorte."""
    h, w = alpha.shape
    for _ in range(passes):
        to_clear: list[tuple[int, int]] = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if alpha[y, x] < 12:
                    continue
                lum = int(rgb[y, x].mean())
                if lum < 162:
                    continue
                sat = int(rgb[y, x].max() - rgb[y, x].min())
                if lum < 195 and sat > 48:
                    continue
                nbr_a = alpha[y - 1 : y + 2, x - 1 : x + 2]
                if (nbr_a == 0).sum() >= 2:
                    to_clear.append((y, x))
        if not to_clear:
            break
        for y, x in to_clear:
            alpha[y, x] = 0


def _clean_white_spill(rgb: np.ndarray, alpha: np.ndarray) -> None:
    """Baja alpha en bordes claros (restos de fondo blanco)."""
    h, w = alpha.shape
    a = alpha.astype(np.float32)
    for y in range(h):
        for x in range(w):
            if a[y, x] < 16:
                continue
            lum = float(rgb[y, x].mean())
            if lum < 155:
                continue
            patch = a[max(0, y - 2) : y + 3, max(0, x - 2) : x + 3]
            if (patch == 0).sum() < 2:
                continue
            spill = min(1.0, max(0.0, (lum - 150) / 100.0))
            na = int(a[y, x] * (1.0 - spill * 0.92))
            if na < 20:
                alpha[y, x] = 0
            else:
                alpha[y, x] = na
                rgb[y, x] = (rgb[y, x] * (1.0 - spill * 0.35)).astype(np.int16)


def _defringe(rgb: np.ndarray, alpha: np.ndarray, bg: np.ndarray) -> None:
    h, w = alpha.shape
    a = alpha.copy()
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if a[y, x] == 0:
                continue
            neighbors = a[y - 1 : y + 2, x - 1 : x + 2]
            if (neighbors == 0).any() and int(np.abs(rgb[y, x] - bg).max()) < FRINGE_TOL:
                if int(rgb[y, x].mean()) > 215:
                    alpha[y, x] = 0


def _defringe_white(rgb: np.ndarray, alpha: np.ndarray) -> None:
    """Segunda pasada para fondos blancos: halo gris/blanco residual."""
    h, w = alpha.shape
    white = np.array([255, 255, 255], dtype=np.int16)
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if alpha[y, x] == 0:
                continue
            nbr = alpha[y - 1 : y + 2, x - 1 : x + 2]
            if (nbr == 0).sum() == 0:
                continue
            dist = int(np.abs(rgb[y, x] - white).max())
            lum = int(rgb[y, x].mean())
            if dist < 50 and lum > 168:
                alpha[y, x] = 0
            elif dist < 68 and lum > 198:
                alpha[y, x] = max(0, int(alpha[y, x]) - 100)


def content_bbox(alpha: np.ndarray, thresh: int = 8) -> tuple[int, int, int, int] | None:
    ys, xs = np.where(alpha > thresh)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def trim_alpha(arr: np.ndarray) -> np.ndarray:
    alpha = arr[:, :, 3]
    box = content_bbox(alpha)
    if box is None:
        return arr
    x0, y0, x1, y1 = box
    h, w = arr.shape[:2]
    x0 = max(0, x0 - TRIM_PAD)
    y0 = max(0, y0 - TRIM_PAD)
    x1 = min(w - 1, x1 + TRIM_PAD)
    y1 = min(h - 1, y1 + TRIM_PAD)
    return arr[y0 : y1 + 1, x0 : x1 + 1]


def normalize_canvas(arr: np.ndarray) -> np.ndarray:
    arr = trim_alpha(arr)
    alpha = arr[:, :, 3]
    box = content_bbox(alpha)
    if box is None:
        return arr
    x0, y0, x1, y1 = box
    crop = arr[y0 : y1 + 1, x0 : x1 + 1]
    ch, cw = crop.shape[0], crop.shape[1]
    target_h = int(CANVAS_H * CONTENT_FILL)
    target_w = int(CANVAS_W * 0.94)
    scale = min(target_h / ch, target_w / cw)
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    im = Image.fromarray(crop).resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = np.zeros((CANVAS_H, CANVAS_W, 4), dtype=np.uint8)
    ox = (CANVAS_W - nw) // 2
    oy = (CANVAS_H - nh) // 2
    resized = np.array(im)
    canvas[oy : oy + nh, ox : ox + nw] = resized
    return canvas


def process(slug: str, out_name: str, glob_part: str | None) -> None:
    src = find_source(glob_part, out_name)
    im = Image.open(src).convert("RGBA")
    arr = np.array(im)

    # Siempre flood desde bordes (origen Gemini); las "excelentes" no pasan por borrado global
    arr = knock_background(arr, slug)

    arr = normalize_canvas(arr)
    out = OUT_DIR / out_name
    Image.fromarray(arr).save(out, "PNG", optimize=True)
    tr = float((arr[:, :, 3] == 0).mean())
    print(f"OK {slug:12} <- {src.name[:48]:48}  {out.name}  trans={tr:.2%}")


def normalize_only(slug: str, out_name: str) -> None:
    out = OUT_DIR / out_name
    arr = np.array(Image.open(out).convert("RGBA"))
    arr = normalize_canvas(arr)
    Image.fromarray(arr).save(out, "PNG", optimize=True)
    print(f"OK {slug:12} normalize-only -> {out.name}")


def main() -> None:
    if not ASSETS_CURSOR.is_dir():
        raise SystemExit(f"No existe carpeta origen: {ASSETS_CURSOR}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for slug, out_name, glob_part in MAPPING:
        process(slug, out_name, glob_part)


if __name__ == "__main__":
    main()
