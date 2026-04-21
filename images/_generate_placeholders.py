#!/usr/bin/env python3
"""
Generate placeholder images for Live Web Studios site.
Downloads from picsum.photos (real photos, seed-stable = same image every run).
Run: python3 images/_generate_placeholders.py
"""

import urllib.request
import os
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMAGES = {
    # Page hero images — wide landscape, 1400x700
    "home.jpg":        ("1400", "700", "lws-home"),
    "aboutus.jpg":     ("1400", "700", "lws-about"),
    "blog.jpg":        ("1400", "700", "lws-blog"),

    # Service feature images — 900x600
    "service-custom-web-design.jpg": ("900", "600", "lws-webdesign"),
    "service-ai-platform.jpg":       ("900", "600", "lws-ai"),

    # Industry hero images — 1200x700
    "industries-healthcare.jpg":         ("1200", "700", "lws-healthcare"),
    "industries-law-firm.jpg":           ("1200", "700", "lws-law"),
    "industries-financial-services.jpg": ("1200", "700", "lws-finance"),
    "industries-construction.jpg":       ("1200", "700", "lws-construction"),
    "industries-real-estate.jpg":        ("1200", "700", "lws-realestate"),
    "industries-manufacturing.jpg":      ("1200", "700", "lws-manufacturing"),
    "industries-dental.jpg":             ("1200", "700", "lws-dental"),
    "industries-nonprofit.jpg":          ("1200", "700", "lws-nonprofit"),
    "industries-b2b.jpg":                ("1200", "700", "lws-b2b"),
    "industries-insurance.jpg":          ("1200", "700", "lws-insurance"),

    # Portfolio card images — 800x600
    "portfolio-apex-plumbing.jpg":        ("800", "600", "port-plumb"),
    "portfolio-bergen-architects.jpg":    ("800", "600", "port-arch"),
    "portfolio-coastal-manufacturing.jpg":("800", "600", "port-mfg"),
    "portfolio-don-summit-counseling.jpg":("800", "600", "port-counsel"),
    "portfolio-empire-auto-detail.jpg":   ("800", "600", "port-auto"),
    "portfolio-golan-building.jpg":       ("800", "600", "port-golan"),
    "portfolio-hudson-hvac.jpg":          ("800", "600", "port-hvac"),
    "portfolio-nj-litigation-group.jpg":  ("800", "600", "port-litigation"),
    "portfolio-nj-medical-practice.jpg":  ("800", "600", "port-medical"),
    "portfolio-north-jersey-dental.jpg":  ("800", "600", "port-dental"),
    "portfolio-northeast-logistics.jpg":  ("800", "600", "port-logistics"),
    "portfolio-riverside-catering.jpg":   ("800", "600", "port-catering"),
    "portfolio-scottsdale-trust.jpg":     ("800", "600", "port-trust"),
    "portfolio-summit-real-estate.jpg":   ("800", "600", "port-realty"),
    "portfolio-wolf-music-studios.jpg":   ("800", "600", "port-music"),
}

def download(filename, w, h, seed):
    dest = os.path.join(BASE_DIR, filename)
    if os.path.exists(dest):
        print(f"  SKIP  {filename} (already exists)")
        return

    url = f"https://picsum.photos/seed/{seed}/{w}/{h}"
    print(f"  GET   {filename}  ({w}x{h})  seed={seed}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        with open(dest, "wb") as f:
            f.write(data)
        print(f"  OK    {filename}  ({len(data)//1024} KB)")
    except Exception as e:
        print(f"  FAIL  {filename}: {e}")

    time.sleep(0.15)  # be polite to picsum

if __name__ == "__main__":
    print(f"\nGenerating {len(IMAGES)} placeholder images...\n")
    for fname, (w, h, seed) in IMAGES.items():
        download(fname, w, h, seed)
    print("\nDone. Replace with real photos before launch.\n")
