/* =========================================================================
   namesake.js — Namesake vertical (Live Web Studios)
   - Hero mouse parallax on the ambient orbs (fluid motion, §2)
   - Live name preview + form prefill on the Start page (§9)
   Vanilla JS only. Respects prefers-reduced-motion for the parallax.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mouse parallax on hero / preview orbs ── */
  function initParallax() {
    if (reduceMotion) return;
    var stages = document.querySelectorAll('[data-ns-parallax]');
    stages.forEach(function (stage) {
      var orbs = stage.querySelectorAll('.ns-orb');
      if (!orbs.length) return;
      stage.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        orbs.forEach(function (orb, i) {
          var depth = (i + 1) * 10;
          orb.style.transform = 'translate(' + (dx * depth) + 'px,' + (dy * depth) + 'px)';
        });
      });
      stage.addEventListener('mouseleave', function () {
        orbs.forEach(function (orb) { orb.style.transform = ''; });
      });
    });
  }

  /* ── Live name preview + carry the value into the form's name field ── */
  function initNamePreview() {
    var input = document.getElementById('visitor-name');
    var preview = document.getElementById('name-preview');
    if (!input || !preview) return;
    var formName = document.getElementById('form-name');

    function sync() {
      var v = input.value.trim();
      preview.textContent = v ? input.value.toUpperCase() : 'YOUR NAME';
      preview.classList.toggle('is-placeholder', !v);
      if (formName) formName.value = input.value;   // prefill so they don't type it twice
    }
    input.addEventListener('input', sync);

    /* If the form name field is edited directly, keep the preview in step */
    if (formName) {
      formName.addEventListener('input', function () {
        if (document.activeElement === formName) {
          input.value = formName.value;
          var v = formName.value.trim();
          preview.textContent = v ? formName.value.toUpperCase() : 'YOUR NAME';
          preview.classList.toggle('is-placeholder', !v);
        }
      });
    }
    sync();
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  ready(function () {
    initParallax();
    initNamePreview();
  });
})();
