// loop.js — uppdatering, scenritning och spelvarv
const menuG = { kind: 'kanin', ph: 0 };

function update(dt) {
  time += dt;
  if (starFly) { starFly.t += dt * 1.15; if (starFly.t >= 1) starFly = null; }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.vy += (p.shape === 'rect' ? 260 : 620) * dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    p.life -= dt;
    if (p.life <= 0 || p.y > DH + 60) parts.splice(i, 1);
  }
  if (hintT > 0) hintT -= dt;
  if (confettiT > 0) confettiT -= dt;
  if (roundT > 0 && scene === 'play') roundT += dt;
  if (scene !== 'play') return;
  stepPan(dt);
  stepGuests(dt);
}

function exprOf(g) {
  if (g.state === 'happy') return 'happy';
  if (g.state === 'eat') return 'chew';
  if (g.state === 'few') return 'point';
  if (g.state === 'oj') return 'sad';
  if (g.state === 'leave') return 'walk';
  return 'idle';
}

function drawGuests() {
  if (mode === 'count') {
    for (let i = guests.length - 1; i >= 1; i--) {
      drawGuest(guests[i], guests[i].x, GUEST_Y, guests[i].sc, 'idle', time);
    }
    if (guests[0]) drawGuest(guests[0], guests[0].x, GUEST_Y, guests[0].sc, exprOf(guests[0]), time);
  } else {
    const pr = activePair(); if (!pr) return;
    drawGuest(pr.a, pr.a.x, GUEST_Y, 1, exprOf(pr.a), time);
    drawGuest(pr.b, pr.b.x, GUEST_Y, 1, exprOf(pr.b), time);
  }
}

function drawCounter() {
  const x = COUNTER.x, y = COUNTER.y, w = COUNTER.w;
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  rr(x + 6, y + 10, w, COUNTER.bottom - y, 18); ctx.fill();
  // skiva
  const g = ctx.createLinearGradient(0, y, 0, y + COUNTER.h);
  g.addColorStop(0, C.sandLight); g.addColorStop(1, C.sand);
  ctx.fillStyle = g; rr(x, y, w, COUNTER.h, 12); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.55)'; rr(x + 8, y + 5, w - 16, 7, 4); ctx.fill();
  // front
  ctx.fillStyle = C.wood; rr(x, y + 38, w, COUNTER.bottom - y - 38, 10); ctx.fill();
  ctx.fillStyle = 'rgba(168,114,47,.30)';
  for (let i = 0; i < 5; i++) ctx.fillRect(x + 26 + i * 122, y + 56, 96, 34);
  ctx.fillStyle = C.coral; ctx.fillRect(x, y + 38, w, 7);
  ctx.fillStyle = 'rgba(74,63,57,.10)'; ctx.fillRect(x, COUNTER.bottom - 8, w, 8);
}

function drawPanCake() {
  if (pan.st === 'empty') return;
  const d = pan.st === 'cook' ? pan.t / COOK_TIME : pan.st === 'raw' ? 0.02 : 1;
  if (pan.st === 'halves') {
    drawPancake(PAN.x - 20, PAN.y + 6, 78, 1, 1, true);
    drawPancake(PAN.x + 20, PAN.y + 6, 78, 1, 1, 'r');
    ctx.strokeStyle = 'rgba(74,63,57,.35)'; ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(PAN.x, PAN.y - 44); ctx.lineTo(PAN.x, PAN.y + 56); ctx.stroke();
    ctx.setLineDash([]);
  } else {
    drawPancake(PAN.x, PAN.y + 6, 84, d);
  }
  if (pan.st === 'cook') {
    const p = clamp(pan.t / COOK_TIME, 0, 1);
    ctx.strokeStyle = 'rgba(255,224,138,.95)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(PAN.x, PAN.y, PAN.rx - 4, -Math.PI / 2, -Math.PI / 2 + p * 6.283); ctx.stroke();
    drawSteam(PAN.x, PAN.y - 56);
  }
  if (pan.st === 'ready') {
    const pu = 0.5 + 0.5 * Math.sin(time * 5);
    ctx.strokeStyle = 'rgba(255,224,138,' + (0.5 + 0.45 * pu) + ')';
    ctx.lineWidth = 8; ell(PAN.x, PAN.y + 4, 92 + pu * 6, 58 + pu * 4); ctx.stroke();
    drawHand(PAN.x + 100, PAN.y - 56 + Math.sin(time * 4) * 6, 1);
  }
}

function drawServing() {
  const g = guests[0];
  if (mode === 'count') {
    drawPlate(PLATE);
    if (g && g.plate.length) plateStack(PLATE, g.plate, 46);
    if (g && g.plate.length > g.want) {
      ctx.strokeStyle = 'rgba(201,85,63,' + (0.5 + 0.3 * Math.sin(time * 6)) + ')';
      ctx.lineWidth = 5; ell(PLATE.x, PLATE.y, PLATE.r + 12, (PLATE.r + 12) * 0.5); ctx.stroke();
    }
    drawBench();
  } else {
    const pr = activePair(); if (!pr) return;
    drawPlate(PLATE_A); drawPlate(PLATE_B);
    if (pr.a.half) drawPancake(618, PLATE_A.y - 10, 44 * (1 - (pr.a.halfBite || 0) * 0.17), 1, 1, true);
    if (pr.b.half) drawPancake(802, PLATE_B.y - 10, 44 * (1 - (pr.b.halfBite || 0) * 0.17), 1, 1, 'r');
    drawBench();
  }
}

function drawBench() {
  const x = BENCH.x, y = BENCH.y;
  ctx.fillStyle = 'rgba(74,63,57,.16)'; rr(x - 62, y - 18, 128, 46, 14); ctx.fill();
  ctx.fillStyle = C.wood; rr(x - 64, y - 26, 128, 46, 14); ctx.fill();
  ctx.strokeStyle = C.woodDark; ctx.lineWidth = 4; rr(x - 64, y - 26, 128, 46, 14); ctx.stroke();
  ctx.fillStyle = C.woodLight; rr(x - 56, y - 20, 112, 26, 9); ctx.fill();
  ctx.strokeStyle = 'rgba(168,114,47,.45)'; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(x - 44 + i * 26, y - 22); ctx.lineTo(x - 44 + i * 26, y + 12); ctx.stroke();
  }
  ctx.fillStyle = C.brown2; ctx.beginPath(); ctx.arc(x + 54, y + 2, 5, 0, 6.3); ctx.fill();
  for (let i = 0; i < benchN; i++) {
    drawPancake(x + (i % 2 ? 4 : -4), y - 20 - i * 10, 40, 1);
  }
}

function drawDrag() {
  const x = drag.x, y = drag.y;
  if (drag.type === 'half') drawPancake(x, y, 58, 1, 0.95, 'l');
  else drawPancake(x, y, 60, 1, 0.96);
  ctx.strokeStyle = 'rgba(74,63,57,.18)'; ctx.lineWidth = 2;
  ell(x, y + 8, 52, 30); ctx.stroke();
}

function drawBubbles() {
  if (mode === 'count') {
    const g = guests[0]; if (!g) return;
    if (g.state === 'serve') drawBubble(g.x, 108, g.want, g.want, C.coral, g.pop);
    else if (g.state === 'check') drawBubble(g.x, 108, g.want, g.want, C.mint, g.pop);
    else if (g.state === 'few') {
      const miss = g.want - g.plate.length;
      if (miss > 0) drawBubble(g.x, 108, miss, miss, '#c3b8ad', 1, '#a89c92');
    } else if (g.state === 'oj') drawOjBubble(g.x, 108);
  } else {
    const pr = activePair(); if (!pr) return;
    if (pr.state === 'serve' || pr.state === 'enter') drawHalfBubble(710, 96);
  }
  if (hintT > 0 && hintKind === 'bench') {
    const a = 0.45 + 0.35 * Math.sin(time * 7);
    drawHand(BENCH.x + 54, BENCH.y - 74 + Math.sin(time * 4) * 5, a);
  }
}

function draw() {
  drawWall();
  drawStove();
  drawPan(pan.st === 'cook');
  if (scene === 'play') drawGuests();
  else drawGuest(menuG, 706, GUEST_Y, 1, 'idle', time);
  drawCounter();
  if (scene === 'play') {
    drawPanCake();
    drawServing();
  } else {
    drawPanCake();
    drawPlate(PLATE);
    plateStack(PLATE, [{b:0},{b:0},{b:0}], 44);
    drawBench();
  }
  drawHUD();
  drawParts();
  drawStarFly();
  if (scene === 'play') drawBubbles();
  if (drag) drawDrag();
  if (scene === 'play' && mode === 'share') drawSplitBtn(pan.st === 'ready');
  if (scene === 'menu') drawMenu(true);
  if (roundT > 0 && scene === 'play') drawRoundEnd();
  if (showHelp) drawHelp();
}

let last = performance.now(), paused = false;
function frame(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.05) dt = 0.05;
  if (!paused) update(dt);
  draw();
  requestAnimationFrame(frame);
}

resize();
requestAnimationFrame(frame);