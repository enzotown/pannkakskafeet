# Pannkakskaféet — design

Ett räkne- och serveringsspel i serien svenska lekspel (Kottens spel).

## Målgrupp

Barn 4–7 år. Spelas på iPad (liggande och stående) eller med mus. All text är
svensk och kort; siffror och prickar bär informationen. Ingen timer, inget
förlorarläge — gästen väntar snällt hur länge barnet vill.

## Lärandemål

- **Antalsuppfattning 1–5.** Gästen visar sin beställning både som stora prickar
  och som stor siffra, så barnet kan räkna och känna igen siffran samtidigt.
- **Ett-till-ett-principen.** En pannkaka per prick: barnet flyttar en pannkaka
  i taget till tallriken och jämför högen med prickarna.
- **”En till”.** När det är för få visas bara de saknade prickarna i grått och
  gästen pekar på munnen — barnet lägger till en.
- **”En för mycket”.** Gästen säger ”Oj då!”, en hand visar vägen till bänken och
  barnet tar bort en pannkaka. Motsatt riktning av samma resonemang.
- **Halvor och dela lika.** En pannkaka delas med saxen i två halvor som läggs på
  varsin tallrik: två gäster får lika mycket av samma hela.
- **Orsak–verkan och tålamod.** Deg → steka → gyllenbrun → glänser → bärbar.

## Två lägen

| Läge | Knapp | Uppgift | Omgång |
|---|---|---|---|
| Räkna & servera | pannkaksstack + tre prickar | servera exakt 1–5 pannkakor | 5 gäster, en stjärna var |
| Dela lika | delad pannkaka + sax + två tallrikar | stek, tryck på saxen, lägg en halva på varje tallrik | 3 par, en stjärna per par |

## Objektlista (ritade i canvas, inga bildfiler)

- **Rum:** creamvägg med mint-ränder, fönster, hylla med syltburkar, tavla med
  pannkaka, trägolv, disk med skiva och luckor.
- **Spis och panna:** gjutjärnspanna med handtag på spisen; deg, stekyta med
  bubblor, gyllenbrun pannkaka med glans.
- **Tallrikar:** vit tallrik med mintkant och mjuk skugga; pannkakorna staplas med
  liten förskjutning och krymper i tre tuggor.
- **Bänken:** träskärbräda där färdiga pannkakor och borttagna pannkakor hamnar.
- **Gäster:** kanin, björn, igelkott, groda och katt — enkla former, tydliga ögon,
  nos, mun, armar och kindrosor. Uttryck: glad, tuggande, pekande, ledsen, gående.
- **Pratbubbla:** stor siffra (82 px) + prickar; grå prickar när något fattas;
  egen bubbla för ”Oj då!” och för ½ (två halvor + liten symbol).
- **HUD:** stjärnrad uppe till höger, stor ”?”-knapp, konfetti vid fem stjärnor.
- **Handen:** vit hand med mintärm som visar ”ta” vid färdig pannkaka och vid bänken.

## Motor

- `engine.js` — canvas, `resize()` (1000×700 skalat med `min(vw/1000, vh/700)`,
  centrerat, pekkoordinater räknas om via `OX/OY/SC`), färgpalett, geometri och
  WebAudio: `tone()`, brus för fräs/snitt, jingel, tugg- och ”oj då”-ljud. Inga ljudfiler.
- `art.js` — rum, spis, panna, pannkaka, tallrik, bänk, stjärna, HUD.
- `art2.js` — djur och pratbubblor.
- `art3.js` — meny, hjälp, saxknapp, hand, konfetti, rondslut.
- `app.js` — tillstånd och regler.
- `input.js` — pek/släpp, träffytor och testkrok (`window.PK`).
- `loop.js` — `update(dt)` / `draw()` / `requestAnimationFrame`.

### Tillståndsmaskiner

Pannkakan: `raw → cook (1,8 s) → ready → empty → raw`. I dela-lika:
`ready → halves (2) → empty`. Varje pannkaka på tallriken har `b` 0–3
(antal tuggor) och tas bort vid 3.

Gästkön: varje gäst är `enter → serve → (few | oj | check) → happy → eat → leave`,
där `check` är den korta stund gästen räknar efter att antalet stämmer — hinner
barnet lägga dit en till blir det `oj` i stället för stjärna. Nästa gäst kliver
fram när den förra gått ut till höger. Dela-lika-paren har
`enter → serve → happy → eat → leave`.

## Testbarhet

`window.PK` exponerar `startRound`, `cook`, `step(dt)`, `serve`, `toBench`,
`split`, `state`, `pause` och `setStars`. Med `pause(true)` kan ett skript styra
tiden exakt; alla speltester körs så i webbläsaren.