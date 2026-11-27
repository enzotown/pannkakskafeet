# Pannkakskaféet

Stek pannkakor, räkna prickarna i gästens bubbla och servera precis lagom många.
I läget **Dela lika** delar du en pannkaka med saxen och ger en halva till varje gäst.
För barn 4–7 år, svensk text, inga förlorarlägen.

- `index.html` + sju små JS-filer, inga beroenden och inga bild- eller ljudfiler.
- Ljudet byggs med WebAudio och startar vid första beröringen.
- 1000×700 designyta som skalas och centreras; fungerar på iPad i båda riktningarna.

Prova lokalt:

```bash
cd spel/pannkakskafeet && python3 -m http.server 8131
# öppna http://localhost:8131/
```

Läs `DESIGN.md` för lärandemål, objektlista och tillståndsmaskiner.