// art3.js — meny, hjälp, dela-knapp, hand, konfetti och firande
function drawKnife(x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot || 0);
  ctx.fillStyle = '#cfdde4'; rr(-6, -44, 12, 56, 5); ctx.fill();
  ctx.fillStyle = C.brown2; rr(-9, 8, 18, 40, 8); ctx.fill();
  ctx.fillStyle = C.coral; rr(-9, 12, 18, 8, 4); ctx.fill();
  ctx.restore();
}
function drawScissors(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.55);
  // skänklar och ringar
  ctx.strokeStyle = C.coral; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-15, 24); ctx.lineTo(-3, -10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(15, 24); ctx.lineTo(3, -10); ctx.stroke();
  ctx.beginPath(); ctx.arc(-17, 29, 8, 0, 6.3); ctx.stroke();
  ctx.beginPath(); ctx.arc(17, 29, 8, 0, 6.3); ctx.stroke();
  // blad
  for (let i = -1; i <= 1; i += 2) {
    ctx.fillStyle = '#c6d6dd';
    ctx.beginPath();
    ctx.moveTo(i * 4, -6);
    ctx.lineTo(i * 21, -36);
    ctx.lineTo(i * 26, -28);
    ctx.lineTo(i * 7, -2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9fb4bd'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = C.brown2;
  ctx.beginPath(); ctx.arc(0, -7, 4.5, 0, 6.3); ctx.fill();
  ctx.restore();
}

function drawSplitBtn(on) {
  const x = 900, y = 612, r = 54;
  ctx.save();
  if (on) {
    const p = 1 + 0.05 * Math.sin(time * 6);
    ctx.translate(x, y); ctx.scale(p, p); ctx.translate(-x, -y);
    ctx.fillStyle = 'rgba(239,128,100,' + (0.22 + 0.12 * Math.sin(time * 6)) + ')';
    ctx.beginPath(); ctx.arc(x, y, r + 22, 0, 6.3); ctx.fill();
  }
  ctx.fillStyle = 'rgba(74,63,57,.18)'; ctx.beginPath(); ctx.arc(x + 3, y + 6, r, 0, 6.3); ctx.fill();
  ctx.fillStyle = on ? C.coral : '#e8dccd';
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill();
  ctx.strokeStyle = on ? C.coralDark : 'rgba(74,63,57,.2)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.stroke();
  drawScissors(x, y + 8, 0.95);
  ctx.restore();
}

function drawHand(x, y, a) {
  ctx.save();
  ctx.globalAlpha = a === undefined ? 1 : a;
  ctx.translate(x, y); ctx.rotate(0.18); ctx.scale(0.92, 0.92);
  ctx.fillStyle = 'rgba(74,63,57,.18)'; ell(8, 24, 32, 24); ctx.fill();
  // ärm
  ctx.fillStyle = C.mint; rr(-29, -58, 58, 32, 11); ctx.fill();
  ctx.fillStyle = C.mintDark; rr(-29, -32, 58, 8, 4); ctx.fill();
  // handflata
  ctx.fillStyle = C.white; rr(-28, -26, 56, 40, 17); ctx.fill();
  // fyra fingrar
  for (let i = 0; i < 4; i++) {
    const fx = -25 + i * 14;
    rr(fx, 4 + Math.abs(i - 1.5) * 2, 14, 27, 7); ctx.fill();
  }
  // tumme
  ctx.save(); ctx.translate(-30, -2); ctx.rotate(-0.5);
  rr(-10, -4, 19, 28, 9); ctx.fill(); ctx.restore();
  // konturer
  ctx.strokeStyle = 'rgba(74,63,57,.34)'; ctx.lineWidth = 2.5;
  for (let i = 0; i < 4; i++) {
    const fx = -25 + i * 14;
    rr(fx, 4 + Math.abs(i - 1.5) * 2, 14, 27, 7); ctx.stroke();
  }
  rr(-28, -26, 56, 40, 17); ctx.stroke();
  ctx.strokeStyle = 'rgba(74,63,57,.14)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-20, -14); ctx.lineTo(20, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-24, -2); ctx.lineTo(24, -2); ctx.stroke();
  ctx.restore();
}

function button(x, y, w, h, active) {
  ctx.fillStyle = 'rgba(74,63,57,.16)'; rr(x + 5, y + 7, w, h, 30); ctx.fill();
  ctx.fillStyle = active ? C.mint : C.cream;
  rr(x, y, w, h, 30); ctx.fill();
  ctx.strokeStyle = active ? C.mintDark : 'rgba(74,63,57,.18)'; ctx.lineWidth = 5;
  rr(x, y, w, h, 30); ctx.stroke();
}

function label(txt, x, y, size, col) {
  ctx.fillStyle = col || C.brown;
  ctx.font = 'bold ' + size + 'px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, x, y);
}

// två stora lägesknappar
function drawModeButtons(y, small) {
  const w = small ? 250 : 320, h = small ? 120 : 210, cy = y;
  const xs = [DW / 2 - (small ? 270 : 350), DW / 2 + (small ? 20 : 30)];
  const by = cy;
  for (let i = 0; i < 2; i++) {
    button(xs[i], by, w, h, false);
    const cx = xs[i] + w / 2;
    if (!small) {
      if (i === 0) {
        for (let k = 0; k < 3; k++) drawPancake(cx - 8 + k * 3, by + 96 - k * 12, 62, 1);
        ctx.fillStyle = C.coral;
        for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cx - 46 + k * 46, by + 152, 9, 0, 6.3); ctx.fill(); }
      } else {
        drawPlate({ x: cx - 68, y: by + 116, r: 44 });
        drawPlate({ x: cx + 68, y: by + 116, r: 44 });
        drawPancake(cx - 40, by + 52, 58, 1, 1, true);
        drawPancake(cx + 40, by + 52, 58, 1, 1, 'r');
        drawScissors(cx, by + 96, 0.8);
      }
      label(i === 0 ? 'Räkna & servera' : 'Dela lika', cx, by + 186, 30, C.brown2);
    } else {
      label(i === 0 ? 'Räkna' : 'Dela', cx, by + 62, 34, C.brown2);
    }
  }
}

function drawMenu(showTitle) {
  ctx.fillStyle = 'rgba(74,63,57,.55)'; ctx.fillRect(0, 0, DW, DH);
  ctx.fillStyle = C.cream; rr(88, 96, 824, 540, 40); ctx.fill();
  ctx.strokeStyle = 'rgba(217,163,95,.8)'; ctx.lineWidth = 6; rr(88, 96, 824, 540, 40); ctx.stroke();
  ctx.fillStyle = C.mint; rr(88, 96, 824, 26, 40); ctx.fill();
  if (showTitle) {
    label('Pannkakskaféet', DW / 2, 178, 54, C.brown);
    label('Vad vill du göra?', DW / 2, 224, 26, C.brown2);
  } else {
    label('Vad vill du göra?', DW / 2, 186, 40, C.brown);
  }
  drawModeButtons(showTitle ? 264 : 270, false);
}

function drawHelp() {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.62)'; ctx.fillRect(0, 0, DW, DH);
  ctx.fillStyle = C.cream; rr(160, 84, 680, 532, 34); ctx.fill();
  ctx.strokeStyle = 'rgba(217,163,95,.8)'; ctx.lineWidth = 5; rr(160, 84, 680, 532, 34); ctx.stroke();
  label('Så leker du', 500, 148, 42, C.brown);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = C.brown2; ctx.font = '26px "Trebuchet MS", sans-serif';
  const rows = [
    'Tryck på pannan för att steka en pannkaka.',
    'När den glänser: dra den till gästens tallrik.',
    'Titta på bubblan — räkna prickarna och siffran.',
    'Precis lagom många = en stjärna!',
    'För många? Dra en tillbaka till bänken.',
    'För få? Stek en till. Gästen väntar snällt.',
    'I "Dela lika" trycker du på saxen,',
    'och lägger en halva på varje tallrik.'
  ];
  for (let i = 0; i < rows.length; i++) ctx.fillText(rows[i], 208, 214 + i * 38);
  ctx.fillStyle = C.mint; rr(388, 528, 224, 66, 33); ctx.fill();
  label('Jag fattar!', 500, 562, 27, C.cream);
  ctx.restore();
}

function drawParts() {
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    ctx.save();
    ctx.globalAlpha = clamp(p.life / 0.5, 0, 1);
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.col;
    if (p.shape === 'star') drawStar(0, 0, p.sz, p.col);
    else if (p.shape === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.sz, 0, 6.3); ctx.fill(); }
    else ctx.fillRect(-p.sz / 2, -p.sz / 3, p.sz, p.sz * 0.66);
    ctx.restore();
  }
}

function drawStarFly() {
  if (!starFly) return;
  const t = ease(starFly.t);
  const x = lerp(starFly.x0, HELP.x - 268 + stars * 34, t);
  const y = lerp(starFly.y0, HELP.y, t) - Math.sin(t * Math.PI) * 90;
  ctx.save();
  ctx.globalAlpha = 0.9;
  drawStar(x, y, lerp(38, 15, t), C.yellow);
  ctx.restore();
}

function drawRoundEnd() {
  if (roundT <= 0) return;
  const a = Math.min(1, roundT / 0.4);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(74,63,57,.5)'; ctx.fillRect(0, 0, DW, DH);
  ctx.fillStyle = C.cream; rr(180, 116, 640, 470, 36); ctx.fill();
  label('Alla är mätta!', 500, 190, 48, C.brown);
  for (let i = 0; i < 5; i++) {
    const s = 1 + 0.07 * Math.sin(time * 4 + i);
    ctx.save(); ctx.translate(330 + i * 86, 272); ctx.scale(s, s);
    if (i < stars) drawStar(0, 0, 34);
    else {
      ctx.globalAlpha = 0.22; drawStar(0, 0, 30, C.sandDark); ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  label('Vill du leka igen?', 500, 350, 28, C.brown2);
  drawModeButtons(390, true);
  ctx.restore();
}