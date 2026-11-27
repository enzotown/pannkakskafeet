// input.js — pek, släpp och knappträffar
function toDesign(e) {
  const r = cv.getBoundingClientRect();
  const t = e.touches && e.touches[0] ? e.touches[0] : e;
  const cx = (t.clientX - r.left) * (cv.width / DPR / r.width);
  const cy = (t.clientY - r.top) * (cv.height / DPR / r.height);
  return { x: (cx - OX) / SC, y: (cy - OY) / SC };
}

function modeHit(x, y) {
  if (scene === 'menu') {
    const by = 264, w = 320, h = 210;
    if (y < by || y > by + h) return null;
    if (x > 150 && x < 150 + w) return 'count';
    if (x > 530 && x < 530 + w) return 'share';
    return null;
  }
  if (roundT > 0) {
    const by = 390, w = 250, h = 120;
    if (y < by || y > by + h) return null;
    if (x > 230 && x < 480) return 'count';
    if (x > 520 && x < 770) return 'share';
  }
  return null;
}

function onDown(e) {
  e.preventDefault();
  audio();
  const p = toDesign(e);
  drag = null;

  if (showHelp) { showHelp = false; return; }
  if (scene === 'menu') {
    const m = modeHit(p.x, p.y);
    if (m) startRound(m);
    return;
  }
  if (roundT > 0) {
    const m = modeHit(p.x, p.y);
    if (m) startRound(m);
    return;
  }
  if (Math.hypot(p.x - HELP.x, p.y - HELP.y) < HELP.r + 10) { showHelp = true; plop(); return; }
  if (hintT > 0) hintT = 0;

  if (mode === 'share' && Math.hypot(p.x - 900, p.y - 612) < 64) {
    splitPan();
    return;
  }

  if (inPan(p.x, p.y)) {
    if (pan.st === 'raw') { panTap(); return; }
    if (panHasCake()) {
      drag = { from: 'pan', type: pan.st === 'halves' ? 'half' : 'cake', x: p.x, y: p.y, sx: p.x, sy: p.y };
      takeSound();
      return;
    }
    return;
  }
  if (inBench(p.x, p.y) && benchN > 0) {
    drag = { from: 'bench', type: 'cake', x: p.x, y: p.y, sx: p.x, sy: p.y };
    takeSound();
    return;
  }
  if (mode === 'count' && guests[0] && guests[0].plate.length > guests[0].want &&
      Math.hypot(p.x - PLATE_X, p.y - PLATE.y + 4) < 92) {
    drag = { from: 'plate', type: 'cake', x: p.x, y: p.y, sx: p.x, sy: p.y };
    takeSound();
  }
}

function onMove(e) {
  e.preventDefault();
  if (!drag) return;
  const p = toDesign(e);
  drag.x = p.x; drag.y = p.y;
}

function onUp(e) {
  e.preventDefault();
  if (!drag) return;
  const p = toDesign(e);
  drag.x = p.x; drag.y = p.y;
  const far = Math.hypot(p.x - drag.sx, p.y - drag.sy) > 14;

  if (mode === 'count') {
    if (Math.hypot(p.x - PLATE_X, p.y - PLATE.y + 4) < 92) {
      if (!far && drag.from === 'pan') { drag = null; return; }
      dropOnPlate(0);
    } else if (inBench(p.x, p.y)) {
      dropOnBench();
    }
  } else {
    const pr = activePair();
    if (pr && pr.state === 'serve') {
      if (Math.hypot(p.x - 618, p.y - PLATE_A.y) < 82) dropOnPlate(0);
      else if (Math.hypot(p.x - 802, p.y - PLATE_B.y) < 82) dropOnPlate(1);
      else if (inBench(p.x, p.y)) dropOnBench();
    }
  }
  drag = null;
}

cv.addEventListener('pointerdown', onDown);
cv.addEventListener('pointermove', onMove);
cv.addEventListener('pointerup', onUp);
cv.addEventListener('pointercancel', onUp);
cv.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });

// testkrok: låt en webbläsartest köra spelet utan fingrar
window.PK = {
  startRound: startRound,
  pan: function () { return pan; },
  state: function () {
    return { scene: scene, mode: mode, stars: stars, pan: pan, benchN: benchN,
      guests: guests, pairs: pairs, pairIdx: pairIdx, roundT: roundT, drag: drag };
  },
  cook: function () { panTap(); },
  step: function (dt) { update(dt); },
  split: function () { return splitPan(); },
  serve: function (gi, type, from) {
    drag = { from: from || 'pan', type: type || 'cake', x: 0, y: 0, sx: 0, sy: 0 };
    const ok = dropOnPlate(gi || 0);
    drag = null;
    return ok;
  },
  toBench: function (from) {
    drag = { from: from || 'pan', type: 'cake', x: 0, y: 0, sx: 0, sy: 0 };
    const ok = dropOnBench();
    drag = null;
    return ok;
  },
  ui: function () { return { SC: SC, OX: OX, OY: OY }; },
  pause: function (v) { paused = !!v; },
  setStars: function (n) { stars = n; }
};