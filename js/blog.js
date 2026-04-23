/**
 * LWS Blog Engine
 * Reads posts/index.json for the listing page
 * Reads _posts/*.md for individual post pages
 * Requires marked.js on post.html
 */

(function () {
  'use strict';

  const PAGE = document.body.getAttribute('data-page');
  const BASE = /\/blog\//.test(window.location.pathname) ? '../' : '';

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };
    const meta = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      meta[key] = val;
    });
    return { meta, body: match[2].trim() };
  }

  function renderCard(post) {
    const href = BASE + 'post.html?post=' + encodeURIComponent(post.slug || '');
    const img  = post.thumbnail ? '<div class="card-image-wrap"><img class="card-image" src="' + post.thumbnail + '" alt="' + escHtml(post.title) + '" width="600" height="338" loading="lazy"></div>' : '';
    const cat  = post.category ? '<span>' + escHtml(post.category) + '</span>' : '';
    const date = post.date ? '<span>' + formatDate(post.date) + '</span>' : '';
    return '<article class="blog-card">' + img + '<div class="body"><div class="meta">' + cat + date + '</div><h3><a href="' + href + '">' + escHtml(post.title) + '</a></h3><p>' + escHtml(post.excerpt || '') + '</p><a class="link-arrow" href="' + href + '">Read Article <span class="arrow">&rarr;</span></a></div></article>';
  }

  /* ---- BLOG LISTING ---- */
  if (PAGE === 'blog') {
    const loading = document.getElementById('blog-loading');
    const grid    = document.getElementById('blog-grid');
    const empty   = document.getElementById('blog-empty');
    const error   = document.getElementById('blog-error');

    fetch(BASE + 'posts/index.json?v=' + Date.now())
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(posts => {
        loading.style.display = 'none';
        if (!posts || !posts.length) { empty.style.display = 'block'; return; }
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        posts.forEach(post => grid.insertAdjacentHTML('beforeend', renderCard(post)));
        grid.removeAttribute('style');
        // Register with animation observer — falls back to immediate visible
        grid.querySelectorAll('.blog-card').forEach(card => {
          if (window.LWS && window.LWS.observe) {
            window.LWS.observe(card);
          } else {
            card.classList.add('is-visible');
          }
        });
      })
      .catch(() => {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.innerHTML = '<p>Could not load posts. If you just published, wait for Netlify to redeploy and refresh.</p>';
      });
  }

  /* ---- SINGLE POST ---- */
  if (PAGE === 'post') {
    const params  = new URLSearchParams(window.location.search);
    const slug    = params.get('post');
    const loading = document.getElementById('post-loading');
    const errorEl = document.getElementById('post-error');
    const wrapper = document.getElementById('post-wrapper');

    if (!slug) { loading.style.display='none'; errorEl.style.display='block'; return; }

    fetch('_posts/' + slug + '.md?v=' + Date.now())
      .then(r => { if (!r.ok) throw new Error('not found'); return r.text(); })
      .then(raw => {
        const { meta, body } = parseFrontmatter(raw);
        document.getElementById('post-title-tag').textContent = (meta.title || 'Post') + ' | Live Web Studios';
        document.getElementById('post-meta-desc').setAttribute('content', meta.excerpt || '');
        document.getElementById('post-heading').textContent = meta.title || '';
        document.getElementById('post-date-display').textContent = formatDate(meta.date);
        if (meta.category) document.getElementById('post-category').textContent = meta.category;
        if (meta.thumbnail) {
          const img = document.getElementById('post-hero-image');
          img.src = meta.thumbnail; img.alt = meta.title || ''; img.style.display = 'block';
        }
        const content = document.getElementById('post-content');
        if (typeof marked !== 'undefined') { content.innerHTML = marked.parse(body); }
        else { content.textContent = body; }
        loading.style.display = 'none';
        wrapper.style.display = 'block';
      })
      .catch(() => { loading.style.display='none'; errorEl.style.display='block'; });
  }

})();
