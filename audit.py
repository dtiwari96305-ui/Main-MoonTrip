import re
import math
from collections import defaultdict

css_file = r"client/src/dashboard.css"

with open(css_file, "r", encoding="utf-8") as f:
    css_content = f.read()

colors = set()
color_vars = set()
color_pattern = re.compile(r'(#[0-9a-fA-F]{3,8}|rgba?\([\d\s,\.]+\)|var\(--[a-zA-Z0-9-]+\))')
var_decl_pattern = re.compile(r'(--[a-zA-Z0-9-]+)\s*:\s*(.*?);')

for match in var_decl_pattern.finditer(css_content):
    var_name, val = match.groups()
    if '#' in val or 'rgb' in val or 'transparent' in val:
        color_vars.add(f"{var_name}: {val}")
        
for match in color_pattern.finditer(css_content):
    val = match.group(1)
    if val.startswith('var('):
        continue
    colors.add(val)

spacings = set()
spacing_pattern = re.compile(r'(margin|padding|gap|top|bottom|left|right|width|height|max-width|min-width|max-height|min-height|border-radius)\s*:\s*([^;]+);')
for match in spacing_pattern.finditer(css_content):
    prop, val = match.groups()
    parts = val.split()
    for p in parts:
        if 'px' in p or 'rem' in p or 'em' in p or '%' in p or 'vw' in p or 'vh' in p:
            spacings.add(p.strip())

font_props = set()
font_pattern = re.compile(r'(font-family|font-size|font-weight|line-height|letter-spacing)\s*:\s*([^;]+);')
for match in font_pattern.finditer(css_content):
    prop, val = match.groups()
    font_props.add(f"{prop}: {val.strip()}")

breakpoints = set()
mq_pattern = re.compile(r'@media\s*\((max-width|min-width)\s*:\s*([^\)]+)\)')
for match in mq_pattern.finditer(css_content):
    breakpoints.add(f"{match.group(1)}: {match.group(2)}")

animations = set()
anim_pattern = re.compile(r'(animation|transition)\s*:\s*([^;]+);')
for match in anim_pattern.finditer(css_content):
    animations.add(f"{match.group(1)}: {match.group(2).strip()}")

keyframes = set()
kf_pattern = re.compile(r'@keyframes\s+([a-zA-Z0-9-]+)')
for match in kf_pattern.finditer(css_content):
    keyframes.add(match.group(1))

with open('audit_inventory.txt', 'w', encoding='utf-8') as out:
    out.write("=== COLORS ===\n")
    for c in sorted(colors): out.write(c + "\n")
    out.write("\n=== COLOR VARS ===\n")
    for cv in sorted(color_vars): out.write(cv + "\n")
    out.write("\n=== SPACINGS ===\n")
    for s in sorted(spacings): out.write(s + "\n")
    out.write("\n=== FONT PROPS ===\n")
    for f in sorted(font_props): out.write(f + "\n")
    out.write("\n=== BREAKPOINTS ===\n")
    for b in sorted(breakpoints): out.write(b + "\n")
    out.write("\n=== ANIMATIONS / TRANSITIONS ===\n")
    for a in sorted(animations): out.write(a + "\n")
    out.write("\n=== KEYFRAMES ===\n")
    for k in sorted(keyframes): out.write(k + "\n")
