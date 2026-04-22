(function () {
  'use strict';

  const PAGE = document.body.getAttribute('data-page');
  console.log('[blog.js] PAGE =', PAGE);

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  }

  function renderCard(post) {
    const href = 'post.html?post=' + encodeURIComponent(post.slug || '');
    const img  = post.thumbnail ? '<div class="card-image-wrap"><img class="card-image" src="' + post.thumbnail + '" alt="' + escHtml(post.title) + '" width="600" height="338" loading="lazy"></div>' : '';
    return '<article class="blog-card">' + img + '<div class="body"><div class="meta">' + (post.category ? '<span>'+escHtml(post.category)+'</span>' : '') + (post.date ? '<span>'+formatDate(post.date)+'</span>' : '') + '</div><h3><a href="' + href + '">' + escHtml(post.title) + '</a></h3><p>' + escHtml(post.excerpt||'') + '</p><a class="link-arrow" href="' + href + '">Read Article <span class="arrow">&rarr;</span></a></div></article>';
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

  if (PAGE === 'blog') {
    console.log('[blog.js] Starting blog listing...');
    const loading = document.getElementById('blog-loading');
    const grid    = document.getElementById('blog-grid');
    const empty   = document.getElementById('blog-empty');
    const error   = document.getElementById('blog-error');

    console.log('[blog.js] Elements found:', !!loading, !!grid, !!empty, !!error);

    fetch('posts/index.json?v=' + Date.now())
      .then(function(r) {
        console.log('[blog.js] Fetch status:', r.status);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(posts) {
        console.log('[blog.js] Posts count:', posts.length);
        console.log('[blog.js] Posts data:', JSON.stringify(posts));
        loading.style.display = 'none';
        if (!posts || !posts.length) {
          empty.style.display = 'block';
          return;
        }
        posts.forEach(function(p) {
          var card = renderCard(p);
          console.log('[blog.js] Card HTML:', card.substring(0, 100));
          grid.insertAdjacentHTML('beforeend', card);
        });
        grid.removeAttribute('style');
        console.log('[blog.js] DONE. Grid visible. Children:', grid.children.length);
      })
      .catch(function(err) {
        console.error('[blog.js] FAILED:', err.message);
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = 'Error: ' + err.message;
      });

  } else if (PAGE === 'post') {
    var params  = new URLSearchParams(window.location.search);
    var slug    = params.get('post');
    var loading = document.getElementById('post-loading');
    var errorEl = document.getElementById('post-error');
    var wrapper = document.getElementById('post-wrapper');

    if (!slug) { loading.style.display='none'; errorEl.style.display='block'; return; }

    fetch('_posts/' + slug + '.md?v=' + Date.now())
      .then(function(r) { if (!r.ok) throw new Error('not found'); return r.text(); })
      .then(function(raw) {
        var result = parseFrontmatter(raw);
        var meta = result.meta;
        var body = result.body;
        document.getElementById('post-title-tag').textContent = (meta.title||'Post') + ' | Live Web Studios';
        document.getElementById('post-meta-desc').setAttribute('content', meta.excerpt||'');
        document.getElementById('post-heading').textContent = meta.title||'';
        document.getElementById('post-date-display').textContent = formatDate(meta.date);
        if (meta.category) document.getElementById('post-category').textContent = meta.category;
        if (meta.thumbnail) {
          var img = document.getElementById('post-hero-image');
          img.src = meta.thumbnail; img.alt = meta.title||''; img.style.display='block';
        }
        var content = document.getElementById('post-content');
        if (typeof marked !== 'undefined') {
          content.innerHTML = marked.parse(body);
        } else {
          content.textContent = body;
        }
        loading.style.display = 'none';
        wrapper.style.display = 'block';
      })
      .catch(function() { loading.style.display='none'; errorEl.style.display='block'; });
  }

})();
