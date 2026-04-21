/* =================================================
   LIVE WEB STUDIOS — animations.js
   livewebstudios.com | April 2026
   Handles: scroll reveals, FAQ accordion, count-up stats,
   split-section reveal (respects prefers-reduced-motion)
   No dependencies — vanilla JS only
   ================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- FAQ: multi-open accordion, ARIA, expand/collapse all ---- */
  function syncFaqItemState(item, open) {
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    item.classList.toggle('is-open', open);
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer');
    if (!btn || !panel) return;

    if (!panel.id) {
      panel.id = `faq-panel-${Math.random().toString(36).slice(2, 11)}`;
    }
    if (!btn.getAttribute('aria-controls')) {
      btn.setAttribute('aria-controls', panel.id);
    }
    if (!btn.id) {
      btn.id = `faq-q-${Math.random().toString(36).slice(2, 11)}`;
    }
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', btn.id);

    const initiallyOpen = item.classList.contains('is-open');
    btn.setAttribute('aria-expanded', initiallyOpen ? 'true' : 'false');

    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      syncFaqItemState(item, willOpen);
    });
  });

  document.querySelectorAll('.faq-toolbar').forEach((toolbar) => {
    const stack = toolbar.nextElementSibling;
    if (!stack || !stack.classList.contains('faq-stack')) return;

    const expandBtn = toolbar.querySelector('[data-faq-expand-all]');
    const collapseBtn = toolbar.querySelector('[data-faq-collapse-all]');

    expandBtn?.addEventListener('click', () => {
      stack.querySelectorAll('.faq-item').forEach((item) => syncFaqItemState(item, true));
    });
    collapseBtn?.addEventListener('click', () => {
      stack.querySelectorAll('.faq-item').forEach((item) => syncFaqItemState(item, false));
    });
  });

  if (prefersReducedMotion) {
    document.querySelectorAll(
      '.feature-card, .section-heading, .section-subhead, .split-section, .blog-card, .portfolio-card'
    ).forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.section--faq .faq-stack').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.section--faq .faq-item').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('[data-target]').forEach((el) => {
      const raw = el.dataset.target;
      if (raw === undefined || raw === '') return;
      const target = parseFloat(raw);
      if (Number.isNaN(target)) return;
      el.textContent = el.dataset.decimal === 'true' ? target.toFixed(2) : String(Math.round(target));
    });
    document.querySelectorAll('.split-section').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  /* ---- SHARED SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.feature-card, .section-heading, .section-subhead, .split-section, .blog-card, .portfolio-card'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    // Stagger cards in the same parent
    if (el.classList.contains('feature-card') || el.classList.contains('blog-card') || el.classList.contains('portfolio-card')) {
      const siblings = Array.from(el.parentElement.children);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.08}s`;
    }
    revealObs.observe(el);
  });

  /* ---- FAQ sections: stack fade-up, then staggered items (services + industries) ---- */
  document.querySelectorAll('.section--faq .faq-stack').forEach((stack) => {
    const items = stack.querySelectorAll('.faq-item');
    const faqObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          stack.classList.add('is-visible');
          items.forEach((item, idx) => {
            window.setTimeout(() => {
              item.classList.add('is-visible');
            }, 90 + idx * 78);
          });
          faqObs.unobserve(stack);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }
    );
    faqObs.observe(stack);
  });

  /* ---- COUNT-UP STATS ---- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = isDecimal
        ? (target * eased).toFixed(2)
        : Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('[data-target]');
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => statsObs.observe(el));

  /* ---- SPLIT SECTION REVEAL ---- */
  const splits = document.querySelectorAll('.split-section');
  const splitObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        splitObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  splits.forEach(s => splitObs.observe(s));

});
