(function () {
  /* Retry until the canvas exists — nav.js may inject it after defer fires */
  function start() {
    var canvas = document.getElementById('circuitCanvas');
    if (!canvas) { setTimeout(start, 60); return; }
    run(canvas);
  }

  function run(canvas) {
  var ctx = canvas.getContext('2d');

  /* ── CONFIG ── */
  var GRID        = 28;
  var PULSE_COUNT = 22;
  var BG_COLOR    = '#0d1117';
  var TRACE_COLOR = 'rgba(45,106,159,0.16)';
  var DOT_COLOR   = 'rgba(91,164,207,0.07)';
  var PULSE_COLOR = '#5BA4CF';
  var TRAIL_LEN   = 8;

  var W, H, animId;
  var nodes  = [];
  var edges  = [];
  var pulses = [];

  function resize() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = Math.round(W * devicePixelRatio);
    canvas.height = Math.round(H * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    buildGrid();
  }

  function buildGrid() {
    nodes  = [];
    edges  = [];
    pulses = [];

    var cols = Math.floor(W / GRID);
    var rows = Math.floor(H / GRID);
    var offX = (W - cols * GRID) / 2;
    var offY = (H - rows * GRID) / 2;

    for (var r = 0; r <= rows; r++) {
      for (var c = 0; c <= cols; c++) {
        nodes.push({ x: offX + c * GRID, y: offY + r * GRID, active: Math.random() < 0.62 });
      }
    }

    var cols1 = cols + 1;
    for (var r2 = 0; r2 <= rows; r2++) {
      for (var c2 = 0; c2 <= cols; c2++) {
        var idx = r2 * cols1 + c2;
        if (!nodes[idx] || !nodes[idx].active) continue;
        if (c2 < cols) {
          var nIdx = r2 * cols1 + (c2 + 1);
          if (nodes[nIdx] && nodes[nIdx].active && Math.random() < 0.5) edges.push({ from: idx, to: nIdx });
        }
        if (r2 < rows) {
          var nIdx2 = (r2 + 1) * cols1 + c2;
          if (nodes[nIdx2] && nodes[nIdx2].active && Math.random() < 0.5) edges.push({ from: idx, to: nIdx2 });
        }
      }
    }

    for (var i = 0; i < PULSE_COUNT; i++) spawnPulse();
  }

  function spawnPulse() {
    if (!edges.length) return;
    pulses.push({
      edgeIdx : Math.floor(Math.random() * edges.length),
      t       : Math.random(),
      speed   : 0.002 + Math.random() * 0.004,
      size    : 2.5   + Math.random() * 2,
      alpha   : 0.7   + Math.random() * 0.3,
      trail   : []
    });
  }

  function advancePulse(p) {
    p.t += p.speed;
    if (p.t < 1) return;
    var e   = edges[p.edgeIdx];
    var fwd = edges.filter(function (ex) { return ex.from === e.to; });
    if (fwd.length) {
      var next  = fwd[Math.floor(Math.random() * fwd.length)];
      p.edgeIdx = edges.indexOf(next);
      p.t       = 0;
      p.speed   = 0.002 + Math.random() * 0.004;
    } else {
      p.edgeIdx = Math.floor(Math.random() * edges.length);
      p.t       = 0;
      p.trail   = [];
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = TRACE_COLOR;
    ctx.lineWidth   = 1;
    edges.forEach(function (e) {
      var a = nodes[e.from], b = nodes[e.to];
      if (!a || !b) return;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });

    /* Pulses render as glowing LINE streaks travelling the traces — no dots. */
    ctx.lineCap = 'round';
    pulses.forEach(function (p) {
      var e = edges[p.edgeIdx];
      if (!e) { p.edgeIdx = Math.floor(Math.random() * edges.length); return; }
      var a = nodes[e.from], b = nodes[e.to];
      if (!a || !b) return;

      var px = a.x + (b.x - a.x) * p.t;
      var py = a.y + (b.y - a.y) * p.t;

      p.trail.unshift({ x: px, y: py });
      if (p.trail.length > TRAIL_LEN) p.trail.length = TRAIL_LEN;

      for (var i = 1; i < p.trail.length; i++) {
        var fa = ((TRAIL_LEN - i) / TRAIL_LEN) * p.alpha;
        ctx.beginPath();
        ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.strokeStyle = 'rgba(91,164,207,' + fa + ')';
        ctx.lineWidth   = p.size * (1 - i / TRAIL_LEN) + 0.4;
        ctx.stroke();
      }

      advancePulse(p);
    });
    ctx.lineWidth = 1;

    while (pulses.length < PULSE_COUNT) spawnPulse();

    var vGrad = ctx.createLinearGradient(0, 0, 0, H);
    vGrad.addColorStop(0,    'rgba(13,17,23,0.82)');
    vGrad.addColorStop(0.18, 'rgba(13,17,23,0)');
    vGrad.addColorStop(0.82, 'rgba(13,17,23,0)');
    vGrad.addColorStop(1,    'rgba(13,17,23,0.82)');
    ctx.fillStyle = vGrad; ctx.fillRect(0, 0, W, H);

    var hGrad = ctx.createLinearGradient(0, 0, W, 0);
    hGrad.addColorStop(0,    'rgba(13,17,23,0.65)');
    hGrad.addColorStop(0.12, 'rgba(13,17,23,0)');
    hGrad.addColorStop(0.88, 'rgba(13,17,23,0)');
    hGrad.addColorStop(1,    'rgba(13,17,23,0.65)');
    ctx.fillStyle = hGrad; ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(draw);
  }

  var ro = new ResizeObserver(function () {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });
  ro.observe(canvas.parentElement);

  resize();
  draw();
  } /* end run() */

  /* Start on DOMContentLoaded or immediately if already loaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
