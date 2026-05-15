"""Knock outer black to alpha for noticias-monito-periodico.png."""
from pathlib import Path

from PIL import Image
import numpy as np

path = Path(__file__).resolve().parents[1] / "public" / "assets" / "noticias-monito-periodico.png"
TOL = 38

im = Image.open(path).convert("RGBA")
arr = np.array(im)
rgb = arr[:, :, :3].astype(np.int16)
h, w = rgb.shape[:2]

corners = np.stack([rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]], axis=0)
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
print(path.name, Image.open(path).mode)
