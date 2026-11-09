#!/usr/bin/env python3
import re
import shutil
import sys
from pathlib import Path

BASE = Path('/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth')
FINAL = BASE / 'html/icon.html'
CANONICAL = BASE / 'notes/icon-canonical.html'
SHRUNK = BASE / 'notes/icon-current-shrunk.html'
slot_re = re.compile(r'(<(?:div|span)\s+class="[^"]*svg-slot[^"]*"[^>]*>)(\s*<svg[\s\S]*?</svg>\s*)(</(?:div|span)>)')

def shrink():
    if not CANONICAL.exists():
        shutil.copyfile(FINAL, CANONICAL)
    canonical = CANONICAL.read_text()
    matches = list(slot_re.finditer(canonical))
    if not matches:
        raise SystemExit('No resolved SVG slots found in canonical file')
    shrunk = slot_re.sub(lambda m: f'{m.group(1)}<!--resolved:{m.group(2).count("<path")}paths-->{m.group(3)}', canonical)
    unresolved = shrunk.count('@@SVG:')
    SHRUNK.write_text(shrunk)
    print({'canonicalBytes': len(canonical.encode()), 'shrunkBytes': len(shrunk.encode()), 'resolvedSlots': len(matches), 'unresolvedPlaceholders': unresolved})

def merge():
    canonical = CANONICAL.read_text()
    svg_by_id = {}
    for match in slot_re.finditer(canonical):
        node_id = re.search(r'data-node-id="([^"]+)"', match.group(1)).group(1)
        svg_by_id[node_id] = match.group(2)
    final = FINAL.read_text()
    unresolved_before = final.count('@@SVG:')
    def replace(match):
        node_id = re.search(r'data-node-id="([^"]+)"', match.group(1)).group(1)
        if '<svg' in match.group(2) or '@@SVG:' in match.group(2):
            return match.group(0)
        if node_id not in svg_by_id:
            raise SystemExit(f'No canonical SVG for {node_id}')
        return f'{match.group(1)}{svg_by_id[node_id]}{match.group(3)}'
    merged = slot_re.sub(replace, final)
    FINAL.write_text(merged)
    shutil.copyfile(merged, CANONICAL)
    print({'mergedResolved': len(svg_by_id), 'unresolvedBefore': unresolved_before, 'unresolvedAfter': merged.count('@@SVG:'), 'bytes': len(merged.encode())})

if __name__ == '__main__':
    {'shrink': shrink, 'merge': merge}[sys.argv[1]]()
