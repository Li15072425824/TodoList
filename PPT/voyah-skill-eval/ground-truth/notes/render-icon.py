#!/usr/bin/env python3
import html
import json
import os
import re
from pathlib import Path

BASE = Path('/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth')
DATA_FILE = BASE / 'notes/icon-sections.json'
OVERVIEW_FILE = Path('/Users/lixing/.claude/projects/-Users-lixing-WorkRep-TodoList/c7f2d773-6e67-42de-a1fb-0e2117993c68/tool-results/mcp-mastergo-mcp__getDesignSections-1793935779556.txt')
TEMPLATE_FILE = BASE / 'notes/icon-template.html'
MANIFEST_FILE = BASE / 'notes/icon-render-manifest.json'

data = json.loads(DATA_FILE.read_text())
allow_partial = os.environ.get('ALLOW_PARTIAL') == '1'
if len(data['sections']) != 803 or (not allow_partial and any(not text for text in data['sections'])):
    missing = [i for i, text in enumerate(data['sections']) if not text]
    raise SystemExit(f'Refusing to render incomplete data; missing {len(missing)} sections: {missing[:50]}')

overview = OVERVIEW_FILE.read_text()
section_re = re.compile(r'^\s{2}\[(\d+)\]\s+([A-Z_]+)\s+(\S+)\s+"([\s\S]*?)"\s+([\d.]+)x([\d.]+)\s+@(-?[\d.]+),(-?[\d.]+)\s+nodeCount=(\d+)', re.M)
boxes = {}
for match in section_re.finditer(overview):
    index = int(match.group(1))
    boxes[index] = {
        'type': match.group(2), 'id': match.group(3), 'name': match.group(4),
        'w': float(match.group(5)), 'h': float(match.group(6)),
        'x': float(match.group(7)), 'y': float(match.group(8)),
        'nodeCount': int(match.group(9)),
    }
if len(boxes) != 803:
    raise SystemExit(f'Overview parse yielded {len(boxes)} boxes instead of 803')

node_re = re.compile(r'^(\s*)([A-Z_]+)\s+(\S+)\s+"([\s\S]*?)"\s+([\d.]+|\?)x([\d.]+|\?)\s+@(-?[\d.]+|\?),(-?[\d.]+|\?)([^\n]*)$', re.M)

def number(value):
    value = float(value)
    return str(int(value)) if value.is_integer() else ('%.10f' % value).rstrip('0').rstrip('.')

def dimension(value):
    return None if value == '?' else float(value)

def css_name(token):
    return '--' + token.replace(':', '-').replace('_', '-')

def parse_globals(text):
    globals_map = {}
    in_globals = False
    for line in text.splitlines():
        if line == 'globalVars:':
            in_globals = True
            continue
        if in_globals and line and not line.startswith(' '):
            break
        if in_globals:
            match = re.match(r'^\s{2}([^:]+:[^:]+):\s+(\{.*\})\s*$', line)
            if match:
                globals_map[match.group(1)] = json.loads(match.group(2)).get('value')
    return globals_map

def line_height(value):
    number_value = float(value)
    if number_value < 10:
        return number(value)
    if number_value >= 50:
        return number(number_value / 100)
    return f'{number(number_value)}px'

def font_value(font):
    return f"{font.get('weight', 400)} {number(font['size'])}px/{line_height(str(font.get('lineHeight', 1.2)))} \"{font['family']}\""

def parse_section(index, text):
    tree = text.split('\ntree:\n', 1)[1]
    matches = list(node_re.finditer(tree))
    if not matches:
        raise ValueError(f'No nodes parsed in section {index}')
    roots = []
    stack = []
    for position, match in enumerate(matches):
        body_end = matches[position + 1].start() if position + 1 < len(matches) else len(tree)
        body = tree[match.end():body_end]
        depth = len(match.group(1)) // 2
        node = {
            'depth': depth, 'type': match.group(2), 'id': match.group(3), 'name': match.group(4),
            'w': dimension(match.group(5)), 'h': dimension(match.group(6)),
            'x': dimension(match.group(7)), 'y': dimension(match.group(8)),
            'props': match.group(9).strip(), 'body': body, 'children': [],
        }
        while stack and stack[-1]['depth'] >= depth:
            stack.pop()
        if stack:
            stack[-1]['children'].append(node)
        else:
            roots.append(node)
        stack.append(node)
    if len(roots) != 1:
        raise ValueError(f'Section {index} has {len(roots)} parsed roots')
    return roots[0], parse_globals(text)

def prop(node, key):
    match = re.search(rf'(?:^|\s){re.escape(key)}=([^\s]+)', node['props'])
    return match.group(1) if match else None

def body_value(node, key):
    match = re.search(rf'^\s*{re.escape(key)}="([^"]*)"', node['body'], re.M)
    return match.group(1) if match else None

def fill_css(token, globals_map):
    if not token:
        return None
    if token not in globals_map:
        return token if token.startswith('#') else None
    return f'var({css_name(token)})'

all_globals = {}
conflicting_tokens = set()
parsed = []
for index, text in enumerate(data['sections']):
    if not text:
        continue
    root, globals_map = parse_section(index, text)
    parsed.append((index, root, globals_map))
    for token, value in globals_map.items():
        if token in all_globals and all_globals[token] != value:
            conflicting_tokens.add(token)
            continue
        all_globals[token] = value

def token_css_value(token, value):
    if token.startswith('font_'):
        return font_value(value)
    if isinstance(value, list):
        if not value:
            return 'transparent'
        if isinstance(value[0], dict) and 'url' in value[0]:
            return f'url("{value[0]["url"]}") center / cover no-repeat'
        return str(value[0])
    raise ValueError(f'Unsupported design token {token}: {value!r}')

placeholder_total = 0
unavailable_total = 0
rendered_keys = set()

def render_node(node, globals_map, is_root=False, box=None):
    global placeholder_total, unavailable_total
    x = box['x'] if is_root else node['x']
    y = box['y'] if is_root else node['y']
    w = box['w'] if is_root else node['w']
    h = box['h'] if is_root else node['h']
    styles = ['position:absolute', 'box-sizing:border-box']
    if x is not None:
        styles.append(f'left:{number(x)}px')
    if y is not None:
        styles.append(f'top:{number(y)}px')
    if w is not None:
        styles.append(f'width:{number(w)}px')
    if h is not None:
        styles.append(f'height:{number(h)}px')
    classes = ['dsl-node', f'dsl-{node["type"].lower()}']
    fill = fill_css(prop(node, 'fill'), globals_map)
    color = body_value(node, '_color')
    if node['type'] == 'TEXT':
        text_match = re.search(r'^\s*text\s+"([\s\S]*?)"\s+font=(\S+)', node['body'], re.M)
        if not text_match:
            raise ValueError(f'Missing text/font on {node["id"]}')
        text_value = text_match.group(1)
        font_token = text_match.group(2)
        styles.append(f'font:var({css_name(font_token)})')
        font = globals_map.get(font_token, {})
        letter_spacing = font.get('letterSpacing')
        if letter_spacing and letter_spacing != 'auto':
            styles.append(f'letter-spacing:{letter_spacing}')
        if color:
            styles.append(f'color:{color}')
        elif fill:
            styles.append(f'color:{fill}')
        align = body_value(node, 'textAlign') or 'left'
        styles.append(f'text-align:{align}')
        if body_value(node, 'textMode') == 'single-line':
            styles.append('white-space:nowrap')
        styles.append('margin:0')
        content = html.escape(text_value)
    else:
        content = ''
        svg_key = body_value(node, 'svgShortKey')
        unavailable = '_svgUnavailable=true' in node['body']
        if svg_key:
            placeholder_total += 1
            if svg_key in rendered_keys:
                raise ValueError(f'Duplicate SVG key {svg_key}')
            rendered_keys.add(svg_key)
            classes.append('svg-slot')
            if node['w'] is None:
                classes.append('svg-auto-width')
            if node['h'] is None:
                classes.append('svg-auto-height')
            content = f'@@SVG:{svg_key}@@'
        elif unavailable:
            unavailable_total += 1
            classes.append('svg-unavailable')
            styles.append('color:#333333')
            if node['w'] == 0 and node['h'] > 0:
                styles.append('border-left:1px solid currentColor')
            elif node['h'] == 0 and node['w'] > 0:
                styles.append('border-top:1px solid currentColor')
            content = f'<!-- SVG unavailable in source DSL: {html.escape(node["id"])}; minimal line approximation when applicable -->'
        if fill and not svg_key:
            styles.append(f'background:{fill}')
        stroke = prop(node, 'stroke')
        if stroke and not svg_key:
            stroke_token, _, stroke_width = stroke.partition('/')
            stroke_color = fill_css(stroke_token, globals_map)
            if stroke_color:
                styles.append(f'border:{stroke_width or "1px"} solid {stroke_color}')
        if node['type'] == 'SVG_ELLIPSE' and not svg_key:
            styles.append('border-radius:50%')
    radius = prop(node, 'borderRadius') or body_value(node, 'borderRadius')
    if radius:
        styles.append(f'border-radius:{radius}')
    opacity = prop(node, 'opacity')
    if opacity:
        styles.append(f'opacity:{opacity}')
    attrs = f'class="{" ".join(classes)}" data-node-id="{html.escape(node["id"], quote=True)}" data-name="{html.escape(node["name"], quote=True)}"'
    if is_root:
        token_overrides = []
        for token, value in globals_map.items():
            if token in conflicting_tokens:
                token_overrides.append(f'{css_name(token)}:{token_css_value(token, value)}')
        styles.extend(token_overrides)
        attrs += f' data-section-index="{CURRENT_INDEX}"'
    children = ''.join(render_node(child, globals_map) for child in node['children'])
    return f'<div {attrs} style="{";".join(styles)}">{content}{children}</div>'

sections_html = []
section_stats = []
for CURRENT_INDEX, root, globals_map in parsed:
    source_keys = re.findall(r'svgShortKey="([^"]+)"', data['sections'][CURRENT_INDEX])
    before = placeholder_total
    section_html = render_node(root, globals_map, is_root=True, box=boxes[CURRENT_INDEX])
    rendered = placeholder_total - before
    if rendered != len(source_keys):
        raise ValueError(f'Section {CURRENT_INDEX}: rendered {rendered} placeholders, expected {len(source_keys)}')
    expected_count_match = re.search(r'^svgNodeCount:\s*(\d+)', data['sections'][CURRENT_INDEX], re.M)
    if expected_count_match and rendered != int(expected_count_match.group(1)):
        raise ValueError(f'Section {CURRENT_INDEX}: rendered {rendered}, svgNodeCount={expected_count_match.group(1)}')
    sections_html.append(section_html)
    section_stats.append({'sectionIndex': CURRENT_INDEX, 'id': root['id'], 'name': root['name'], 'placeholders': rendered})

token_css = []
for token, value in sorted(all_globals.items()):
    try:
        css_value = token_css_value(token, value)
    except ValueError:
        continue
    suffix = ' /* conflicts across sections; section roots override this value */' if token in conflicting_tokens else ''
    token_css.append(f'  {css_name(token)}: {css_value}; /* {token} */{suffix}')

document = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>图标</title>
<style>
/* All design tokens below are copied from section globalVars; token IDs are retained in comments. */
:root {
''' + '\n'.join(token_css) + '''
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #FFFFFF; }
body { width: 1440px; min-height: 6688px; }
.icon-spec { position: relative; width: 1440px; min-height: 6688px; height: 6688px; overflow: hidden; background: #FFFFFF; border-radius: 6px; }
.dsl-node { padding: 0; }
.svg-slot { display: block; line-height: 0; }
.svg-slot > svg { display: block; width: 100%; height: 100%; }
.svg-auto-width > svg { width: auto; }
.svg-auto-height > svg { height: auto; }
.svg-unavailable { display: block; }
</style>
</head>
<body>
<main class="icon-spec" aria-label="图标">
''' + '\n'.join(sections_html) + '''
</main>
</body>
</html>
'''
if '<path' in document:
    raise ValueError('Refusing to emit hand-written SVG paths')
TEMPLATE_FILE.write_text(document)
manifest = {
    'sections': len(sections_html), 'placeholders': placeholder_total,
    'unavailablePaths': unavailable_total, 'uniqueSvgKeys': len(rendered_keys),
    'templateBytes': len(document.encode()), 'template': str(TEMPLATE_FILE),
    'sectionStats': section_stats,
}
MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
print(json.dumps({k: v for k, v in manifest.items() if k != 'sectionStats'}, ensure_ascii=False, indent=2))
