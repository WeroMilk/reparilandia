"""Knock outer black margins to alpha for Historia spotlight PNGs."""
from __future__ import annotations

from pathlib import Path

from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "public" / "assets" / "historia-linea-tiempo.png",
    ROOT / "public" / "assets" / "historia-panel-2.png",
    ROOT / "public" / "assets" / "historia-panel-3.png",
    ROOT / "public" / "assets" / "historia-panel-4.png",
]
TOL = 38


def knockout(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    h, w = rgb.shape[:2]

    corners = np.stack(
        [rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]],
        axis=0,
    )
    bg = corners.mean(axis=0)

    visited = np.zeros((h, w), dtype=bool)
    stack = [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]

    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x]:
            continue
        if np.abs(rgb[y, x] - bg).max() > TOL:
            continue
        visited[y, x] = True
        arr[y, x, 3] = 0
        stack.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])

    Image.fromarray(arr).save(path, "PNG")
    a = arr[:, :, 3]
    print(path.name, "RGBA", "transparent_ratio", round(float((a == 0).mean()), 4))


def main() -> None:
    for p in FILES:
        knockout(p)


if __name__ == "__main__":
    main()
