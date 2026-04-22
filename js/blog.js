/**
 * LWS Blog Engine
 * Reads posts/index.json for the listing page
 * Reads _posts/*.md for individual post pages
 * Requires marked.js on post.html
 */

(function () {
  'use strict';

  const PAGE = document.body.getAttribute('data-page');

  // ΓöÇΓöÇΓöÇ UTILITY ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function slugFromFilename(filename) {
    // "_posts/2026-04-22-my-post.md" ΓåÆ "2026-04-22-my-post"
    return filename.replace(/^_posts\//, '').replace(/\.md$/, '');
  }

  // ΓöÇΓöÇΓöÇ FRONTMATTER PARSER ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };

    const meta = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      // Strip surrounding quotes
      val = val.replace(/^["']|["']$/g, '');
      meta[key] = val;
    });

    return { meta, body: match[2].trim() };
  }

  // ΓöÇΓöÇΓöÇ BLOG LISTING PAGE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function initBlogListing() {
    const loading = document.getElementById('blog-loading');
    const grid    = document.getElementById('blog-grid');
    const empty   = document.getElementById('blog-empty');
    const error   = document.getElementById('blog-error');

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
      })
      .catch(() => {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.innerHTML = '<p>Could not load posts. If you just published, wait for Netlify to redeploy and refresh.</p>';
      });
  }

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

  // ΓöÇΓöÇΓöÇ SINGLE POST PAGE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

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

  // ΓöÇΓöÇΓöÇ HTML ESCAPE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ΓöÇΓöÇΓöÇ INIT ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  if (PAGE === 'blog') {
    initBlogListing();
  } else if (PAGE === 'post') {
    initSinglePost();
  }

})();
