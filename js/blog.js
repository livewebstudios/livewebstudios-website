/**
 * LWS Blog Engine
 * Reads posts/index.json for the listing page
 * Reads _posts/*.md for individual post pages
 * Requires marked.js on post.html
 */

(function () {
  'use strict';

  var PAGE = document.body.getAttribute('data-page');
  var BASE = /\/blog\//.test(window.location.pathname) ? '../' : '';

  function formatDate(str) {
    if (!str) return '';
    var d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseFrontmatter(raw) {
    var match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };
    var meta = {};
    match[1].split('\n').forEach(function (line) {
      var idx = line.indexOf(':');
      if (idx === -1) return;
      var key = line.slice(0, idx).trim();
      var val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      meta[key] = val;
    });
    return { meta: meta, body: match[2].trim() };
  }

  function renderCard(post) {
    var href = BASE + 'post.html?post=' + encodeURIComponent(post.slug || '');
    var img  = post.thumbnail
      ? '<div class="card-image-wrap"><img class="card-image" src="' + post.thumbnail + '" alt="' + escHtml(post.title) + '" width="600" height="338" loading="lazy"></div>'
      : '';
    var cat  = post.category ? '<span>' + escHtml(post.category) + '</span>' : '';
    var date = post.date ? '<span>' + formatDate(post.date) + '</span>' : '';
    return '<article class="blog-card">' + img + '<div class="body"><div class="meta">' + cat + date + '</div><h3><a href="' + href + '">' + escHtml(post.title) + '</a></h3><p>' + escHtml(post.excerpt || '') + '</p><a class="link-arrow" href="' + href + '">Read Article <span class="arrow">&rarr;</span></a></div></article>';
  }

  if (PAGE === 'blog') {
    var loading = document.getElementById('blog-loading');
    var grid    = document.getElementById('blog-grid');
    var empty   = document.getElementById('blog-empty');
    var error   = document.getElementById('blog-error');

    fetch(BASE + 'posts/index.json?v=' + Date.now())
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (posts) {
        loading.style.display = 'none';
        if (!posts || !posts.length) { empty.style.display = 'block'; return; }
        posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
        posts.forEach(function (post) { grid.insertAdjacentHTML('beforeend', renderCard(post)); });
        grid.removeAttribute('style');
      })
      .catch(function () {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.innerHTML = '<p>Could not load posts. If you just published, wait for Netlify to redeploy and refresh.</p>';
      });
  }

  if (PAGE === 'post') {
    var params  = new URLSearchParams(window.location.search);
    var slug    = params.get('post');
    var loading2 = document.getElementById('post-loading');
    var errorEl = document.getElementById('post-error');
    var wrapper = document.getElementById('post-wrapper');

    if (!slug) { loading2.style.display = 'none'; errorEl.style.display = 'block'; return; }

    fetch('_posts/' + slug + '.md?v=' + Date.now())
      .then(function (r) { if (!r.ok) throw new Error('not found'); return r.text(); })
      .then(function (raw) {
        var parsed = parseFrontmatter(raw);
        var meta = parsed.meta;
        var body = parsed.body;

        document.getElementById('post-title-tag').textContent = (meta.title || 'Post') + ' | Live Web Studios';
        document.getElementById('post-meta-desc').setAttribute('content', meta.excerpt || '');
        document.getElementById('post-heading').textContent = meta.title || '';
        if (meta.date) document.getElementById('post-date-display').textContent = formatDate(meta.date);
        if (meta.category) document.getElementById('post-category').textContent = meta.category;

        var heroSrc = meta.image || meta.thumbnail;
        if (heroSrc) {
          var imgEl = document.getElementById('post-hero-image');
          imgEl.src = heroSrc;
          imgEl.alt = meta.title || '';
          imgEl.style.display = 'block';
        }

        var content = document.getElementById('post-content');
        if (typeof marked !== 'undefined') content.innerHTML = marked.parse(body);
        else content.textContent = body;

        loading2.style.display = 'none';
        wrapper.style.display = 'block';
      })
      .catch(function () { loading2.style.display = 'none'; errorEl.style.display = 'block'; });
  }

})();
