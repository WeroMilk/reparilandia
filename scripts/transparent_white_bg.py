"""Remove solid / near-white background from PNG via flood-fill from corners (PIL)."""
from __future__ import annotations

import shutil
import sys
from collections import deque

from PIL import Image


def similar(a: tuple[int, int, int], b: tuple[int, int, int], tol: int) -> bool:
    return all(abs(int(a[i]) - int(b[i])) <= tol for i in range(3))


def flood_mask(im: Image.Image, tol: int) -> list[list[bool]]:
    w, h = im.size
    px = im.load()
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    seeds: list[tuple[int, int]] = []
    for x, y in corners:
        if 0 <= x < w and 0 <= y < h:
            r, g, b, a = px[x, y]
            if a:
                seeds.append((x, y))
    if not seeds:
        return [[False] * w for _ in range(h)]
    ref = px[seeds[0][0], seeds[0][1]][:3]
    vis = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for x, y in seeds:
        r, g, b, a = px[x, y]
        if a and similar((r, g, b), ref, tol):
            vis[y][x] = True
            q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h or vis[ny][nx]:
                continue
            r, g, b, a = px[nx, ny]
            if not a:
                continue
            if similar((r, g, b), ref, tol):
                vis[ny][nx] = True
                q.append((nx, ny))
    return vis


def remove_white_bg(src_path: str, dest_path: str, tol: int = 18) -> None:
    shutil.copy2(src_path, dest_path)
    im = Image.open(dest_path).convert("RGBA")
    mask = flood_mask(im, tol=tol)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            if mask[y][x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
    im.save(dest_path, optimize=True)


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: transparent_white_bg.py <src.png> <dest.png> [tolerance]")
        sys.exit(1)
    src = sys.argv[1]
    dest = sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 18
    remove_white_bg(src, dest, tol=tol)


if __name__ == "__main__":
    main()
