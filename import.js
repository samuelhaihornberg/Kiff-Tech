#!/usr/bin/env node
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib'), crypto = require('crypto');
const { Readable } = require('stream');
const USER = process.env.ICECAT_USER || 'SAMUELhai', PASS = process.env.ICECAT_PASS || '';
const MAXD = +process.env.MAX_DETAIL || 300, LANG = process.env.ICECAT_LANG || 'fr', DRY = !!process.env.DRY;
const BASE = process.env.ICECAT_BASE || 'https://data.icecat.biz/export/freexml.int';
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'rayons.json'), 'utf8'));
const EXCL = new RegExp(R.exclude || 'cover|case|housse|étui|coque|pogo|dock|protector|protecteur|strap|bracelet de rechange|cable|câble|adapter|adaptateur|charger|chargeur|stylus|pen tip|film|refill|filtre|brosse|serpillière', 'i');
const auth = { 'User-Agent': 'KiffTechBot/1.0', Authorization: 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64') };
const open = async (u, h) => { const r = await fetch(u, { headers: h || auth, signal: AbortSignal.timeout(600000) }); if (!r.ok) throw new Error(u + ' → HTTP ' + r.status + (r.status === 401 ? ' (mot de passe Icecat ? secret ICECAT_PASS)' : '')); return r; };
const text = async u => { let b = Buffer.from(await (await open(u)).arrayBuffer()); if (u.endsWith('.gz')) b = zlib.gunzipSync(b); return b.toString('utf8'); };
const attrs = s => { const o = {}; s.replace(/([A-Za-z_]+)="([^"]*)"/g, (_, k, v) => (o[k] = v.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))); return o; };
const ram = txt => { const m = /(\d+(?:[.,]\d+)?)\s*(GB|Go|TB|To)\b/i.exec(txt || ''); if (!m) return 0; const n = parseFloat(m[1].replace(',', '.')); return /T/i.test(m[2]) ? n * 1024 : n; };
(async () => {
  console.log('1/4 Marques et catégories…');
  const sup = {}, cat = {};
  (await text(BASE.replace('/freexml.int', '') + '/freexml/refs/SuppliersList.xml.gz')).replace(/<Supplier\b([^>]*)>/g, (_, a) => { const o = attrs(a); if (o.ID) sup[o.ID] = o.Name; });
  (await text(BASE.replace('/freexml.int', '') + '/freexml/refs/CategoriesList.xml.gz')).replace(/<Category\b([^>]*)>([\s\S]*?)<\/Category>/g, (_, a, b) => { const o = attrs(a), n = /<Name\b[^>]*Langid="1"[^>]*Value="([^"]*)"/.exec(b) || /<Name\b[^>]*Value="([^"]*)"/.exec(b); if (o.ID && n) cat[o.ID] = n[1]; });
  const okBrand = new Set(Object.entries(sup).filter(([, n]) => R.brands.some(b => b.toLowerCase() === String(n).toLowerCase())).map(([i]) => i));
  console.log('   marques retenues:', okBrand.size, '| catégories connues:', Object.keys(cat).length);
  if (!okBrand.size || !Object.keys(cat).length) throw new Error('Listes Icecat vides : accès refusé ou format différent.');
  const rx = R.rayons.map(r => ({ r, re: new RegExp(r.match, 'i') })), cand = {}; R.rayons.forEach(r => cand[r.id] = []);
  console.log('2/4 Lecture de l’index Open Icecat (long, flux)…');
  const res = await open(BASE + '/INT/files.index.xml.gz'); let buf = '', n = 0;
  const stream = Readable.fromWeb(res.body).pipe(zlib.createGunzip());
  for await (const chunk of stream) {
    buf += chunk.toString('utf8'); let i;
    while ((i = buf.indexOf('<file ')) >= 0) {
      const j = buf.indexOf('>', i); if (j < 0) break; const a = attrs(buf.slice(i, j)); buf = buf.slice(j + 1); n++;
      if (!okBrand.has(a.Supplier_id) || a.On_Market === '0' || !/^https:\/\//.test(a.HighPic || '')) continue;
      const cn = cat[a.Catid] || ''; const hit = rx.find(x => x.re.test(cn)); if (!hit) continue;
      const d = new Date(a.Date_Added || a.Updated || ''); const age = isNaN(d) ? 0 : (Date.now() - d) / 3.15e10;
      if (hit.r.score && age && age > R.modernYears + 1) continue;
      cand[hit.r.id].push({ a, brand: sup[a.Supplier_id], cat: cn, date: a.Date_Added || a.Updated || '' });
    }
  }
  console.log('   fiches lues:', n, '| candidats:', Object.entries(cand).map(([k, v]) => k + '=' + v.length).join(' '));
  console.log('3/4 Détail + filtre de performance…');
  const cf = path.join(__dirname, 'catalog.json'); let cur = { updated: '', items: {} }; try { cur = JSON.parse(fs.readFileSync(cf, 'utf8')); } catch (e) {}
  let detail = 0, kept = 0;
  for (const { r } of rx) {
    let list = cand[r.id].sort((x, y) => String(y.date).localeCompare(String(x.date))), seen = 0, pass = [];
    for (const c of list) {
      if (seen >= (R.detailPerRayon || 25) || detail >= MAXD) break; seen++;
      const code = c.a.Prod_ID; const id = 'ic' + crypto.createHash('md5').update(c.brand + code).digest('hex').slice(0, 8);
      if ((cur.items[id] || {}).label) continue;
      let d; detail++;
      try { d = (await (await open(`https://live.icecat.biz/api?UserName=${encodeURIComponent(USER)}&Language=${LANG}&Brand=${encodeURIComponent(c.brand)}&ProductCode=${encodeURIComponent(code)}`, { 'User-Agent': 'KiffTechBot/1.0' })).json()).data; }
      catch (e) { console.log('✖', c.brand, code, e.message); continue; }
      if (!d) continue;
      const feats = []; (d.FeaturesGroups || []).forEach(g => (g.Features || []).forEach(f => feats.push([(f.Feature && f.Feature.Name && f.Feature.Name.Value) || '', f.PresentationValue || f.Value || ''])));
      const ramLine = feats.find(([k]) => /internal memory|ram|m[ée]moire interne|m[ée]moire vive/i.test(k) && !/storage|stockage/i.test(k));
      const gb = ram(ramLine && ramLine[1]);
      if (r.minRamGB && gb < r.minRamGB) { console.log('–', c.brand, code, 'RAM', gb || '?', 'Go < ' + r.minRamGB); await new Promise(z => setTimeout(z, 400)); continue; }
      const title = (d.GeneralInfo && d.GeneralInfo.Title) || (c.brand + ' ' + code);
      const ACC = feats.some(([k]) => /^(produits? compatibles?|compatibilit[ée]( de marque)?|compatible avec|appareils? compatibles?)/i.test(k));
      if (!r.allowAccessories && (EXCL.test(title) || ACC)) { console.log('–', c.brand, code, 'accessoire écarté'); continue; }
      const PRI = /m[ée]moire interne|ram|processeur.*mod|mod[eè]le de processeur|carte graphique|gpu|stockage|capacit[ée] total|taille de l.[ée]cran|r[ée]solution|fr[ée]quence de rafra|taux de rafra|autonomie|batterie|puissance|aspiration|navigation|wi-?fi|bluetooth|hdmi|poids|plateforme|portée|[ée]tanch/i;
      const ok = feats.filter(([k, v]) => k && v && String(v).length < 70 && !/^(couleur|cat[ée]gorie|type de produit)/i.test(k));
      const facts = ok.filter(([k]) => PRI.test(k)).concat(ok.filter(([k]) => !PRI.test(k))).slice(0, 12).map(([k, v]) => k + ' : ' + v);
      const desc = ((d.GeneralInfo || {}).Description || {}).LongDesc || (((d.GeneralInfo || {}).SummaryDescription || {}).ShortSummaryDescription) || '';
      const img = (d.Image && (d.Image.HighPic || d.Image.Pic500x500)) || c.a.HighPic;
      const blob = (title + ' ' + feats.map(f => f.join(' ')).join(' ')).toLowerCase();
      const use = (/gaming|gamer|jeu|game|120 ?hz|144 ?hz|165 ?hz|240 ?hz|rtx|radeon|oled|4k|8k/.test(blob) ? 20 : 0) + (/stream|capture|hdr|dolby|wi-?fi ?(6e|7)|ethernet|hdmi 2\.1|nvme|thunderbolt/.test(blob) ? 20 : 0);
      pass.push({ score: gb + use + (c.date ? new Date(c.date).getFullYear() - 2000 : 0), id, item: { label: title.slice(0, 120) + ' (' + code + ')', brand: c.brand, mpn: code, rayon: r.id, photo: img, photoSrc: 'Icecat', factsSrc: 'https://icecat.biz', facts: { [LANG]: facts }, desc: String(desc).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 600),
        product: { ico: r.ico, brand: c.brand, n: { [LANG]: title.slice(0, 100), en: title.slice(0, 100) }, cat: r.cat, tags: [c.brand, r.id], ref: 0 } } });
      console.log('✔ candidat', r.id, c.brand, code, gb ? gb + ' Go' : '', 'score', pass[pass.length - 1].score);
      await new Promise(z => setTimeout(z, 600));
    }
    pass.sort((x, y) => y.score - x.score).slice(0, R.topPerRayon || 1).forEach(p => { cur.items[p.id] = p.item; kept++; console.log('★ TOP', r.id, p.item.label, '(score ' + p.score + ')'); });
  }
  console.log('4/4 Écriture…');
  if (kept && !DRY) { cur.updated = new Date().toISOString().slice(0, 10); fs.writeFileSync(cf, JSON.stringify(cur, null, 1)); }
  console.log(`Import : ${kept} nouveau(x) produit(s), ${detail} fiche(s) détaillée(s) consultée(s).`);
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
