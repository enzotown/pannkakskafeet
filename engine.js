// engine.js — yta, färg, ljud och geometri
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const DW = 1000, DH = 700;
let vw = DW, vh = DH, SC = 1, OX = 0, OY = 0, DPR = 1;

const C = {
  cream: '#fffaf3', brown: '#4a3f39', brown2: '#6b5d54',
  mint: '#7bcbb6', mintDark: '#4fae94', coral: '#ef8064', coralDark: '#c9553f',
  yellow: '#ffe08a', sand: '#f3ddb4', sandDark: '#e3c894', sandLight: '#fbeccd',
  wood: '#d9a35f', woodDark: '#a8722f', woodLight: '#efc386',
  iron: '#4b4a48', ironLight: '#737069', white: '#fffdf9',
  batter: '#f7e6bd', golden: '#d99a4e', goldenDark: '#b5752f'
};

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  vw = window.innerWidth; vh = window.innerHeight;
  cv.width = Math.floor(vw * DPR); cv.height = Math.floor(vh * DPR);
  SC = Math.min(vw / DW, vh / DH);
  OX = (vw - DW * SC) / 2; OY = (vh - DH * SC) / 2;
  ctx.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * OX, DPR * OY);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', function () { setTimeout(resize, 200); });

// ------------------------------------------------------------------ ljud
let actx = null, master = null, noiseBuf = null;
const MASTER_VOL = 0.85;
function audio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = actx.createDynamicsCompressor();
      comp.threshold.value = -8; comp.ratio.value = 6;
      master = actx.createGain(); master.gain.value = MASTER_VOL;
      master.connect(comp); comp.connect(actx.destination);
      const len = Math.floor(actx.sampleRate * 1.2);
      noiseBuf = actx.createBuffer(1, len, actx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) {}
  }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(f, dur, vol, type, slide, delay) {
  const a = audio(); if (!a) return;
  const t0 = a.currentTime + (delay || 0);
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master || a.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
function noiseHit(dur, freq, vol, delay, type) {
  const a = audio(); if (!a) return;
  const t0 = a.currentTime + (delay || 0);
  const s = a.createBufferSource(); s.buffer = noiseBuf;
  const f = a.createBiquadFilter(); f.type = type || 'bandpass';
  f.frequency.value = freq; f.Q.value = 0.8;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f); f.connect(g); g.connect(master || a.destination);
  s.start(t0); s.stop(t0 + dur + 0.05);
}
function sizzle() { noiseHit(0.55, 2400, 0.055); noiseHit(0.5, 3600, 0.03, 0.08); }
function plop() { tone(520, 0.09, 0.05, 'sine', 300); }
function chime() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.32, 0.07, 'triangle', null, i * 0.09); }); }
function starSound() { [784, 988, 1319].forEach(function (f, i) { tone(f, 0.22, 0.06, 'sine', null, i * 0.07); }); }
function chewSound() { tone(210, 0.09, 0.05, 'triangle', 120); noiseHit(0.08, 900, 0.02, 0.02); }
function cutSound() { noiseHit(0.16, 3200, 0.05, 0, 'highpass'); tone(920, 0.07, 0.04, 'square', 620); tone(700, 0.1, 0.035, 'triangle', 480, 0.08); }
function ojdSound() { tone(430, 0.16, 0.05, 'triangle', 300); tone(310, 0.26, 0.05, 'triangle', 210, 0.14); }
function takeSound() { tone(680, 0.07, 0.04, 'sine', 900); }

// ------------------------------------------------------------------ geometri
const PAN = { x: 204, y: 356, rx: 106, ry: 78 };
const STOVE = { x: 36, y: 300, w: 336, h: 262 };
const COUNTER = { x: 356, y: 478, w: 644, h: 42, front: 520, bottom: 604 };
const PLATE = { x: 706, y: 489, r: 64 };
const PLATE_A = { x: 618, y: 491, r: 56 };
const PLATE_B = { x: 802, y: 491, r: 56 };
const BENCH = { x: 452, y: 492, r: 50 };
const HELP = { x: 940, y: 56, r: 46 };
const COOK_TIME = 1.8;
const GUESTS_PER_ROUND = 5;
const GUEST_Y = 498;

function plateAt(x, y, p) { return Math.hypot((x - p.x) / 1.05, y - p.y) < p.r + 22; }
function inPan(x, y) { return Math.hypot((x - PAN.x) / 1.0, (y - PAN.y) / 0.78) < PAN.rx + 8; }
function inBench(x, y) { return plateAt(x, y, BENCH); }
function dist(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * clamp(t, 0, 1); }
function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }