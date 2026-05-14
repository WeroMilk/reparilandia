"""Quita fondo oscuro del logo por inundación desde el borde + suavizado ligero del alfa."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


def saturation(rgb: np.ndarray) -> float:
    r, g, b = float(rgb[0]), float(rgb[1]), float(rgb[2])
    m = max(r, g, b)
    if m < 1e-6:
        return 0.0
    return (m - min(r, g, b)) / m


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    # Coloca aquí el PNG original (con fondo); no va en /public.
    src = root / "scripts" / "logo-reparilandia-src.png"
    out = root / "public" / "assets" / "logo-reparilandia.png"

    if not src.is_file():
        print("missing", src, "- copy your logo PNG to scripts/logo-reparilandia-src.png")
        return

    img = Image.open(src).convert("RGBA")
    a = np.array(img)
    h, w = a.shape[:2]
    rgb = a[:, :, :3].astype(np.float32)

    bg = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for y in range(h):
        for x in (0, w - 1):
            if not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))

    while q:
        y, x = q.popleft()
        cur = rgb[y, x]
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            ny, nx = y + dy, x + dx
            if ny < 0 or ny >= h or nx < 0 or nx >= w or bg[ny, nx]:
                continue
            cand = rgb[ny, nx]
            mean_c = float(np.mean(cand))
            diff = float(np.max(np.abs(cand - cur)))
            sat_c = saturation(cand)

            dark = mean_c < 76
            similar_dark = diff < 44 and mean_c < 92 and sat_c < 0.52
            navy_flat = mean_c < 88 and sat_c < 0.38 and diff < 55

            if dark or similar_dark or navy_flat:
                bg[ny, nx] = True
                q.append((ny, nx))

    alpha = np.where(bg, 0, 255).astype(np.uint8)

    try:
        from scipy import ndimage

        af = alpha.astype(np.float32) / 255.0
        af = ndimage.gaussian_filter(af, sigma=0.85)
        alpha = np.clip(af * 255, 0, 255).astype(np.uint8)
    except ImportError:
        pass

    a[:, :, 3] = alpha
    Image.fromarray(a).save(out, optimize=True)
    print("saved", out, "bg%", round(100 * float(bg.mean()), 2))


if __name__ == "__main__":
    main()
