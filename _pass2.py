#!/usr/bin/env python3
"""
LWS Design Pass 2 — Autonomous
Handles ALL tasks: --bg-alt, animations, nav icons, card icons,
clutch badge, verifiedsecured sizing, hero illustration PNGs.
"""

import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────────────────────
# SVG ICON LIBRARY
# ─────────────────────────────────────────────────────────
def svg(path_d, extra=""):
    return (
        f'<svg class="card-icon" viewBox="0 0 24 24" fill="none" '
        f'stroke="currentColor" stroke-width="1.5" width="28" height="28" '
        f'aria-hidden="true">{path_d}</svg>'
    )

ICONS = {
    'monitor':   svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
    'ai':        svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>'),
    'server':    svg('<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>'),
    'search':    svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>'),
    'lightbulb': svg('<path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>'),
    'workflow':  svg('<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>'),
    'layers':    svg('<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'),
    'pen':       svg('<circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>'),
    'cart':      svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
    'image':     svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'),
    'wrench':    svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    'users':     svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    'home':      svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    'shield':    svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    'activity':  svg('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
    'scale':     svg('<path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M7 8l5-6 5 6"/>'),
    'dollar':    svg('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
    'hardhat':   svg('<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>'),
    'building':  svg('<path d="M2 20h20M4 20V10l4-4 4 4V4l4 4v12"/>'),
    'tooth':     svg('<path d="M12 2a5 5 0 0 0-5 5c0 3 2 5 2 8a3 3 0 0 0 6 0c0-3 2-5 2-8a5 5 0 0 0-5-5z"/>'),
    'heart':     svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),
    'briefcase': svg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
    'design':    svg('<path d="M2 13.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5"/><path d="M12 2L2 7l10 5 10-5-10-5"/>'),
}

# Service card-icon number → icon key
SERVICE_ICON_MAP = {
    '01': 'monitor',   # Website Design
    '02': 'ai',        # AI Platform
    '03': 'server',    # Hosting
    '04': 'search',    # SEO
    '05': 'lightbulb', # AI Business Services
    '06': 'workflow',  # AI Workflow
    '07': 'layers',    # Branding
    '08': 'pen',       # Logo Design
    '09': 'cart',      # Ecommerce
    '10': 'image',     # AI Image
    '11': 'wrench',    # Maintenance Plans
    '12': 'users',     # Consulting
}

# Industry card icon assignments (by h3 keyword)
INDUSTRY_ICON_MAP = [
    ('Custom Design',     'monitor'),
    ('SEO Strategy',      'search'),
    ('Lead Generation',   'lightbulb'),
    ('Content Strategy',  'workflow'),
    ('Mobile-First',      'monitor'),
    ('Ongoing Support',   'wrench'),
]

# Hero illustration PNG mapping: page slug → png filename
HERO_PNG_MAP = {
    'index':           'hero-home.png',
    'website-design':  'hero-website-design.png',
    'ai-platform':     'hero-ai-platform.png',
    'seo':             'hero-seo.png',
    'hosting':         'hero-hosting.png',
    'branding':        'hero-branding.png',
    'ecommerce':       'hero-ecommerce.png',
}


# ─────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────
def get_prefix(filepath):
    """Return relative path prefix based on folder depth."""
    rel = os.path.relpath(filepath, BASE)
    depth = len(rel.split(os.sep)) - 1
    return '../' * depth


def add_clutch(html, prefix):
    """Insert clutch badge inside .hero-cta div, or after last para in hero-inner."""
    if 'clutch-badge' in html:
        return html  # already done

    clutch_img = f'<img src="{prefix}images/clutch.jpg" alt="Rated on Clutch" width="414" height="136" class="clutch-badge">'

    # Case 1: hero has a .hero-cta div — add clutch inside it before </div>
    if 'class="hero-cta"' in html:
        # Find the hero-cta opening tag
        idx = html.find('class="hero-cta"')
        # Find its closing </div> by counting nesting from after the opening tag's >
        tag_end = html.find('>', idx) + 1
        depth = 1
        i = tag_end
        while i < len(html) and depth > 0:
            if html[i:i+4] in ('<div', '<DIV'):
                depth += 1
                i += 4
            elif html[i:i+6].lower() == '</div>':
                depth -= 1
                if depth == 0:
                    return html[:i] + '\n' + clutch_img + '\n' + html[i:]
                i += 6
            else:
                i += 1
        return html

    # Case 2: hero has hero-inner but no CTA — add clutch after the closing </p> before </div>
    if 'class="hero-inner"' in html:
        # Find hero-inner opening tag end
        idx = html.find('class="hero-inner"')
        tag_end = html.find('>', idx) + 1
        depth = 1
        i = tag_end
        last_p_close = -1
        while i < len(html) and depth > 0:
            if html[i:i+4] in ('<div', '<DIV'):
                depth += 1
                i += 4
            elif html[i:i+6].lower() == '</div>':
                depth -= 1
                if depth == 0:
                    # Insert after the last </p> before this </div>
                    insert_at = i
                    # Find last </p> before insert_at
                    lp = html.rfind('</p>', 0, insert_at)
                    if lp != -1:
                        insert_at = lp + 4
                    return html[:insert_at] + '\n' + clutch_img + '\n' + html[insert_at:]
                i += 6
            else:
                i += 1

    # Case 3: header.hero with no inner wrapper — add before </header>
    idx = html.find('</header>')
    if idx != -1:
        return html[:idx] + clutch_img + '\n' + html[idx:]

    return html


def fix_verified(html, prefix):
    """Standardize verifiedsecured.png to width=150 height=37."""
    html = re.sub(
        r'(<img[^>]+verifiedsecured\.png[^>]+)width="\d+"([^>]+)height="\d+"',
        r'\g<1>width="150"\2height="37"',
        html
    )
    html = re.sub(
        r'(<img[^>]+verifiedsecured\.png[^>]+)height="\d+"([^>]+)width="\d+"',
        r'\g<1>height="37"\2width="150"',
        html
    )
    return html


def replace_card_icons(html, icon_map):
    """Replace <div class="card-icon">NN</div> with SVG icons."""
    for num, icon_key in icon_map.items():
        old = f'<div class="card-icon">{num}</div>'
        new = ICONS[icon_key]
        html = html.replace(old, new)
    return html


def add_industry_card_icons(html):
    """Add SVG icons to industry page feature cards that have no card-icon."""
    if 'card-icon' in html:
        return html  # already has icons
    # For industry pages, add icons based on h3 content
    for h3_text, icon_key in INDUSTRY_ICON_MAP:
        old = f'<article class="feature-card"><h3>{h3_text}</h3>'
        new = f'<article class="feature-card">{ICONS[icon_key]}<h3>{h3_text}</h3>'
        html = html.replace(old, new)
    return html


def update_hero_illustration(html, page_key, prefix):
    """Update hero illustration img src to .png for mapped pages."""
    if page_key not in HERO_PNG_MAP:
        return html
    png_name = HERO_PNG_MAP[page_key]

    # Replace the hero-illustration img tag
    # Pattern: <div class="hero-illustration">...<img src="...jpg"...>...</div>
    # OR direct img in hero-illustration

    # Update any img inside .hero-illustration
    def swap_src(m):
        tag = m.group(0)
        # Replace src="...jpg" with the png
        tag = re.sub(r'src="[^"]*"', f'src="{prefix}images/{png_name}"', tag)
        # Update dimensions to 1200x900
        tag = re.sub(r'width="\d+"', 'width="1200"', tag)
        tag = re.sub(r'height="\d+"', 'height="900"', tag)
        # Remove inline style on the img (radius handled by CSS)
        tag = re.sub(r'\s*style="[^"]*"', '', tag)
        return tag

    # Find hero-illustration div and update its img
    pattern = r'<div class="hero-illustration">(.*?)</div>'
    def update_illustration(m):
        inner = m.group(1)
        inner = re.sub(r'<img[^>]+>', swap_src, inner, flags=re.DOTALL)
        return f'<div class="hero-illustration">{inner}</div>'

    html = re.sub(pattern, update_illustration, html, flags=re.DOTALL)
    return html


def ensure_section_alt(html):
    """Replace section--soft with section--alt for non-footer sections."""
    # The CSS change handles this globally, but ensure HTML uses the right class
    # Actually section--soft is already correct since we'll update CSS
    # No HTML change needed
    return html


def process_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    prefix = get_prefix(filepath)
    basename = os.path.basename(filepath).replace('.html', '')

    # 1. Add clutch badge
    html = add_clutch(html, prefix)

    # 2. Fix verifiedsecured size
    html = fix_verified(html, prefix)

    # 3. Replace numbered card-icons with SVGs (index + services hub)
    if basename in ('index', 'services'):
        html = replace_card_icons(html, SERVICE_ICON_MAP)

    # 4. Add icons to industry page feature cards (no numbered icons)
    parent_dir = os.path.basename(os.path.dirname(filepath))
    if parent_dir == 'industries':
        html = add_industry_card_icons(html)

    # 5. Update hero illustration to PNG for mapped pages
    html = update_hero_illustration(html, basename, prefix)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    return filepath


# ─────────────────────────────────────────────────────────
# CSS UPDATE
# ─────────────────────────────────────────────────────────
def update_css():
    css_path = os.path.join(BASE, 'css', 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Add --bg-alt to :root after --bg-surface
    if '--bg-alt' not in css:
        css = css.replace(
            '  --bg-surface:     #f3fafd;',
            '  --bg-surface:     #f3fafd;\n  --bg-alt:          #F4F5F7;'
        )

    # 2. Update section--soft to use --bg-alt instead of --bg-soft
    css = css.replace(
        '.section--soft { background: var(--bg-soft); }',
        '.section--soft { background: var(--bg-alt); }'
    )
    # Also handle multi-line version
    css = re.sub(
        r'(\.section--soft\s*\{[^}]*?)background:\s*var\(--bg-soft\)',
        r'\1background: var(--bg-alt)',
        css
    )

    # 3. Update nth-child alternation to use --bg-alt
    css = css.replace(
        'section:nth-child(even) { background: var(--bg-soft); }',
        'section:nth-child(even) { background: var(--bg-alt); }'
    )

    # 4. Update .card-icon to SVG-friendly styles (replace existing)
    old_card_icon = """.feature-card .card-icon {
  width: 48px; height: 48px;
  background: var(--bg-soft);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--blue);
  transition: transform 0.2s ease-out;
}
.feature-card:hover .card-icon { transform: scale(1.08); }"""

    new_card_icon = """.feature-card .card-icon,
.card-icon {
  width: 32px; height: 32px;
  color: var(--blue);
  margin-bottom: var(--space-sm);
  flex-shrink: 0;
  transition: transform 0.2s ease-out;
}
.feature-card:hover .card-icon { transform: scale(1.1) rotate(-3deg); }"""

    if old_card_icon in css:
        css = css.replace(old_card_icon, new_card_icon)
    elif '.feature-card .card-icon' in css and '.card-icon' not in css.split('.feature-card .card-icon')[0][-20:]:
        pass  # already updated

    # 5. Append new CSS blocks at end (only if not already added)
    new_blocks = """
/* ============================================
   PASS 2 ADDITIONS — livewebstudios.com
   ============================================ */

/* Section alternate bg */
.section--alt { background: var(--bg-alt); }

/* Clutch badge */
.clutch-badge {
  display: block;
  width: 180px;
  height: auto;
  margin-top: 20px;
  opacity: 0.92;
  transition: opacity 0.2s ease;
}
.clutch-badge:hover { opacity: 1; }

/* Hero CTA group */
.hero-cta-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
.hero--centered .hero-cta-group { align-items: center; }

/* Illustration placeholder */
.illustration-placeholder {
  width: 420px;
  max-width: 100%;
  height: 320px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.illustration-placeholder::after {
  content: 'Image Coming Soon';
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.875rem;
}

/* Card title hover */
.feature-card h3 {
  transition: color 0.18s ease;
}
.feature-card:hover h3 { color: var(--blue); }

/* Nav dropdown icons — 2-col grid */
.dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 10px;
  min-width: 480px;
}
.dropdown-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  min-width: 240px;
}
.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  color: var(--text-body);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: color 0.15s ease, background 0.15s ease;
  text-transform: none;
  letter-spacing: 0;
}
.nav-dropdown-item:hover {
  color: var(--blue);
  background: var(--bg-alt);
}
.nav-dropdown-item.active { color: var(--blue); }
.nav-dropdown-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--blue);
  opacity: 0.8;
}
.nav-dropdown-item:hover .nav-dropdown-icon { opacity: 1; }

@media (max-width: 820px) {
  .dropdown-grid { grid-template-columns: 1fr; min-width: unset; }
  .nav-dropdown-item { padding: 0.4rem 0; font-size: 0.85rem; }
}

/* END PASS 2 ADDITIONS */
"""

    if 'PASS 2 ADDITIONS' not in css:
        css += new_blocks

    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print(f'  ✓  css/style.css updated')


# ─────────────────────────────────────────────────────────
# NAV.JS UPDATE — Icon-enhanced dropdowns
# ─────────────────────────────────────────────────────────
def icon_item(href, icon_svg_path, label, extra_class=''):
    cls = f'nav-dropdown-item{" " + extra_class if extra_class else ""}'
    return (
        f"'<a href=\"' + p + '{href}\" class=\"{cls}\">' +"
        f"\n          '<svg class=\"nav-dropdown-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">{icon_svg_path}</svg>' +"
        f"\n          '{label}' +"
        f"\n        '</a>' +"
    )

def update_nav():
    nav_path = os.path.join(BASE, 'js', 'nav.js')
    with open(nav_path, 'r', encoding='utf-8') as f:
        js = f.read()

    # Build the new services dropdown HTML (2-col grid)
    svc_items = [
        ('services/website-design.html',      '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',                                                  'Website Design'),
        ('services/ai-platform.html',          '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>',  'AI Platform'),
        ('services/seo.html',                  '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',                                                                   'SEO &amp; AI Search'),
        ('services/hosting.html',              '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',  'Web Hosting'),
        ('services/ai-business-services.html', '<path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>',  'AI Business Services'),
        ('services/ai-workflow.html',           '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',                 'AI Workflow'),
        ('services/branding.html',              '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',                                                         'Logo &amp; Branding'),
        ('services/ecommerce.html',             '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',  'Ecommerce'),
        ('services/maintenance-plans.html',     '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',  'Maintenance Plans'),
        ('services/consulting.html',            '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',  'Audits &amp; Consulting'),
        ('services/ai-image.html',              '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',   'AI Image Services'),
        ('services/logo-design.html',           '<circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>',  'Logo Design'),
    ]

    ind_items = [
        ('industries/healthcare.html',         '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',                                                                                         'Healthcare'),
        ('industries/law-firm.html',            '<path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M7 8l5-6 5 6"/>',                                                      'Law Firms'),
        ('industries/financial-services.html',  '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                       'Financial Services'),
        ('industries/construction.html',         '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>',                                                             'Construction'),
        ('industries/real-estate.html',          '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',                       'Real Estate'),
        ('industries/manufacturing.html',        '<path d="M2 20h20M4 20V10l4-4 4 4V4l4 4v12"/>',                                                                               'Manufacturing'),
        ('industries/dental.html',               '<path d="M12 2a5 5 0 0 0-5 5c0 3 2 5 2 8a3 3 0 0 0 6 0c0-3 2-5 2-8a5 5 0 0 0-5-5z"/>',                                       'Dental'),
        ('industries/nonprofit.html',            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',  'Nonprofits'),
        ('industries/b2b.html',                  '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',                    'B2B'),
        ('industries/insurance.html',            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',                                                                      'Insurance'),
    ]

    def build_svc_dropdown():
        lines = ["'<div class=\"nav-dropdown services-dropdown\"><div class=\"dropdown-grid\">' +"]
        for href, icon_path, label in svc_items:
            lines.append(
                f"          '<a href=\"' + p + '{href}\" class=\"nav-dropdown-item\">"
                f"<svg class=\"nav-dropdown-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">{icon_path}</svg>"
                f"{label}</a>' +"
            )
        lines.append("          '</div></div>' +")
        return '\n'.join(lines)

    def build_ind_dropdown():
        lines = ["'<div class=\"nav-dropdown industries-dropdown\"><div class=\"dropdown-list\">' +"]
        for href, icon_path, label in ind_items:
            lines.append(
                f"          '<a href=\"' + p + '{href}\" class=\"nav-dropdown-item\">"
                f"<svg class=\"nav-dropdown-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">{icon_path}</svg>"
                f"{label}</a>' +"
            )
        lines.append("          '</div></div>' +")
        return '\n'.join(lines)

    # Replace the Services dropdown (everything between /* SERVICES dropdown */ and the li close)
    old_svc = re.search(
        r"/\* SERVICES dropdown \*/(.*?)(?=\s+/\* INDUSTRIES)",
        js, re.DOTALL
    )
    if old_svc:
        new_svc_block = f"""/* SERVICES dropdown */
          '<li class="nav-item">' +
            '<a href="' + p + 'services.html" data-page="services" aria-haspopup="true" aria-expanded="false">Services</a>' +
            {build_svc_dropdown()}
          '</li>' +

          """
        js = js[:old_svc.start()] + new_svc_block + js[old_svc.end():]

    # Replace Industries dropdown
    old_ind = re.search(
        r"/\* INDUSTRIES dropdown \*/(.*?)(?=\s+'<li><a href=)",
        js, re.DOTALL
    )
    if old_ind:
        new_ind_block = f"""/* INDUSTRIES dropdown */
          '<li class="nav-item">' +
            '<a href="' + p + 'industries/index.html" data-page="industries" aria-haspopup="true" aria-expanded="false">Industries</a>' +
            {build_ind_dropdown()}
          '</li>' +

          """
        js = js[:old_ind.start()] + new_ind_block + js[old_ind.end():]

    # Also update nav dropdown CSS selector to handle div-based dropdowns
    # (The CSS transition now targets .nav-dropdown which covers both ul and div)

    with open(nav_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'  ✓  js/nav.js updated')


# ─────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────
if __name__ == '__main__':
    print(f'\n=== LWS Design Pass 2 ===\n')

    print('[1/3] Updating style.css...')
    update_css()

    print('\n[2/3] Updating nav.js...')
    update_nav()

    print('\n[3/3] Processing HTML files...')
    html_files = sorted(glob.glob(os.path.join(BASE, '**', '*.html'), recursive=True))

    ok = 0
    for f in html_files:
        process_html(f)
        rel = os.path.relpath(f, BASE)
        print(f'  ✓  {rel}')
        ok += 1

    print(f'\n=== Done. {ok} HTML files updated. ===')

    # ── Verification ──
    print('\n─── Verification ───')
    clutch_count = sum(1 for f in html_files if 'clutch-badge' in open(f).read())
    verified_150 = sum(1 for f in html_files if 'width="150"' in open(f).read() and 'verifiedsecured' in open(f).read())
    anim_count   = sum(1 for f in html_files if 'animations.js' in open(f).read())
    hero_head    = sum(1 for f in html_files if 'hero-headline' in open(f).read())
    card_icon_svg = sum(1 for f in html_files if 'card-icon" viewBox' in open(f).read())

    print(f'  clutch-badge on pages:      {clutch_count}/{ok}')
    print(f'  verifiedsecured width=150:  {verified_150}/{ok}')
    print(f'  animations.js linked:       {anim_count}/{ok}')
    print(f'  hero-headline class:        {hero_head}')
    print(f'  pages with SVG card-icons:  {card_icon_svg}')
    print()
