// art2.js — djurgästerna och pratbubblorna
const ANIMALS = {
  kanin: { body: '#fffdf9', dark: '#e6d9c8', ear: '#f6b8b0', nose: '#ef8064', belly: '#fff6ea' },
  bjorn: { body: '#b58a5e', dark: '#966d45', ear: '#966d45', nose: '#4a3f39', belly: '#e0c39a' },
  igelkott: { body: '#c79a6b', dark: '#8a6440', ear: '#a97b50', nose: '#4a3f39', belly: '#f0dcc0' },
  groda: { body: '#7bcbb6', dark: '#4fae94', ear: '#7bcbb6', nose: '#3f8a5c', belly: '#d6f1e8' },
  katt: { body: '#f0c98a', dark: '#d9a35f', ear: '#ef8064', nose: '#c9553f', belly: '#fff0d4' }
};

function drawGuest(g, x, y, s, expr, phase) {
  const A = ANIMALS[g.kind] || ANIMALS.kanin;
  const bob = expr === 'walk' ? Math.abs(Math.sin(phase * 7)) * 5 : Math.sin(phase * 1.6 + g.ph) * 2;
  ctx.save();
  ctx.translate(x, y - bob); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(74,63,57,.16)';
  ell(0, 0, 54, 12); ctx.fill();

  // fötter
  ctx.fillStyle = A.dark;
  ell(-24, -8, 19, 10); ctx.fill();
  ell(24, -8, 19, 10); ctx.fill();

  // kropp
  ctx.fillStyle = A.body;
  ell(0, -62, 50, 58); ctx.fill();
  ctx.fillStyle = A.belly;
  ell(0, -52, 32, 40); ctx.fill();

  // armar
  ctx.strokeStyle = A.body; ctx.lineWidth = 15; ctx.lineCap = 'round';
  let la = -0.5, ra = 0.5, ly = -76, ry2 = -76;
  if (expr === 'point') { ra = 2.5; ry2 = -104; }
  if (expr === 'happy') { la = -2.3; ra = 2.3; ly = -96; ry2 = -96; }
  if (expr === 'chew') { ra = 1.9; ry2 = -110; }
  ctx.beginPath(); ctx.moveTo(-40, -74);
  ctx.lineTo(-40 - Math.cos(la) * 30, ly + Math.sin(la) * 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, -74);
  ctx.lineTo(40 - Math.cos(ra) * 30, ry2 + Math.sin(ra) * 30); ctx.stroke();

  // öron
  if (g.kind === 'kanin') {
    for (let i = -1; i <= 1; i += 2) {
      ctx.save(); ctx.translate(i * 20, -176); ctx.rotate(i * 0.16);
      ctx.fillStyle = A.body; ell(0, -26, 13, 38); ctx.fill();
      ctx.fillStyle = A.ear; ell(0, -26, 6, 27); ctx.fill();
      ctx.restore();
    }
  } else if (g.kind === 'bjorn') {
    ctx.fillStyle = A.dark;
    ell(-34, -172, 17, 16); ctx.fill();
    ell(34, -172, 17, 16); ctx.fill();
    ctx.fillStyle = '#d9b48c';
    ell(-34, -172, 8, 8); ctx.fill(); ell(34, -172, 8, 8); ctx.fill();
  } else if (g.kind === 'katt') {
    for (let i = -1; i <= 1; i += 2) {
      ctx.fillStyle = A.body;
      ctx.beginPath();
      ctx.moveTo(i * 14, -172); ctx.lineTo(i * 44, -206); ctx.lineTo(i * 46, -160);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = A.ear;
      ctx.beginPath();
      ctx.moveTo(i * 22, -172); ctx.lineTo(i * 38, -194); ctx.lineTo(i * 39, -166);
      ctx.closePath(); ctx.fill();
    }
  } else if (g.kind === 'igelkott') {
    ctx.fillStyle = A.dark;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI + i * Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 30, -166 + Math.sin(a) * 22);
      ctx.lineTo(Math.cos(a) * 62, -166 + Math.sin(a) * 54);
      ctx.lineTo(Math.cos(a + 0.34) * 30, -166 + Math.sin(a + 0.34) * 22);
      ctx.closePath(); ctx.fill();
    }
  }

  // huvud
  ctx.fillStyle = A.body;
  ell(0, -140, 46, 44); ctx.fill();
  if (g.kind === 'groda') {
    ctx.fillStyle = A.body;
    ell(-22, -180, 17, 16); ctx.fill();
    ell(22, -180, 17, 16); ctx.fill();
    ctx.fillStyle = '#fffdf9'; ell(-22, -182, 10, 10); ctx.fill(); ell(22, -182, 10, 10); ctx.fill();
    ctx.fillStyle = C.brown; ell(-22, -182, 5, 6); ctx.fill(); ell(22, -182, 5, 6); ctx.fill();
    expr = expr === 'walk' ? 'idle' : expr;
  } else {
    // ögon
    if (expr === 'happy' || expr === 'chew') {
      ctx.strokeStyle = C.brown; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-16, -146, 8, 3.5, 6.0); ctx.stroke();
      ctx.beginPath(); ctx.arc(16, -146, 8, 3.5, 6.0); ctx.stroke();
    } else {
      ctx.fillStyle = C.brown;
      ell(-16, -147, 6, 7); ctx.fill();
      ell(16, -147, 6, 7); ctx.fill();
      ctx.fillStyle = '#fffdf9';
      ctx.beginPath(); ctx.arc(-18, -150, 2.2, 0, 6.3); ctx.fill();
      ctx.beginPath(); ctx.arc(14, -150, 2.2, 0, 6.3); ctx.fill();
    }
  }

  // nos och mun
  ctx.fillStyle = A.belly;
  ell(0, -126, 26, 18); ctx.fill();
  ctx.fillStyle = A.nose;
  ell(0, -133, 8, 6); ctx.fill();
  ctx.strokeStyle = C.brown; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  if (expr === 'chew') {
    const o = 3 + Math.abs(Math.sin(phase * 12)) * 9;
    ctx.fillStyle = C.coralDark;
    ell(0, -117, 10, o); ctx.fill();
  } else if (expr === 'sad' || expr === 'point') {
    ctx.beginPath(); ctx.arc(0, -110, 10, 3.6, 6.0); ctx.stroke();
  } else if (expr === 'happy') {
    ctx.beginPath(); ctx.arc(0, -120, 15, 0.5, 2.6); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(0, -122, 11, 0.6, 2.5); ctx.stroke();
  }

  if (g.kind === 'katt') {
    ctx.strokeStyle = 'rgba(74,63,57,.45)'; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i += 2) {
      ctx.beginPath(); ctx.moveTo(i * 18, -128); ctx.lineTo(i * 50, -136); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * 18, -124); ctx.lineTo(i * 50, -120); ctx.stroke();
    }
  }
  // kindrosor
  ctx.fillStyle = 'rgba(239,128,100,.35)';
  ell(-31, -128, 8, 5); ctx.fill(); ell(31, -128, 8, 5); ctx.fill();
  ctx.restore();
}

// pratbubbla med siffra och prickar
function drawBubble(cx, y, num, dots, dotCol, pop, numCol) {
  const w = 214, h = 158, x = cx - w / 2;
  const sc = pop === undefined ? 1 : 0.6 + 0.4 * pop;
  ctx.save();
  ctx.translate(cx, y + h / 2); ctx.scale(sc, sc); ctx.translate(-cx, -(y + h / 2));
  ctx.fillStyle = 'rgba(74,63,57,.14)';
  rr(x + 4, y + 7, w, h, 26); ctx.fill();
  ctx.fillStyle = C.cream; rr(x, y, w, h, 26); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.18)'; ctx.lineWidth = 3; rr(x, y, w, h, 26); ctx.stroke();
  // svans
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(cx - 22, y + h - 4); ctx.lineTo(cx + 6, y + h + 30); ctx.lineTo(cx + 24, y + h - 4);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 22, y + h - 2); ctx.lineTo(cx + 24, y + h - 2);
  ctx.strokeStyle = 'rgba(74,63,57,.16)'; ctx.lineWidth = 3; ctx.stroke();

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = numCol || C.brown;
  ctx.font = 'bold 82px "Trebuchet MS", sans-serif';
  ctx.fillText(String(num), cx, y + 56);
  const n = dots.length === undefined ? dots : dots.length;
  const dr = n > 3 ? 12 : 16;
  const step = dr * (n > 3 ? 2.25 : 2.6);
  const startX = cx - (n - 1) * step / 2;
  for (let i = 0; i < n; i++) {
    const dx = startX + i * step;
    ctx.fillStyle = dotCol || C.coral;
    ctx.beginPath(); ctx.arc(dx, y + 118, dr, 0, 6.3); ctx.fill();
    ctx.strokeStyle = 'rgba(74,63,57,.16)'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
}

// bubbla för "dela lika": en pannkaka som två halvor
function drawHalfBubble(cx, y) {
  const w = 252, h = 152, x = cx - w / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.14)'; rr(x + 4, y + 7, w, h, 26); ctx.fill();
  ctx.fillStyle = C.cream; rr(x, y, w, h, 26); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.18)'; ctx.lineWidth = 3; rr(x, y, w, h, 26); ctx.stroke();
  ctx.fillStyle = C.cream;
  ctx.beginPath(); ctx.moveTo(cx - 20, y + h - 2); ctx.lineTo(cx + 4, y + h + 30); ctx.lineTo(cx + 22, y + h - 2); ctx.closePath(); ctx.fill();

  drawPancake(cx - 38, y + 84, 46, 1, 1, true);
  drawPancake(cx + 38, y + 84, 46, 1, 1, 'r');
  ctx.fillStyle = C.brown2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 26px "Trebuchet MS", sans-serif';
  ctx.fillText('½', cx, y + 30);
  ctx.restore();
}

function drawOjBubble(cx, y) {
  const w = 206, h = 128, x = cx - w / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.14)'; rr(x + 4, y + 7, w, h, 24); ctx.fill();
  ctx.fillStyle = C.cream; rr(x, y, w, h, 24); ctx.fill();
  ctx.strokeStyle = 'rgba(201,85,63,.5)'; ctx.lineWidth = 4; rr(x, y, w, h, 24); ctx.stroke();
  ctx.fillStyle = C.cream;
  ctx.beginPath(); ctx.moveTo(cx - 20, y + h - 2); ctx.lineTo(cx + 4, y + h + 30); ctx.lineTo(cx + 22, y + h - 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.coralDark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 42px "Trebuchet MS", sans-serif';
  ctx.fillText('Oj då!', cx, y + 50);
  ctx.strokeStyle = C.brown; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 14, y + 84); ctx.lineTo(cx - 14, y + 92); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 14, y + 84); ctx.lineTo(cx + 14, y + 92); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, y + 108, 11, 3.7, 5.7); ctx.stroke();
  ctx.restore();
}