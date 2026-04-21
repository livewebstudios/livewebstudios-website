/* =================================================
   LIVE WEB STUDIOS — animations.js
   livewebstudios.com | April 2026
   Handles: scroll reveals, card hovers, FAQ accordion,
   count-up stats, nav dropdown
   No dependencies — vanilla JS only
   ================================================= */

document.addEventListener('DOMContentLoaded', () => {

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
    if (el.classList.contains('feature-card') || el.classList.contains('blog-card')) {
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

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      // Open clicked unless it was already open
      if (!isOpen) item.classList.add('is-open');
    });
  });

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

  /* ---- HERO STAGGER REVEAL (fallback if not handled by CSS alone) ---- */
  // If .hero-headline, .hero-subhead, .hero-cta exist on page load,
  // CSS animation-delay handles the stagger automatically.
  // This JS block is a no-op unless you need dynamic injection.

  /* ---- NAV DROPDOWN (keyboard / focus support) ---- */
  // CSS :hover handles mouse. This adds keyboard/focus support.
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('focusin', () => item.classList.add('is-focused'));
    item.addEventListener('focusout', () => item.classList.remove('is-focused'));
  });

});
