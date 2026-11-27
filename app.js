// app.js — tillstånd, gäster, pannkakan och serveringen
/* Skolappars kodsnutt: säger till katalogen när en omgång är klar (inga id:n, inga cookies) */
function skolKlar(pct) {
  try { if (window.skolappar && skolappar.event) skolappar.event('round_done', Math.max(0, Math.min(100, Math.round(pct)))); } catch (e) {}
}

const KINDS = ['kanin', 'bjorn', 'igelkott', 'groda', 'katt'];
const COUNT_WANTS = [2, 1, 3, 2, 5];
const ACTIVE_X = 706, PLATE_X = 706;

let scene = 'menu';        // menu | play
let mode = 'count';        // count | share
let time = 0;
let guests = [], pairs = [], pairIdx = 0;
let pan = { st: 'raw', t: 0, emptyT: 0, halves: 0 };  // raw -> cook -> ready -> empty
let benchN = 0;
let stars = 0, starAnim = {}, starFly = null;
let roundT = 0, parts = [], confettiT = 0;
let drag = null, showHelp = false, wasDragged = false;
let hintT = 0, hintKind = '';

function makeGuest(kind, want, x, idx) {
  return {
    kind: kind, want: want, x: x, tx: x, sc: 0.55, plate: [], half: 0,
    state: 'enter', timer: 0, eat: 0, ph: (idx * 1.7) % 6, pop: 0, idx: idx
  };
}

function startRound(m) {
  mode = m; scene = 'play'; stars = 0; starAnim = {}; starFly = null;
  roundT = 0; parts = []; benchN = 0; drag = null; showHelp = false; hintT = 0;
  pan = { st: 'raw', t: 0, emptyT: 0, halves: 0 };
  guests = []; pairs = []; pairIdx = 0;
  if (m === 'count') {
    for (let i = 0; i < 5; i++) guests.push(makeGuest(KINDS[i % 5], COUNT_WANTS[i], 1120 + i * 40, i));
    guests[0].state = 'enter';
  } else {
    for (let p = 0; p < 3; p++) {
      const a = makeGuest(KINDS[(p * 2) % 5], 1, 1120, p * 2);
      const b = makeGuest(KINDS[(p * 2 + 1) % 5], 1, 1160, p * 2 + 1);
      pairs.push({ a: a, b: b, state: 'enter', timer: 0 });
    }
  }
  plop();
}

function activeGuest() { return mode === 'count' ? guests[0] : null; }
function activePair() { return mode === 'share' ? pairs[pairIdx] : null; }

// ---------------------------------------------------------- pannkakan
function panTap() {
  if (pan.st === 'raw') {
    pan.st = 'cook'; pan.t = 0; sizzle();
  } else if (pan.st === 'ready') {
    takeSound();
  }
}
function stepPan(dt) {
  if (pan.st === 'cook') {
    pan.t += dt;
    if (pan.t >= COOK_TIME) {
      pan.st = 'ready'; pan.t = 1;
      tone(880, 0.1, 0.05, 'sine', 1180); tone(1320, 0.14, 0.04, 'sine', 1500, 0.07);
      for (let i = 0; i < 8; i++) sparkle(PAN.x + (Math.random() - 0.5) * 120, PAN.y - 30, C.yellow);
    }
  } else if (pan.st === 'empty') {
    pan.emptyT -= dt;
    if (pan.emptyT <= 0) { pan.st = 'raw'; pan.t = 0; pan.halves = 0; }
  }
}
function panHasCake() { return pan.st === 'ready' || pan.st === 'halves'; }

function takeFromPan() {
  if (pan.st === 'halves') {
    pan.halves--;
    if (pan.halves <= 0) { pan.st = 'empty'; pan.emptyT = 0.7; }
    return true;
  }
  if (pan.st === 'ready') { pan.st = 'empty'; pan.emptyT = 0.7; return true; }
  return false;
}
function splitPan() {
  if (pan.st !== 'ready' || mode !== 'share') return false;
  pan.st = 'halves'; pan.halves = 2;
  cutSound();
  for (let i = 0; i < 6; i++) sparkle(PAN.x + (Math.random() - 0.5) * 90, PAN.y - 10, C.sandLight);
  return true;
}

// ---------------------------------------------------------- gäster
function guestScale(i) { return i === 0 ? 1 : i === 1 ? 0.66 : i === 2 ? 0.56 : 0.52; }

function stepGuests(dt) {
  if (mode === 'count') {
    for (let i = guests.length - 1; i >= 0; i--) {
      const g = guests[i];
      if (g.state !== 'leave') {
        g.tx = i === 0 ? ACTIVE_X : i === 1 ? 884 : i === 2 ? 954 : 1120;
      }
      g.sc = lerp(g.sc, guestScale(i), Math.min(1, dt * 3.5));
      if (Math.abs(g.x - g.tx) > 2) g.x = lerp(g.x, g.tx, Math.min(1, dt * 3.2));
      if (g.pop > 0) g.pop = Math.max(0, g.pop - dt * 4);
    }
    if (guests[0]) stepActive(guests[0], dt);
  } else {
    const pr = activePair();
    if (!pr) return;
    const pos = [618, 802];
    [pr.a, pr.b].forEach(function (g, i) {
      if (g.state !== 'leave') g.tx = (pr.state === 'enter' || pr.state === 'serve') ? pos[i] : (pr.state === 'leave' ? 1130 : pos[i]);
      if (Math.abs(g.x - g.tx) > 2) g.x = lerp(g.x, g.tx, Math.min(1, dt * 3));
      if (g.pop > 0) g.pop = Math.max(0, g.pop - dt * 4);
    });
    stepPair(pr, dt);
  }
}

function stepActive(g, dt) {
  if (g.state === 'enter') {
    g.sc = lerp(g.sc, 1, Math.min(1, dt * 3));
    if (Math.abs(g.x - ACTIVE_X) < 6) { g.state = 'serve'; g.pop = 1; plop(); }
  } else if (g.state === 'check') {
    g.timer -= dt;
    if (g.timer <= 0) {
      if (g.plate.length === g.want) { g.state = 'happy'; g.timer = 0.55; chime(); }
      else { g.state = 'serve'; }
    }
  } else if (g.state === 'happy') {
    g.timer -= dt;
    if (g.timer <= 0) { g.state = 'eat'; g.eat = 0.3; }
  } else if (g.state === 'eat') {
    g.eat -= dt;
    if (g.eat <= 0) {
      if (g.plate.length) {
        const top = g.plate[g.plate.length - 1];
        top.b = (top.b || 0) + 1;
        chewSound(); g.eat = 0.36;
        sparkle(g.x, 470, C.sandLight);
        if (top.b >= 3) { g.plate.pop(); g.eat = 0.42; }
      } else {
        giveStar(710, 300);
        g.state = 'leave'; g.tx = 1130; g.timer = 0.2;
      }
    }
  } else if (g.state === 'leave') {
    if (g.x > 1110) {
      guests.shift();
      if (guests.length) { guests[0].state = 'enter'; }
      if (stars >= 5 && roundT <= 0) { roundT = 0.01; confetti(); }
    }
  } else if (g.state === 'few' || g.state === 'oj') {
    g.timer -= dt;
    if (g.timer <= 0) { g.state = 'serve'; g.pop = 1; }
  }
}

function stepPair(pr, dt) {
  if (pr.state === 'enter') {
    pr.a.sc = lerp(pr.a.sc, 1, Math.min(1, dt * 3)); pr.b.sc = pr.a.sc;
    if (Math.abs(pr.a.x - 618) < 6 && Math.abs(pr.b.x - 802) < 6) { pr.state = 'serve'; plop(); }
  } else if (pr.state === 'serve') {
    if (pr.a.half && pr.b.half) {
      pr.state = 'happy'; pr.timer = 0.7; chime();
      pr.a.pop = 1; pr.b.pop = 1;
    }
  } else if (pr.state === 'happy') {
    pr.timer -= dt;
    if (pr.timer <= 0) {
      pr.state = 'eat'; pr.a.eat = 0.35; pr.b.eat = 0.35;
    }
  } else if (pr.state === 'eat') {
    [pr.a, pr.b].forEach(function (g) {
      g.eat -= dt;
      if (g.eat <= 0 && g.half) {
        g.halfBite = (g.halfBite || 0) + 1;
        chewSound(); g.eat = 0.36;
        if (g.halfBite >= 3) g.half = 0;
      }
    });
    if (!pr.a.half && !pr.b.half) {
      giveStar(710, 300);
      pr.state = 'leave'; pr.timer = 1.1;
      pr.a.state = 'leave'; pr.b.state = 'leave';
      pr.a.tx = 1130; pr.b.tx = 1130;
    }
  } else if (pr.state === 'leave') {
    pr.timer -= dt;
    if (pr.timer <= 0) {
      pairIdx++;
      if (pairIdx < pairs.length) {
        pan = { st: 'raw', t: 0, emptyT: 0, halves: 0 };
      } else if (roundT <= 0) { roundT = 0.01; confetti(); }
    }
  }
}

// ---------------------------------------------------------- servering
function countServe(g) {
  const n = g.plate.length;
  if (n === g.want) { g.state = 'check'; g.timer = 0.9; g.pop = 1; tone(700, 0.08, 0.04, 'sine', 900); }
  else if (n > g.want) { g.state = 'oj'; g.timer = 2.2; ojdSound(); hintT = 1.4; hintKind = 'bench'; }
  else if (n > 0) { g.state = 'few'; g.timer = 1.8; tone(420, 0.12, 0.04, 'triangle', 360); }
}

function dropOnPlate(gi) {
  if (mode === 'count') {
    const g = guests[0];
    if (!g || (g.state !== 'serve' && g.state !== 'check' && g.state !== 'few')) return false;
    if (!drag) return false;
    if (drag.from === 'plate') return false;
    if (drag.type === 'half') return false;
    if (drag.from === 'pan' && !panHasCake()) return false;
    if (drag.from === 'bench' && benchN < 1) return false;
    if (g.plate.length >= 6) return false;
    g.plate.push({ b: 0 }); takeSource(); plop();
    countServe(g);
    return true;
  }
  const pr = activePair();
  if (!pr || pr.state !== 'serve' || !drag) return false;
  const g = gi === 0 ? pr.a : pr.b;
  if (g.half) return false;
  if (drag.type === 'half') {
    g.half = 1; g.halfBite = 0; takeSource(); plop(); g.pop = 1;
    if (pr.a.half && pr.b.half) { pr.state = 'happy'; pr.timer = 0.7; chime(); pr.a.pop = 1; pr.b.pop = 1; }
    return true;
  }
  return false;
}

function takeSource() {
  if (drag.from === 'pan') takeFromPan();
  else if (drag.from === 'bench') benchN = Math.max(0, benchN - 1);
  else if (drag.from === 'plate') {
    const g = guests[0];
    if (g && g.plate.length) g.plate.pop();
  }
  drag.used = true;
}

function dropOnBench() {
  if (!drag) return false;
  if (drag.type === 'half') return false;
  if (drag.from === 'plate') {
    const g = guests[0];
    if (!g || !g.plate.length) return false;
    g.plate.pop(); benchN++; plop();
    if (g.plate.length === g.want) { g.state = 'happy'; g.timer = 0.6; chime(); }
    else if (g.plate.length < g.want && g.plate.length > 0) { g.state = 'few'; g.timer = 1.6; }
    return true;
  }
  if (drag.from === 'pan') {
    if (!panHasCake()) return false;
    if (pan.st === 'halves') { pan.halves = Math.max(1, pan.halves - 1); }
    else { takeFromPan(); }
    benchN++; plop();
    return true;
  }
  return false;
}

// ---------------------------------------------------------- belöning
function giveStar(x, y) {
  stars++;
  skolKlar(stars * 20); starAnim[stars - 1] = 0;
  starFly = { x0: x, y0: y, t: 0, n: stars };
  starSound();
  for (let i = 0; i < 14; i++) sparkle(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 60, [C.yellow, C.coral, C.mint][i % 3]);
}

function sparkle(x, y, col) {
  parts.push({
    x: x, y: y, vx: (Math.random() - 0.5) * 170, vy: -Math.random() * 180 - 30,
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 8,
    life: 0.5 + Math.random() * 0.5, max: 1, sz: 5 + Math.random() * 7,
    col: col || C.yellow, shape: 'dot'
  });
}

function confetti() {
  confettiT = 2.6;
  for (let i = 0; i < 90; i++) {
    parts.push({
      x: Math.random() * DW, y: -30 - Math.random() * 260,
      vx: (Math.random() - 0.5) * 150, vy: 80 + Math.random() * 190,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 9,
      life: 3.6, max: 3.6, sz: 8 + Math.random() * 10,
      col: [C.mint, C.coral, C.yellow, C.mintDark, C.cream][i % 5], shape: 'rect'
    });
  }
  chime();
}