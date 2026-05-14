"""Fondo blanco y halos claros: inundación + blancos/grises planos + despill en borde (PIL)."""
from __future__ import annotations

import shutil
import sys
from collections import deque

from PIL import Image


def similar(a: tuple[int, int, int], b: tuple[int, int, int], tol: int) -> bool:
    return all(abs(int(a[i]) - int(b[i])) <= tol for i in range(3))


def flood_corner_to_transparent(im: Image.Image, tol: int) -> None:
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
        return
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
    for y in range(h):
        for x in range(w):
            if vis[y][x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)


def strip_light_background_pixels(px, w: int, h: int, *, aggressive: bool = False) -> None:
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 12:
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            chroma = mx - mn
            s = r + g + b
            if r >= 247 and g >= 247 and b >= 247:
                px[x, y] = (r, g, b, 0)
            elif s >= 735 and mn >= 238:
                px[x, y] = (r, g, b, 0)
            elif s >= 698 and mn >= 218 and chroma <= 42:
                px[x, y] = (r, g, b, 0)
            elif s >= 655 and mn >= 200 and chroma <= 20:
                px[x, y] = (r, g, b, 0)
            elif aggressive and s >= 628 and mn >= 192 and chroma <= 52:
                px[x, y] = (r, g, b, 0)
            elif aggressive and s >= 598 and mn >= 178 and chroma <= 32:
                px[x, y] = (r, g, b, 0)


def edge_despill(px, w: int, h: int, rounds: int = 4, *, fringe: bool = False) -> None:
    lum_edge_2 = 430 if fringe else 455
    mn_edge_2 = 98 if fringe else 105
    chroma_edge_2 = 78 if fringe else 72
    lum_edge_1 = 535 if fringe else 595
    mn_edge_1 = 175 if fringe else 188
    chroma_edge_1 = 54 if fringe else 48
    for _ in range(rounds):
        alpha = [[px[x, y][3] for x in range(w)] for y in range(h)]
        kill: list[tuple[int, int]] = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                r, g, b, a = px[x, y]
                if a < 28:
                    continue
                neigh_a = [alpha[y - 1][x], alpha[y + 1][x], alpha[y][x - 1], alpha[y][x + 1]]
                low = sum(1 for na in neigh_a if na < 42)
                if low == 0:
                    continue
                mx, mn = max(r, g, b), min(r, g, b)
                chroma = mx - mn
                lum = r + g + b
                if low >= 2 and lum > lum_edge_2 and mn > mn_edge_2 and chroma < chroma_edge_2:
                    kill.append((x, y))
                elif low >= 1 and lum > lum_edge_1 and mn > mn_edge_1 and chroma < chroma_edge_1:
                    kill.append((x, y))
        for x, y in kill:
            r, g, b, _ = px[x, y]
            px[x, y] = (r, g, b, 0)


def polish_png(
    path: str,
    flood_tol: int = 22,
    despill_rounds: int = 4,
    *,
    hard: bool = False,
) -> None:
    im = Image.open(path).convert("RGBA")
    flood_corner_to_transparent(im, flood_tol)
    w, h = im.size
    px = im.load()
    strip_light_background_pixels(px, w, h, aggressive=hard)
    edge_despill(px, w, h, rounds=despill_rounds, fringe=hard)
    strip_light_background_pixels(px, w, h, aggressive=hard)
    if hard:
        edge_despill(px, w, h, rounds=5, fringe=True)
        strip_light_background_pixels(px, w, h, aggressive=True)
    im.save(path, optimize=True)


def main() -> None:
    args = [a for a in sys.argv[1:] if a != "--hard"]
    hard = "--hard" in sys.argv[1:]
    if len(args) < 3 or args[0] != "--out":
        print("usage: polish_character_cutout.py [--hard] --out <dest.png> <src.png>")
        sys.exit(1)
    dest = args[1]
    src = args[2]
    shutil.copy2(src, dest)
    if hard:
        polish_png(dest, flood_tol=28, despill_rounds=8, hard=True)
    else:
        polish_png(dest)


if __name__ == "__main__":
    main()
