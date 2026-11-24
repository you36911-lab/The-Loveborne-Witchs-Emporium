"""Writes js/data/outline-marks.js: where the Recipe Book's question mark sits on each spell outline
(python tools/outline-marks.py; run again after adding or changing a picture in assets/spells/outline).

The mark goes on the middle of the shape itself, not of the picture's box: the centre of its painted area,
moved inward when that point is too near an edge (a curved or hollow shape) to the nearest point deep inside.
Each entry is [width/height, across, down], the last two as fractions of the picture. Plain Python, no libraries."""
import os, re, struct, zlib

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DIR = os.path.join(ROOT, 'assets', 'spells', 'outline')
CELLS = 120  # the shape is looked at on a grid this many cells along its long side


def alpha_rows(path):
    """The alpha channel of an 8-bit RGBA, non-interlaced PNG, row by row."""
    b = open(path, 'rb').read()
    w, h, depth, ctype, _, _, interlace = struct.unpack('>IIBBBBB', b[16:29])
    if depth != 8 or ctype != 6 or interlace:
        raise SystemExit(path + ': expected an 8-bit RGBA PNG')
    i, idat = 8, b''
    while i < len(b):
        n, kind = struct.unpack('>I4s', b[i:i + 8])
        if kind == b'IDAT':
            idat += b[i + 8:i + 8 + n]
        i += 12 + n
    raw, stride, prev, rows = zlib.decompress(idat), w * 4, bytearray(w * 4), []
    for y in range(h):
        f, line = raw[y * (stride + 1)], bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        if f == 1:
            for x in range(4, stride): line[x] = (line[x] + line[x - 4]) & 255
        elif f == 2:
            line = bytearray((a + c) & 255 for a, c in zip(line, prev))
        elif f == 3:
            for x in range(stride): line[x] = (line[x] + ((line[x - 4] if x >= 4 else 0) + prev[x]) // 2) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x - 4] if x >= 4 else 0; c = prev[x - 4] if x >= 4 else 0; up = prev[x]
                p = a + up - c; pa, pb, pc = abs(p - a), abs(p - up), abs(p - c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else up if pb <= pc else c)) & 255
        rows.append(line[3::4]); prev = line
    return w, h, rows


def mark(path):
    w, h, rows = alpha_rows(path)
    s = max(w, h) / CELLS; gw, gh = max(1, round(w / s)), max(1, round(h / s))
    grid = [[rows[min(h - 1, int((y + .5) * h / gh))][min(w - 1, int((x + .5) * w / gw))] > 128 for x in range(gw)] for y in range(gh)]
    # distance (in cells) from each painted cell to the nearest unpainted one, the picture's edge counting as unpainted
    INF = 10 ** 6; d = [[INF if grid[y][x] else 0 for x in range(gw)] for y in range(gh)]
    for y in range(gh):
        for x in range(gw):
            if d[y][x]:
                d[y][x] = min(d[y][x], 1 + min(d[y - 1][x] if y else 0, d[y][x - 1] if x else 0),
                              1.4 + min(d[y - 1][x - 1] if y and x else 0, d[y - 1][x + 1] if y and x < gw - 1 else 0))
    for y in reversed(range(gh)):
        for x in reversed(range(gw)):
            if d[y][x]:
                d[y][x] = min(d[y][x], 1 + min(d[y + 1][x] if y < gh - 1 else 0, d[y][x + 1] if x < gw - 1 else 0),
                              1.4 + min(d[y + 1][x + 1] if y < gh - 1 and x < gw - 1 else 0, d[y + 1][x - 1] if y < gh - 1 and x else 0))
    cells = [(x, y) for y in range(gh) for x in range(gw) if grid[y][x]]
    cx = sum(x for x, _ in cells) / len(cells) + .5; cy = sum(y for _, y in cells) / len(cells) + .5
    deep = max(d[y][x] for x, y in cells)
    near = d[min(gh - 1, int(cy))][min(gw - 1, int(cx))]
    if near < .5 * deep:  # the centre is on or near an edge: take the nearest point well inside instead
        cx, cy = min(((x + .5, y + .5) for x, y in cells if d[y][x] >= .6 * deep), key=lambda p: (p[0] - cx) ** 2 + (p[1] - cy) ** 2)
        print(os.path.basename(path) + ": its centre is near an edge, so the mark is moved inward")
    return [round(w / h, 4), round(cx / gw, 3), round(cy / gh, 3)]


names = sorted((f for f in os.listdir(DIR) if re.fullmatch(r'\d+\.png', f)), key=lambda f: int(f[:-4]))
out = {int(f[:-4]): mark(os.path.join(DIR, f)) for f in names}
js = ('/* Where the question mark sits on each spell outline in the Recipe Book (written by python tools/outline-marks.py;\n'
      '   run it again after changing a picture in assets/spells/outline): [width/height, across, down], the last two as\n'
      '   fractions of the picture, on the middle of the shape itself. */\n'
      'const OUTLINE_MARKS={\n' + ',\n'.join('  %d:[%s,%s,%s]' % (n, *v) for n, v in out.items()) + '\n};\n')
open(os.path.join(ROOT, 'js', 'data', 'outline-marks.js'), 'w', encoding='utf-8', newline='\n').write(js)
print('js/data/outline-marks.js:', len(out), 'outlines')
