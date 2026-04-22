/**
 * LWS Blog Engine
 * Reads posts/index.json for the listing page
 * Reads _posts/*.md for individual post pages
 * Requires marked.js on post.html
 */

(function () {
  'use strict';

  const PAGE = document.body.getAttribute('data-page');
<<<<<<< HEAD
  const BASE = /\/blog\//.test(window.location.pathname) ? '../' : '';
=======

  // ─── UTILITY ────────────────────────────────────────────────────────────────
>>>>>>> 0027f06 (Add post template and blog JS; GitHub workflow; update blog.html.)

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

<<<<<<< HEAD
  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };
=======
  function slugFromFilename(filename) {
    // "_posts/2026-04-22-my-post.md" → "2026-04-22-my-post"
    return filename.replace(/^_posts\//, '').replace(/\.md$/, '');
  }

  // ─── FRONTMATTER PARSER ─────────────────────────────────────────────────────

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };

>>>>>>> 0027f06 (Add post template and blog JS; GitHub workflow; update blog.html.)
    const meta = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
<<<<<<< HEAD
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
=======
      let val = line.slice(idx + 1).trim();
      // Strip surrounding quotes
      val = val.replace(/^["']|["']$/g, '');
      meta[key] = val;
    });

    return { meta, body: match[2].trim() };
  }

  // ─── BLOG LISTING PAGE ──────────────────────────────────────────────────────

  function initBlogListing() {
>>>>>>> 0027f06 (Add post template and blog JS; GitHub workflow; update blog.html.)
    const loading = document.getElementById('blog-loading');
    const grid    = document.getElementById('blog-grid');
    const empty   = document.getElementById('blog-empty');
    const error   = document.getElementById('blog-error');

<<<<<<< HEAD
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
=======
    fetch('posts/index.json?v=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error('index not found');
        return r.json();
      })
      .then(posts => {
        loading.style.display = 'none';

        if (!posts || posts.length === 0) {
          empty.style.display = 'block';
          return;
        }

        // Sort newest first
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        posts.forEach(post => {
          grid.insertAdjacentHTML('beforeend', renderCard(post));
        });

        grid.style.display = '';
>>>>>>> 0027f06 (Add post template and blog JS; GitHub workflow; update blog.html.)
      })
      .catch(() => {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.innerHTML = '<p>Could not load posts. If you just published, wait for Netlify to redeploy and refresh.</p>';
      });
  }

<<<<<<< HEAD
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
     
        if (meta.category) document.getElementById('post-category').textContent = meta.category;



       const heroSrc = meta.image || meta.thumbnail;
if (heroSrc) {
  const img = document.getElementById('post-hero-image');
  img.src = heroSrc; img.alt = meta.title || ''; img.style.display = 'block';
}



        const content = document.getElementById('post-content');
        if (typeof marked !== 'undefined') { content.innerHTML = marked.parse(body); }
        else { content.textContent = body; }
        loading.style.display = 'none';
        wrapper.style.display = 'block';
      })
      .catch(() => { loading.style.display='none'; errorEl.style.display='block'; });
=======
  function renderCard(post) {
    const slug = post.slug || slugFromFilename(post.filename || '');
    const href = 'post.html?post=' + encodeURIComponent(slug);
    const img  = post.thumbnail
      ? `<div class="card-image-wrap"><img class="card-image" src="${post.thumbnail}" alt="${escHtml(post.title)}" width="600" height="338" loading="lazy"></div>`
      : '';
    const cat  = post.category ? `<span>${escHtml(post.category)}</span>` : '';
    const date = post.date ? `<span>${formatDate(post.date)}</span>` : '';

    return `
      <article class="blog-card">
        ${img}
        <div class="body">
          <div class="meta">${cat}${date}</div>
          <h3><a href="${href}">${escHtml(post.title)}</a></h3>
          <p>${escHtml(post.excerpt || '')}</p>
          <a class="link-arrow" href="${href}">Read Article <span class="arrow">&rarr;</span></a>
        </div>
      </article>`;
  }

  // ─── SINGLE POST PAGE ───────────────────────────────────────────────────────

  function initSinglePost() {
    const params   = new URLSearchParams(window.location.search);
    const slug     = params.get('post');
    const loading  = document.getElementById('post-loading');
    const errorEl  = document.getElementById('post-error');
    const wrapper  = document.getElementById('post-wrapper');

    if (!slug) {
      showPostError(loading, errorEl);
      return;
    }

    const mdPath = '_posts/' + slug + '.md';

    fetch(mdPath + '?v=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error('post not found');
        return r.text();
      })
      .then(raw => {
        const { meta, body } = parseFrontmatter(raw);

        // Update <head>
        document.getElementById('post-title-tag').textContent =
          (meta.title || 'Post') + ' | Live Web Studios';
        document.getElementById('post-meta-desc').content = meta.excerpt || '';

        // Populate hero
        document.getElementById('post-heading').textContent = meta.title || '';
        document.getElementById('post-date-display').textContent = formatDate(meta.date);

        if (meta.category) {
          document.getElementById('post-category').textContent = meta.category;
        }

        if (meta.thumbnail) {
          const heroImg = document.getElementById('post-hero-image');
          heroImg.src   = meta.thumbnail;
          heroImg.alt   = meta.title || '';
          heroImg.style.display = 'block';
        }

        // Render markdown body
        if (typeof marked !== 'undefined') {
          document.getElementById('post-content').innerHTML = marked.parse(body);
        } else {
          // Fallback: plain text
          document.getElementById('post-content').textContent = body;
        }

        loading.style.display = 'none';
        wrapper.style.display = 'block';
      })
      .catch(() => showPostError(loading, errorEl));
  }

  function showPostError(loading, errorEl) {
    loading.style.display = 'none';
    errorEl.style.display = 'block';
  }

  // ─── HTML ESCAPE ────────────────────────────────────────────────────────────

  function escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── INIT ───────────────────────────────────────────────────────────────────

  if (PAGE === 'blog') {
    initBlogListing();
  } else if (PAGE === 'post') {
    initSinglePost();
>>>>>>> 0027f06 (Add post template and blog JS; GitHub workflow; update blog.html.)
  }

})();
