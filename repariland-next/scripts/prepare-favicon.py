"""Generate transparent square favicon from source PNG (removes checkerboard bg)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "favicon-source.png"
OUT_ICON = ROOT / "src" / "app" / "icon.png"
OUT_APPLE = ROOT / "src" / "app" / "apple-icon.png"
OUT_FAVICON = ROOT / "src" / "app" / "favicon.ico"
ICON_SIZE = 512
APPLE_SIZE = 180
FAVICON_SIZES = (16, 32, 48)


def knock_checkerboard(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.int16)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    neutral = (np.abs(r - g) <= 14) & (np.abs(g - b) <= 14)
    # Fondo blanco sólido o gris de exportación (no colores del logo).
    solid_white = (r >= 250) & (g >= 250) & (b >= 250)
    backdrop = solid_white | (
        neutral
        & (
            (r >= 248)
            | (r > 200)
            | ((r > 168) & (r < 238))
        )
    )
    arr[backdrop, 3] = 0
    # Halos casi blancos pegados al borde del lienzo.
    halo = neutral & (r >= 244) & (arr[:, :, 3] > 0)
    arr[halo, 3] = 0
    return Image.fromarray(arr)


def tight_content_bbox(im: Image.Image, alpha_min: int = 20) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    mask = arr[:, :, 3] > alpha_min
    if not mask.any():
        return im
    ys, xs = np.where(mask)
    return im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def boost_for_browser_tab(im: Image.Image) -> Image.Image:
    """Brighter, punchier colors so the mark reads on dark browser chrome."""
    out = ImageEnhance.Brightness(im).enhance(1.52)
    out = ImageEnhance.Contrast(out).enhance(1.32)
    out = ImageEnhance.Color(out).enhance(1.22)
    out = ImageEnhance.Sharpness(out).enhance(1.4)
    return out


def pad_on_white(
    im: Image.Image,
    size: int,
    *,
    vertical_margin_frac: float = 0.13,
    horizontal_margin_frac: float = 0.09,
) -> Image.Image:
    """Centra el logo en un cuadrado blanco con aire arriba y abajo (pantalla de inicio)."""
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    content = tight_content_bbox(im)
    cw, ch = content.size
    if cw == 0 or ch == 0:
        return canvas

    v_pad = int(round(size * vertical_margin_frac))
    h_pad = int(round(size * horizontal_margin_frac))
    avail_w = max(1, size - 2 * h_pad)
    avail_h = max(1, size - 2 * v_pad)
    scale = min(avail_w / cw, avail_h / ch)
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    scaled = content.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(scaled, ((size - nw) // 2, (size - nh) // 2), scaled)
    return canvas


def trim_and_square(im: Image.Image, margin_frac: float = 0.08) -> Image.Image:
    """Fit logo in a square with a small transparent margin."""
    bbox = im.getbbox()
    if not bbox:
        return im
    cropped = im.crop(bbox)
    cw, ch = cropped.size
    content_max = max(cw, ch)
    side = max(1, int(round(content_max / (1 - 2 * margin_frac))))
    scale = side / content_max
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    scaled = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(scaled, ((side - nw) // 2, (side - nh) // 2), scaled)
    return canvas


def resize_sharp(im: Image.Image, size: int) -> Image.Image:
    if im.size[0] == size:
        return im
    mid = max(size * 2, size + 8)
    if im.size[0] < mid:
        im = im.resize((mid, mid), Image.Resampling.LANCZOS)
    out = im.resize((size, size), Image.Resampling.LANCZOS)
    return ImageEnhance.Sharpness(out).enhance(1.2)


def build_master() -> Image.Image:
    if not SRC.exists():
        raise SystemExit(f"Missing source: {SRC}")

    raw = knock_checkerboard(Image.open(SRC))
    content = tight_content_bbox(raw)
    boosted = boost_for_browser_tab(content)
    return trim_and_square(boosted, margin_frac=0.08)


def build_home_screen_icon(im: Image.Image, size: int) -> Image.Image:
    """Icono para «Añadir a pantalla de inicio»: fondo blanco y margen vertical."""
    return pad_on_white(im, size, vertical_margin_frac=0.13, horizontal_margin_frac=0.09)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source: {SRC}")

    raw = knock_checkerboard(Image.open(SRC))
    content = tight_content_bbox(raw)
    boosted = boost_for_browser_tab(content)
    master = trim_and_square(boosted, margin_frac=0.08)

    build_home_screen_icon(boosted, ICON_SIZE).save(OUT_ICON, "PNG", optimize=True)
    build_home_screen_icon(boosted, APPLE_SIZE).save(OUT_APPLE, "PNG", optimize=True)

    favicons = [resize_sharp(master, s) for s in FAVICON_SIZES]
    favicons[-1].save(
        OUT_FAVICON,
        format="ICO",
        sizes=[(s, s) for s in FAVICON_SIZES],
        append_images=favicons[:-1],
    )

    print("Wrote", OUT_ICON.name, OUT_ICON.stat().st_size, "bytes")
    print("Wrote", OUT_APPLE.name, OUT_APPLE.stat().st_size, "bytes")
    print("Wrote", OUT_FAVICON.name, OUT_FAVICON.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
