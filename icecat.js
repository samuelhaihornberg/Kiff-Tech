#!/usr/bin/env node
/* Images officielles via Open Icecat (compte gratuit). Remplit catalog.json (racine) : photo + photoSrc.
   Pour chaque modèle ayant une référence (entre parenthèses dans son nom, ex. "(SM-R420)", ou un champ "mpn" dans le catalogue).
   N'écrase JAMAIS une photo déjà renseignée. Utilisation : ICECAT_USER=SAMUELhai node icecat.js
   ⚠ Non testé de bout en bout (réseau bloqué là où je l'ai écrit) : lis les conditions d'Icecat, et regarde le journal affiché. */
'use strict';
const fs = require('fs'), path = require('path');
const USER = process.env.ICECAT_USER || 'SAMUELhai', LANG = process.env.ICECAT_LANG || 'fr';
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const emb = (html.match(/<script type="application\/json" id="catalog-data">([\s\S]*?)<\/script>/) || [])[1];
const base = emb ? JSON.parse(emb).items || {} : {};
const f = path.join(__dirname, 'catalog.json');
let cur = { updated: '', items: {} }; try { cur = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) {}
const BRANDS = [[/galaxy|samsung/i, 'Samsung'], [/redmi|xiaomi|\bmi\b|poco/i, 'Xiaomi'], [/iphone|ipad|airpods|apple/i, 'Apple']];
const get = async u => { const r = await fetch(u, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'KiffTechBot/1.0' } }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); };
(async () => {
  let done = 0, tried = 0;
  for (const [id, it0] of Object.entries(base)) {
    const it = Object.assign({}, it0, (cur.items || {})[id] || {});
    if (it.photo) continue;
    const code = it.mpn || ((it.label || '').match(/\(([A-Z0-9][A-Z0-9-]{4,})\)\s*$/) || [])[1]; if (!code) continue;
    const brand = it.brand || (BRANDS.find(([r]) => r.test(it.label || '')) || [])[1]; if (!brand) continue;
    tried++;
    try {
      const d = await get(`https://live.icecat.biz/api?UserName=${encodeURIComponent(USER)}&Language=${LANG}&Brand=${encodeURIComponent(brand)}&ProductCode=${encodeURIComponent(code)}`);
      const img = d && d.data && ((d.data.Image && (d.data.Image.HighPic || d.data.Image.Pic500x500)) || ((d.data.Gallery || [])[0] || {}).Pic);
      if (img && /^https:\/\//.test(img)) { cur.items[id] = Object.assign(cur.items[id] || {}, { photo: img, photoSrc: 'Icecat' }); done++; console.log('✔', id, brand, code, '→ image trouvée'); }
      else console.log('–', id, brand, code, ': aucune image dans la réponse (', (d && d.msg) || '?', ') — ajoute le code complet dans "mpn"');
    } catch (e) { console.log('✖', id, brand, code, ':', e.message); }
    await new Promise(r => setTimeout(r, 1000));
  }
  if (done) { cur.updated = new Date().toISOString().slice(0, 10); fs.writeFileSync(f, JSON.stringify(cur, null, 1)); }
  console.log(`Icecat : ${done}/${tried} modèle(s) complété(s).`);
})().catch(e => { console.error(e.message); process.exit(1); });
