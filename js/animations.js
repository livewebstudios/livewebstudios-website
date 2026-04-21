/* =================================================
   LIVE WEB STUDIOS — animations.js
   livewebstudios.com | April 2026
   Handles: scroll reveals, FAQ accordion, count-up stats,
   split-section reveal (respects prefers-reduced-motion)
   No dependencies — vanilla JS only
   ================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  if (prefersReducedMotion) {
    document.querySelectorAll(
      '.feature-card, .section-heading, .section-subhead, .split-section, .blog-card, .portfolio-card'
    ).forEach((el) => el.classList.add('is-visible'));
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
