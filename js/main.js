/* =========================================================================
   main.js — Live Web Studios v2
   Hero sequence · Parallax · Scroll reveal · Nav · Smooth scroll
   ========================================================================= */

(function () {
  'use strict';

  var HEADLINE = "Your website should work as hard as you do.";

  /* ── Build word-by-word headline ── */
  function buildHeadline() {
    var el = document.getElementById('headline');
    if (!el) return 0;
    el.innerHTML = '';
    var words = HEADLINE.replace('.', '').split(' ');

    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.animationDelay = (0.9 + i * 0.08) + 's';
      el.appendChild(span);
    });

    /* period */
    var period = document.createElement('span');
    period.className = 'word';
    period.textContent = '.';
    period.style.animationDelay = (0.9 + words.length * 0.08) + 's';
    el.appendChild(period);

    /* blinking cursor */
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = '|';
    el.appendChild(cursor);

    return 0.9 + words.length * 0.08;
  }

  /* ── Stagger remaining hero elements after last word ── */
  function initHero() {
    var lastWordTime = buildHeadline();
    var subhead = document.getElementById('subhead');
    var cta     = document.getElementById('cta');
    var stats   = document.getElementById('stats');
    if (subhead) subhead.style.animationDelay = (lastWordTime + 0.25) + 's';
    if (cta)     cta.style.animationDelay     = (lastWordTime + 0.55) + 's';
    if (stats)   stats.style.animationDelay   = (lastWordTime + 0.90) + 's';
  }

  /* ── Mouse parallax on orbs ── */
  function initParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var orbs = [
      { el: document.getElementById('orb1'), fx: -18, fy: -12 },
      { el: document.getElementById('orb2'), fx:  14, fy:  10 },
      { el: document.getElementById('orb3'), fx: -10, fy:  14 },
      { el: document.getElementById('orb4'), fx:   8, fy:  -8 },
    ];
    hero.addEventListener('mousemove', function (e) {
      var r  = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      var dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      orbs.forEach(function (o) {
        if (o.el) o.el.style.transform = 'translate(' + (dx * o.fx) + 'px,' + (dy * o.fy) + 'px)';
      });
    });
    hero.addEventListener('mouseleave', function () {
      orbs.forEach(function (o) { if (o.el) o.el.style.transform = ''; });
    });
  }

  /* ── Intersection Observer scroll reveal ── */
  function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Nav glass blur on scroll ── */
  function initNav() {
    var nav = document.querySelector('nav') || document.querySelector('.site-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Smooth scroll for # anchors ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Inject aurora orbs into all interior page heroes (matches home hero bg) ── */
  function initInteriorHeroOrbs() {
    var hero = document.querySelector('header.hero');
    if (!hero) return;
    if (document.body.getAttribute('data-page') === 'about') return; // about has light bg
    hero.classList.add('bg-aurora');
    ['au1','au2','au3','au4','au5'].forEach(function (cls) {
      var d = document.createElement('div');
      d.className = 'orb ' + cls;
      hero.insertBefore(d, hero.firstChild);
    });
    var scan = document.createElement('div');
    scan.className = 'scan-line';
    hero.insertBefore(scan, hero.firstChild);
    var curtain = document.createElement('div');
    curtain.className = 'curtain-r';
    hero.insertBefore(curtain, hero.firstChild);
  }

  /* ── FAQ v3 accordion ── */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
    var expandBtn   = document.getElementById('expandAll');
    var collapseBtn = document.getElementById('collapseAll');
    if (expandBtn)   expandBtn.addEventListener('click',   function () { items.forEach(function (i) { i.classList.add('open');    }); });
    if (collapseBtn) collapseBtn.addEventListener('click', function () { items.forEach(function (i) { i.classList.remove('open'); }); });
  }

  /* ── Hero video — fade-in on playing, pause when tab hidden,
       and (for data-play-once videos) freeze on the last frame. ── */
  function initHeroVideo() {
    var video = document.querySelector('.hero-video');
    if (!video) return;

    var playOnce = video.hasAttribute('data-play-once');
    var hasEnded = false;

    // Fade in once playing — prevents black flash before first frame
    video.addEventListener('playing', function () {
      video.classList.add('loaded');
    }, { once: true });

    // Fallback — if `playing` doesn't fire within 2s, reveal anyway
    setTimeout(function () {
      if (!video.classList.contains('loaded')) {
        video.classList.add('loaded');
      }
    }, 2000);

    // For play-once videos: freeze on the last frame. The browser keeps
    // showing the last decoded frame after a video ends, but we also clamp
    // currentTime in case the browser drops back to 0.
    if (playOnce) {
      video.addEventListener('ended', function () {
        hasEnded = true;
        try {
          // Pin to just-before-end so the last frame stays visible
          var t = video.duration;
          if (isFinite(t) && t > 0) video.currentTime = Math.max(0, t - 0.05);
          video.pause();
        } catch (e) { /* ignore */ }
      });
    }

    // Pause when tab is hidden — saves battery and CPU.
    // For play-once videos that have ended, do NOT auto-restart on visibility.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        video.pause();
      } else {
        if (playOnce && hasEnded) return;  // keep the last frame frozen
        var p = video.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHero();
    initParallax();
    initHeroVideo();
    initScrollReveal();
    initNav();
    initSmoothScroll();
    initFaq();
    initInteriorHeroOrbs();
  });

})();
