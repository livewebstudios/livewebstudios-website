#!/usr/bin/env python3
"""
LWS Design Pass 3:
1. Swap clutch.jpg → clutch2.png in all HTML files
2. Add SVG icons to ALL feature cards on every page (service, industry, any)
3. Hero illustration: remove forced dimensions, let CSS handle sizing
"""

import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────────────────────
# ICON LIBRARY — 24x24 viewBox, stroke-based
# ─────────────────────────────────────────────────────────
def card_svg(path_d):
    return (
        '<svg class="card-icon" viewBox="0 0 24 24" fill="none" '
        'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
        'stroke-linejoin="round" width="28" height="28" aria-hidden="true">'
        + path_d + '</svg>'
    )

ICONS = {
    'monitor':    card_svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
    'ai':         card_svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>'),
    'server':     card_svg('<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>'),
    'search':     card_svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>'),
    'lightbulb':  card_svg('<path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>'),
    'workflow':   card_svg('<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>'),
    'layers':     card_svg('<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'),
    'pen':        card_svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>'),
    'cart':       card_svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
    'image':      card_svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'),
    'wrench':     card_svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    'users':      card_svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    'shield':     card_svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    'lock':       card_svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    'activity':   card_svg('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    'speed':      card_svg('<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>'),
    'check':      card_svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
    'chart':      card_svg('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
    'globe':      card_svg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    'phone':      card_svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.63a16 16 0 0 0 6.06 6.06l1.8-1.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
    'home':       card_svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    'custom':     card_svg('<path d="M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18"/>'),
    'mobile':     card_svg('<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>'),
    'seo':        card_svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>'),
    'form':       card_svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
    'analytics':  card_svg('<path d="M21 21H3V3"/><path d="M7 14l4-4 4 4 4-6"/>'),
    'ssl':        card_svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="16" x2="12" y2="16"/>'),
    'backup':     card_svg('<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.29"/>'),
    'report':     card_svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>'),
    'lead':       card_svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    'content':    card_svg('<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>'),
}

# h3 keyword → icon key (case-insensitive substring match, order matters)
H3_ICON_RULES = [
    # Hosting page
    ('managed vps',     'server'),
    ('litespeed',       'speed'),
    ('free ssl',        'ssl'),
    ('ssl',             'lock'),
    ('daily backup',    'backup'),
    ('backup',          'backup'),
    ('security',        'shield'),
    ('monthly report',  'report'),
    ('report',          'report'),
    ('uptime',          'activity'),

    # Website Design page
    ('custom design',   'pen'),
    ('mobile',          'mobile'),
    ('on-page seo',     'seo'),
    ('contact form',    'form'),
    ('analytics',       'analytics'),
    ('google analytics','analytics'),

    # Generic service cards
    ('website design',  'monitor'),
    ('web design',      'monitor'),
    ('ai platform',     'ai'),
    ('ai-powered',      'ai'),
    ('ai business',     'lightbulb'),
    ('ai workflow',     'workflow'),
    ('ai image',        'image'),
    ('ai search',       'ai'),
    ('hosting',         'server'),
    ('maintenance',     'wrench'),
    ('seo',             'search'),
    ('branding',        'layers'),
    ('logo',            'pen'),
    ('e-commerce',      'cart'),
    ('ecommerce',       'cart'),
    ('consulting',      'users'),
    ('audit',           'check'),

    # Industry feature cards
    ('lead generation', 'lead'),
    ('lead',            'lead'),
    ('content strategy','content'),
    ('content',         'content'),
    ('seo strategy',    'search'),
    ('ongoing support', 'wrench'),
    ('support',         'wrench'),
    ('performance',     'chart'),
    ('traffic',         'chart'),
    ('ranking',         'chart'),
    ('local seo',       'home'),
    ('google business', 'globe'),

    # Fallback
    ('design',          'pen'),
    ('strategy',        'lightbulb'),
    ('plan',            'workflow'),
]

def icon_for_h3(text):
    t = text.lower()
    for keyword, key in H3_ICON_RULES:
        if keyword in t:
            return ICONS.get(key, ICONS['lightbulb'])
    return ICONS['check']  # safe fallback


# ─────────────────────────────────────────────────────────
# 1. SWAP clutch.jpg → clutch2.png
# ─────────────────────────────────────────────────────────
def swap_clutch(html):
    return html.replace('clutch.jpg', 'clutch2.png')


# ─────────────────────────────────────────────────────────
# 2. ADD CARD ICONS to all feature-cards that don't have one
# ─────────────────────────────────────────────────────────
def add_card_icons(html):
    """
    For every <article class="feature-card"> or <div class="feature-card">
    that does NOT already have a card-icon, extract the h3 text, pick the
    right icon, and insert it as the first child.
    """

    def replace_card(m):
        tag_open = m.group(1)   # opening tag e.g. <article class="feature-card">
        content  = m.group(2)   # everything inside

        # Skip if already has a card-icon
        if 'card-icon' in content:
            return m.group(0)

        # Extract h3 text for icon selection
        h3_match = re.search(r'<h3[^>]*>(.*?)</h3>', content, re.DOTALL)
        h3_text  = re.sub(r'<[^>]+>', '', h3_match.group(1)) if h3_match else ''

        # Pick icon
        icon = icon_for_h3(h3_text)

        return tag_open + icon + content

    # Match feature-card elements — stop at the first </article> or </div>
    # Use a simpler approach: find opening tag, then insert icon right after >
    # by detecting cards that lack card-icon

    pattern = r'(<(?:article|div)[^>]+class="[^"]*feature-card[^"]*"[^>]*>)(.*?)(?=</(?:article|div)>)'

    def process_match(m):
        tag = m.group(1)
        content = m.group(2)
        if 'card-icon' in content:
            return m.group(0)
        h3_m = re.search(r'<h3[^>]*>(.*?)</h3>', content, re.DOTALL)
        h3_t = re.sub(r'<[^>]+>', '', h3_m.group(1)).strip() if h3_m else ''
        icon = icon_for_h3(h3_t)
        return tag + icon + content

    return re.sub(pattern, process_match, html, flags=re.DOTALL)


# ─────────────────────────────────────────────────────────
# 3. FIX HERO ILLUSTRATION — remove forced dimensions
# ─────────────────────────────────────────────────────────
def fix_hero_illustration(html):
    """
    Hero illustration images should not have forced width/height attrs.
    The CSS .hero-illustration img rule handles sizing.
    Remove width/height from imgs inside .hero-illustration.
    """
    def strip_dims(m):
        tag = m.group(0)
        tag = re.sub(r'\s+width="\d+"', '', tag)
        tag = re.sub(r'\s+height="\d+"', '', tag)
        # Remove any leftover inline style with border-radius (CSS handles it)
        tag = re.sub(r'\s+style="[^"]*border-radius[^"]*"', '', tag)
        return tag

    # Find imgs inside hero-illustration divs
    def update_hero_illus(m):
        inner = re.sub(r'<img\b[^>]+>', strip_dims, m.group(0))
        return inner

    return re.sub(
        r'<div class="hero-illustration">.*?</div>',
        update_hero_illus,
        html, flags=re.DOTALL
    )


# ─────────────────────────────────────────────────────────
# 4. ADD hero illustration CSS + fix card-icon CSS in style.css
# ─────────────────────────────────────────────────────────
def update_css():
    css_path = os.path.join(BASE, 'css', 'style.css')
    with open(css_path, 'r') as f:
        css = f.read()

    # Fix hero illustration image sizing
    hero_img_css = """
/* Hero illustration image — natural size, no stretch */
.hero-illustration img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius-lg);
  object-fit: contain;
}
"""
    if '.hero-illustration img' not in css:
        # Insert after .hero-illustration { ... }
        css = css.replace(
            '.hero-illustration { animation: floatY 4s ease-in-out infinite; }',
            '.hero-illustration { animation: floatY 4s ease-in-out infinite; }' + hero_img_css
        )

    # Fix clutch-badge: update reference to clutch2.png (CSS has no file ref, fine)
    # Update clutch display size to match 412×120 actual dimensions
    css = css.replace(
        '  width: 180px;\n  height: auto;\n  margin-top: 20px;',
        '  width: 206px;\n  height: auto;\n  margin-top: 20px;'
    )

    with open(css_path, 'w') as f:
        f.write(css)
    print('  ✓  css/style.css updated')


# ─────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('\n=== LWS Design Pass 3 ===\n')

    print('[1/2] Updating style.css...')
    update_css()

    print('\n[2/2] Processing HTML files...')
    html_files = sorted(glob.glob(os.path.join(BASE, '**', '*.html'), recursive=True))

    ok = 0
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as fh:
            html = fh.read()

        html = swap_clutch(html)
        html = add_card_icons(html)
        html = fix_hero_illustration(html)

        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(html)
        print(f'  ✓  {os.path.relpath(f, BASE)}')
        ok += 1

    # ── Verification ──
    print(f'\n=== Done. {ok} pages updated. ===\n')
    print('─── Verification ───')
    clutch2 = sum(1 for f in html_files if 'clutch2.png' in open(f).read())
    has_icons = sum(1 for f in html_files if 'card-icon' in open(f).read())
    print(f'  clutch2.png references: {clutch2}/{ok}')
    print(f'  pages with card icons:  {has_icons}/{ok}')
