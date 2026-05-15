"""Generate transparent square favicon from source PNG (removes checkerboard bg)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "favicon-source.png"
OUT_ICON = ROOT / "src" / "app" / "icon.png"
OUT_APPLE = ROOT / "src" / "app" / "apple-icon.png"
OUT_FAVICON = ROOT / "src" / "app" / "favicon.ico"
FAVICON_SIZE = 32
ICON_SIZE = 512
APPLE_SIZE = 180


def knock_checkerboard(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.int16)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    neutral = (np.abs(r - g) <= 12) & (np.abs(g - b) <= 12)
    # Checkerboard squares (white + light gray) including pockets inside the logo bbox.
    checker = neutral & ((r > 200) | ((r > 178) & (r < 225)))
    arr[checker, 3] = 0
    # Remove light neutral halos (avoids white box in browser tabs).
    halo = neutral & (r > 232) & (arr[:, :, 3] > 0)
    arr[halo, 3] = 0
    return Image.fromarray(arr)


def trim_and_square(im: Image.Image, margin_frac: float = 0.04) -> Image.Image:
    """Fit the full logo inside a square (no crop) with a thin transparent margin."""
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


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source: {SRC}")

    im = knock_checkerboard(Image.open(SRC))
    squared = trim_and_square(im)
    squared.resize((ICON_SIZE, ICON_SIZE), Image.Resampling.LANCZOS).save(
        OUT_ICON, "PNG", optimize=True
    )
    squared.resize((APPLE_SIZE, APPLE_SIZE), Image.Resampling.LANCZOS).save(
        OUT_APPLE, "PNG", optimize=True
    )
    squared.resize((FAVICON_SIZE, FAVICON_SIZE), Image.Resampling.LANCZOS).save(
        OUT_FAVICON,
        format="ICO",
        sizes=[(FAVICON_SIZE, FAVICON_SIZE)],
    )
    print("Wrote", OUT_ICON.name, OUT_ICON.stat().st_size, "bytes")
    print("Wrote", OUT_APPLE.name, OUT_APPLE.stat().st_size, "bytes")
    print("Wrote", OUT_FAVICON.name, OUT_FAVICON.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
