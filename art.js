// art.js — rummet, spisen, pannan, pannkakor, tallrikar och HUD
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function ell(x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.3); }

function drawWall() {
  const g = ctx.createLinearGradient(0, 0, 0, 520);
  g.addColorStop(0, '#fffdf8'); g.addColorStop(1, C.cream);
  ctx.fillStyle = g; ctx.fillRect(0, 0, DW, DH);

  // mint-ränder på nedre väggen
  ctx.fillStyle = 'rgba(123,203,182,.16)';
  for (let x = 8; x < DW; x += 56) ctx.fillRect(x, 250, 26, 228);
  ctx.fillStyle = C.mint; ctx.fillRect(0, 236, DW, 12);
  ctx.fillStyle = 'rgba(79,174,148,.35)'; ctx.fillRect(0, 244, DW, 5);

  // golv
  const fg = ctx.createLinearGradient(0, 556, 0, DH);
  fg.addColorStop(0, C.woodLight); fg.addColorStop(1, C.wood);
  ctx.fillStyle = fg; ctx.fillRect(0, 556, DW, DH - 556);
  ctx.strokeStyle = 'rgba(168,114,47,.35)'; ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) {
    const y = 566 + i * 22;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(DW, y + 4); ctx.stroke();
  }
  for (let i = 0; i < 22; i++) {
    const x = (i * 173 + 40) % DW;
    ctx.beginPath(); ctx.moveTo(x, 560); ctx.lineTo(x - 16, DH); ctx.stroke();
  }

  // tak-list
  ctx.fillStyle = C.sand; ctx.fillRect(0, 0, DW, 26);
  ctx.fillStyle = 'rgba(74,63,57,.10)'; ctx.fillRect(0, 26, DW, 5);

  // fönster
  const wx = 452, wy = 74, ww = 150, wh = 138;
  ctx.fillStyle = 'rgba(74,63,57,.10)'; rr(wx + 6, wy + 8, ww, wh, 12); ctx.fill();
  ctx.fillStyle = C.mint; rr(wx - 9, wy - 9, ww + 18, wh + 18, 14); ctx.fill();
  ctx.fillStyle = '#d9f0e8'; rr(wx, wy, ww, wh, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,250,243,.85)';
  ctx.beginPath(); ctx.arc(wx + 44, wy + 40, 20, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 96, wy + 96, 30, 0, 6.3); ctx.fill();
  ctx.save(); ctx.beginPath(); rr(wx, wy, ww, wh, 8); ctx.clip();
  ctx.fillStyle = 'rgba(79,174,148,.35)';
  ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.quadraticCurveTo(wx + 60, wy + 68, wx + ww, wy + wh); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = C.cream; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
  ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(74,63,57,.18)'; ctx.lineWidth = 3;
  rr(wx, wy, ww, wh, 8); ctx.stroke();

  // hylla med burkar ovanför spisen
  ctx.fillStyle = C.woodDark; rr(56, 172, 250, 12, 6); ctx.fill();
  ctx.fillStyle = 'rgba(74,63,57,.16)'; rr(64, 184, 236, 8, 4); ctx.fill();
  const jars = [{ x: 84, h: 52, c: C.coral }, { x: 146, h: 42, c: C.mint }, { x: 206, h: 58, c: C.yellow }, { x: 262, h: 40, c: C.sandDark }];
  for (let i = 0; i < jars.length; i++) {
    const j = jars[i];
    ctx.fillStyle = 'rgba(255,255,255,.65)'; rr(j.x, 172 - j.h, 44, j.h, 8); ctx.fill();
    ctx.fillStyle = j.c; rr(j.x + 4, 176 - j.h, 36, j.h * 0.62, 6); ctx.fill();
    ctx.fillStyle = C.brown2; rr(j.x + 2, 172 - j.h - 8, 40, 10, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(74,63,57,.15)'; ctx.lineWidth = 2; rr(j.x, 172 - j.h, 44, j.h, 8); ctx.stroke();
  }
  // tavla med pannkaka
  ctx.fillStyle = C.wood; rr(770, 108, 92, 92, 10); ctx.fill();
  ctx.fillStyle = C.cream; rr(779, 117, 74, 74, 6); ctx.fill();
  ctx.fillStyle = C.golden; ell(816, 154, 25, 15); ctx.fill();
  ctx.fillStyle = C.yellow; ell(816, 150, 8, 5); ctx.fill();
}

function drawStove() {
  const s = STOVE;
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  rr(s.x + 8, s.y + 14, s.w, s.h, 22); ctx.fill();
  ctx.fillStyle = C.brown2;
  rr(s.x, s.y + 10, s.w, s.h, 20); ctx.fill();
  ctx.fillStyle = C.brown;
  rr(s.x + 10, s.y + 26, s.w - 20, s.h - 46, 14); ctx.fill();
  // häll
  ctx.fillStyle = C.iron;
  rr(s.x + 4, s.y, s.w - 8, 44, 12); ctx.fill();
  ctx.fillStyle = C.ironLight;
  rr(s.x + 16, s.y + 6, s.w - 32, 8, 4); ctx.fill();
  // ugnslucka
  ctx.fillStyle = '#3b3430'; rr(s.x + 42, s.y + 132, s.w - 84, 96, 12); ctx.fill();
  ctx.fillStyle = 'rgba(255,224,138,.22)'; rr(s.x + 54, s.y + 144, s.w - 108, 40, 8); ctx.fill();
  ctx.fillStyle = C.yellow; rr(s.x + 100, s.y + 208, s.w - 200, 9, 4); ctx.fill();
  // rattar
  for (let i = 0; i < 2; i++) {
    ctx.fillStyle = C.coral;
    ctx.beginPath(); ctx.arc(s.x + 70 + i * 56, s.y + 86, 15, 0, 6.3); ctx.fill();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(s.x + 70 + i * 56, s.y + 86, 5, 0, 6.3); ctx.fill();
  }
  // ben
  ctx.fillStyle = C.brown;
  rr(s.x + 20, s.y + s.h - 6, 18, 34, 6); ctx.fill();
  rr(s.x + s.w - 38, s.y + s.h - 6, 18, 34, 6); ctx.fill();
}

function drawPan(steam) {
  // handtag
  ctx.strokeStyle = C.iron; ctx.lineCap = 'round';
  ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(PAN.x - 92, PAN.y - 16); ctx.lineTo(PAN.x - 154, PAN.y - 38); ctx.stroke();
  ctx.strokeStyle = C.ironLight; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(PAN.x - 96, PAN.y - 26); ctx.lineTo(PAN.x - 150, PAN.y - 46); ctx.stroke();
  ctx.fillStyle = '#2f2c2a'; ell(PAN.x - 162, PAN.y - 42, 17, 13); ctx.fill();
  // panna
  ctx.fillStyle = 'rgba(74,63,57,.28)'; ell(PAN.x + 4, PAN.y + 10, PAN.rx + 6, PAN.ry + 4); ctx.fill();
  ctx.fillStyle = C.iron; ell(PAN.x, PAN.y, PAN.rx, PAN.ry); ctx.fill();
  ctx.strokeStyle = '#2f2c2a'; ctx.lineWidth = 5; ell(PAN.x, PAN.y, PAN.rx, PAN.ry); ctx.stroke();
  ctx.fillStyle = '#3a3735'; ell(PAN.x, PAN.y + 3, PAN.rx - 14, PAN.ry - 12); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(PAN.x, PAN.y - 2, PAN.rx - 10, PAN.ry - 9, 0, 3.4, 4.4); ctx.stroke();
  if (steam) drawSteam(PAN.x, PAN.y - 40);
}

function drawSteam(x, y) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) {
    const o = Math.sin(time * 2.2 + i) * 9;
    ctx.beginPath(); ctx.moveTo(x + i * 34, y);
    ctx.quadraticCurveTo(x + i * 34 + o, y - 26, x + i * 34 - o, y - 52); ctx.stroke();
  }
  ctx.restore();
}

// doneness 0..1, golden when ready
function pancakeColor(d) {
  const t = clamp(d, 0, 1);
  const a = [247, 230, 189], b = [217, 154, 78];
  return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')';
}
function drawPancake(x, y, r, d, al, half) {
  const ry = r * 0.62;
  ctx.save();
  ctx.globalAlpha = al === undefined ? 1 : al;
  if (half) {
    ctx.beginPath();
    if (half === 'r') ctx.rect(x, y - ry - 6, r + 6, ry * 2 + 12);
    else ctx.rect(x - r - 6, y - ry - 6, r + 6, ry * 2 + 12);
    ctx.clip();
  }
  ctx.fillStyle = 'rgba(74,63,57,.16)'; ell(x + 2, y + 5, r, ry); ctx.fill();
  ctx.fillStyle = pancakeColor(d); ell(x, y, r, ry); ctx.fill();
  ctx.strokeStyle = d > 0.8 ? C.goldenDark : 'rgba(180,140,80,.55)';
  ctx.lineWidth = 3; ell(x, y, r, ry); ctx.stroke();
  // stekfläckar
  ctx.fillStyle = 'rgba(160,105,50,' + (0.10 + 0.28 * d) + ')';
  const spots = [[-0.4, -0.1, 0.10], [0.28, 0.16, 0.08], [0.06, -0.3, 0.07], [-0.16, 0.28, 0.06], [0.5, -0.18, 0.05]];
  for (let i = 0; i < spots.length; i++) {
    const s = spots[i];
    ell(x + s[0] * r, y + s[1] * r, r * s[2], r * s[2] * 0.6); ctx.fill();
  }
  if (d > 0.93) {
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(x - r * 0.16, y - ry * 0.26, r * 0.42, ry * 0.26, -0.3, 3.5, 4.8); ctx.stroke();
  }
  ctx.restore();
}

function drawPlate(p, label) {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.16)'; ell(p.x + 3, p.y + 7, p.r + 4, (p.r + 4) * 0.5); ctx.fill();
  ctx.fillStyle = C.white; ell(p.x, p.y, p.r, p.r * 0.5); ctx.fill();
  ctx.strokeStyle = C.mint; ctx.lineWidth = 6; ell(p.x, p.y, p.r, p.r * 0.5); ctx.stroke();
  ctx.strokeStyle = 'rgba(123,203,182,.45)'; ctx.lineWidth = 2; ell(p.x, p.y, p.r - 12, (p.r - 12) * 0.5); ctx.stroke();
  ctx.restore();
}

function plateStack(p, arr, r) {
  const n = arr.length !== undefined ? arr.length : arr;
  for (let i = 0; i < n; i++) {
    const off = (i % 2 ? 1 : -1) * (i * 2.2);
    const b = arr[i] && arr[i].b ? arr[i].b : 0;
    drawPancake(p.x + off, p.y - 8 - i * 9 + b * 2, r * (1 - b * 0.17), 1, 1);
  }
}

function drawStar(cx, cy, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const rad = i % 2 ? r * 0.46 : r;
    ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = fill || C.yellow; ctx.fill();
  ctx.strokeStyle = 'rgba(168,114,47,.55)'; ctx.lineWidth = 2.5; ctx.stroke();
}

function drawHUD() {
  for (let i = 0; i < stars; i++) {
    const a = starAnim[i] || 1;
    ctx.save();
    ctx.globalAlpha = a; ctx.translate(0, Math.sin(time * 3 + i) * 2.5);
    drawStar(HELP.x - 268 + i * 36, HELP.y, 17);
    ctx.restore();
  }
  ctx.fillStyle = C.cream;
  ctx.beginPath(); ctx.arc(HELP.x, HELP.y, HELP.r, 0, 6.3); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.22)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = C.brown2;
  ctx.font = 'bold 52px "Trebuchet MS", sans-serif';
  ctx.fillText('?', HELP.x, HELP.y + 3);
}