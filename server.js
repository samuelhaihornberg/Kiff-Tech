#!/usr/bin/env node
/* ============================================================================
   KIFF TECH — backend unique (Node >= 18, ZÉRO dépendance, tout en JSON)
   Un seul fichier : sert le front (index.html + sw.js) ET l'API.

   Lancer :   ADMIN_TOKEN=un-long-secret node server.js
   Variables (toutes optionnelles) :
     PORT=3000                     DATA_DIR=./data
     ADMIN_TOKEN=...               (sinon généré et écrit dans data/admin_token.txt)
     PAYPAL_CLIENT_ID / PAYPAL_SECRET / PAYPAL_MODE=sandbox|live
     TRUST_PROXY=1                 (derrière Nginx/Cloudflare : lit X-Forwarded-For)
     SYNC_EVERY_HOURS=24           (synchro des prix officiels ; 0 = manuelle)
     SYNC_AUTO_APPLY=1             (applique seul les prix officiels détectés, sinon à valider)
     ALLOW_OFFICIAL_IMAGES=1       (applique les photos officielles détectées : à n'activer QUE si
                                    tu as l'autorisation écrite du fournisseur / de la marque)
   Le prix payé est TOUJOURS recalculé ici avec le même moteur que le front
   (extrait de index.html entre les marqueurs @SHARED-BEGIN et @SHARED-END) : le client ne décide jamais du prix.
   ============================================================================ */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto'), vm = require('vm');

const ROOT = __dirname;
const DATA = process.env.DATA_DIR || path.join(ROOT, 'data');
const PORT = +process.env.PORT || 3000;
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const PP_ID = process.env.PAYPAL_CLIENT_ID || '', PP_SECRET = process.env.PAYPAL_SECRET || '';
const PP_BASE = (process.env.PAYPAL_MODE === 'live') ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
const AUTO_APPLY = process.env.SYNC_AUTO_APPLY === '1', ALLOW_IMG = process.env.ALLOW_OFFICIAL_IMAGES === '1';
const UA = 'KiffTechBot/1.0 (price-sync; contact: see site)';

/* ---------- stockage JSON (écriture atomique) ---------- */
fs.mkdirSync(DATA, { recursive: true });
const fp = n => path.join(DATA, n);
function load(n, def) { try { return JSON.parse(fs.readFileSync(fp(n), 'utf8')); } catch (e) { return def; } }
function save(n, obj) { const t = fp(n) + '.tmp'; fs.writeFileSync(t, JSON.stringify(obj, null, 1)); fs.renameSync(t, fp(n)); }
if (!fs.existsSync(fp('orders.json'))) save('orders.json', []);
if (!fs.existsSync(fp('leads.json'))) save('leads.json', []);
if (!fs.existsSync(fp('vip.json'))) save('vip.json', { codes: {}, tokens: {} });
if (!fs.existsSync(fp('catalog.json'))) save('catalog.json', { updated: '', items: {} });
if (!fs.existsSync(fp('sources.json'))) save('sources.json', {});
if (!fs.existsSync(fp('sync.json'))) save('sync.json', { last: '', candidates: [] });
let ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
if (!ADMIN_TOKEN) {
  try { ADMIN_TOKEN = fs.readFileSync(fp('admin_token.txt'), 'utf8').trim(); } catch (e) {}
  if (!ADMIN_TOKEN) { ADMIN_TOKEN = crypto.randomBytes(24).toString('hex'); fs.writeFileSync(fp('admin_token.txt'), ADMIN_TOKEN, { mode: 0o600 }); console.log('ADMIN_TOKEN généré :', ADMIN_TOKEN); }
}
const COUNTRIES = load('countries.json', {});

/* ---------- moteur de prix partagé avec le front ---------- */
let ctx = null, orderCache = '[]';
function buildEngine() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const a = html.indexOf('/*@SHARED' + '-BEGIN*/'), b = html.indexOf('/*@SHARED' + '-END*/');
  if (a < 0 || b < 0) throw new Error('marqueurs SHARED introuvables dans index.html');
  const m = html.match(/<script type="application\/json" id="catalog-data">([\s\S]*?)<\/script>/);
  const embedded = m ? JSON.parse(m[1]).items || {} : {};
  const c = { console, __vip: 0 };
  c.localStorage = { getItem: k => k === 'vip' ? String(c.__vip) : k === 'orders' ? orderCache : null };
  vm.createContext(c);
  vm.runInContext(html.slice(a, b), c, { timeout: 3000 });
  vm.runInContext(`
    function __rates(r){ Object.keys(r).forEach(k=>{ RATES[k]=r[k]; }); }
    function __price(cat, cc, countries){
      Object.entries(countries).forEach(([k,v])=>{ if(!COUNTRIES[k]) COUNTRIES[k]={n:k,cur:v.cur,vat:v.vat}; });
      Object.keys(PRICE_DB).forEach(k=>delete PRICE_DB[k]);
      Object.entries(cat).forEach(([k,v])=>{ if(!v) return; if(v.product) ensureProduct(+k, v.product); const d=PRICE_DB[+k]=PRICE_DB[+k]||{};
        if(v.ali&&v.ali.price>0) d.ali=v.ali;
        if(v.official) Object.entries(v.official).forEach(([c,o])=>{ if(o&&(o.usd>0||o.amt>0)&&o.src){ d.official=d.official||{}; d.official[c]=o; } }); });
      country = COUNTRIES[cc] ? cc : 'IL';
      return PRODUCTS.map(p=>{ p.e=engine(p); return {id:p.id,name:p.n.fr||p.n.en,real:!!p.real,ok:p.e.ok,vcost:p.e.vcost,unit:userPrice(p),cost:p.e.q,price:p.e.price}; });
    }`, c);
  c.__embedded = embedded;
  return c;
}
function mergedCatalog() {            // embarqué dans le HTML + catalog.json du serveur (le serveur gagne)
  const out = JSON.parse(JSON.stringify(ctx.__embedded || {}));
  const srv = load('catalog.json', { items: {} }).items || {};
  Object.entries(srv).forEach(([k, v]) => {
    const o = out[k] = out[k] || {};
    Object.entries(v || {}).forEach(([f, val]) => {
      if (f === 'official') o.official = Object.assign({}, o.official || {}, val);
      else if (f === 'ali' && !(val && val.price > 0)) delete o.ali;
      else o[f] = val;
    });
  });
  return out;
}
function ordersForDemand() {
  return JSON.stringify(load('orders.json', []).filter(o => o.status !== 'pending' && o.status !== 'cancelled' && o.status !== 'refunded')
    .map(o => ({ status: 'paid', created: o.created, items: (o.lines || []).map(l => ({ id: l.id, q: l.q })) })));
}
function priceTable(countryCode, vipLevel) {
  orderCache = ordersForDemand(); ctx.__vip = vipLevel || 0;
  return ctx.__price(mergedCatalog(), countryCode, COUNTRIES);
}
function demand() {
  const since = Date.now() - 30 * 864e5, d = {};
  load('orders.json', []).forEach(o => { if (['paid', 'ordered_supplier', 'shipped', 'delivered'].includes(o.status) && Date.parse(o.created) >= since) (o.lines || []).forEach(l => d[l.id] = (d[l.id] || 0) + l.q); });
  return d;
}

/* ---------- utilitaires HTTP ---------- */
const hits = new Map();
function limited(key, max, windowMs) { const now = Date.now(), a = (hits.get(key) || []).filter(t => now - t < windowMs); a.push(now); hits.set(key, a); return a.length > max; }
setInterval(() => { const now = Date.now(); for (const [k, a] of hits) if (!a.some(t => now - t < 3600e3)) hits.delete(k); }, 600e3).unref();
function ipOf(req) { if (TRUST_PROXY) { const x = (req.headers['x-forwarded-for'] || '').split(',')[0].trim(); if (x) return x; } return (req.socket.remoteAddress || '').replace(/^::ffff:/, ''); }
function send(res, code, obj, extra) { const b = typeof obj === 'string' ? obj : JSON.stringify(obj); res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extra || {})); res.end(b); }
function body(req, max) { return new Promise((ok, ko) => { let n = 0; const ch = []; req.on('data', c => { n += c.length; if (n > (max || 100e3)) { ko(Object.assign(new Error('corps trop gros'), { code: 413 })); req.destroy(); } else ch.push(c); }); req.on('end', () => { try { ok(ch.length ? JSON.parse(Buffer.concat(ch).toString('utf8')) : {}); } catch (e) { ko(Object.assign(new Error('JSON invalide'), { code: 400 })); } }); }); }
const fail = (code, msg) => Object.assign(new Error(msg), { code });
const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n || 200) : '');
function safeEq(a, b) { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); }
function isAdmin(req) {
  const ip = ipOf(req), key = 'adm-fail:' + ip, now = Date.now();
  if ((hits.get(key) || []).filter(t => now - t < 900e3).length >= 10) return false;      // 10 échecs / 15 min -> bloqué
  const tok = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (safeEq(tok, ADMIN_TOKEN)) return true;
  limited(key, 1e9, 900e3); return false;
}
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src * data: blob:; media-src * data: blob:; connect-src 'self' https://open.er-api.com https://*.paypal.com https://cdn.jsdelivr.net https://tessdata.projectnaptha.com; frame-src https://www.youtube-nocookie.com https://*.paypal.com; worker-src 'self' blob:; manifest-src 'self' data:; base-uri 'none'; object-src 'none'; form-action 'self'";
const SEC = { 'Content-Security-Policy': CSP, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' };

/* ---------- pays par IP ---------- */
const geoCache = new Map();
async function geo(req) {
  const h = req.headers;
  const hdr = (h['cf-ipcountry'] || h['cloudfront-viewer-country'] || h['x-vercel-ip-country'] || h['x-appengine-country'] || '').toUpperCase();
  if (/^[A-Z]{2}$/.test(hdr) && hdr !== 'XX' && hdr !== 'T1') return { country: hdr, via: 'header' };
  const ip = ipOf(req);
  if (!ip || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd|169\.254\.)/i.test(ip)) return { country: null, via: 'local' };
  const c = geoCache.get(ip); if (c && Date.now() - c.t < 864e5) return { country: c.v, via: 'cache' };
  try {
    const r = await fetch('https://ipwho.is/' + encodeURIComponent(ip), { signal: AbortSignal.timeout(2500) }); const d = await r.json();
    const v = d && d.success && /^[A-Z]{2}$/.test(d.country_code || '') ? d.country_code : null; geoCache.set(ip, { v, t: Date.now() }); return { country: v, via: 'ipwho.is' };
  } catch (e) { return { country: null, via: 'error' }; }
}

/* ---------- commandes ---------- */
function vipLevelOf(token) { if (!token) return 0; const t = load('vip.json', { tokens: {} }).tokens[token]; return t && Date.parse(t.until) > Date.now() ? t.level : 0; }
function createOrder(b, ip) {
  if (limited('order:' + ip, 20, 3600e3)) throw fail(429, 'trop de commandes, réessaie plus tard');
  const cc = str(b.country, 2).toUpperCase(); if (!COUNTRIES[cc]) throw fail(400, 'pays inconnu');
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 30) throw fail(400, 'panier invalide');
  const s = b.ship || {}, ship = { name: str(s.name, 120), email: str(s.email, 160), phone: str(s.phone, 40), addr: str(s.addr, 200), city: str(s.city, 80), zip: str(s.zip, 20), region: str(s.region, 80) };
  if (!ship.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ship.email) || !ship.addr || !ship.city) throw fail(400, 'nom, e-mail, adresse et ville requis');
  const vip = vipLevelOf(str(b.vipToken, 100)), table = priceTable(cc, vip), byId = Object.fromEntries(table.map(r => [r.id, r]));
  const lines = []; let total = 0;
  for (const it of b.items) {
    const id = +it.id, q = Math.floor(+it.q), r = byId[id];
    if (!r || !(q >= 1 && q <= 20)) throw fail(400, 'article invalide');
    if (!r.ok || (r.real && !r.vcost)) throw fail(409, 'article indisponible : ' + r.name);
    const unit = Math.round(r.unit * 100) / 100; total += unit * q;
    lines.push({ id, name: r.name, c: str(it.c, 60), q, unit, cost: Math.round(r.cost * 100) / 100 });
  }
  let promo = '';
  if (str(b.promo, 20).toUpperCase() === 'WELCOME10' && !vip) {
    const used = load('orders.json', []).some(o => o.promo && o.ship.email.toLowerCase() === ship.email.toLowerCase() && o.status !== 'cancelled');
    if (!used) { promo = 'WELCOME10'; total *= 0.9; }
  }
  total = Math.round(total * 100) / 100;
  const o = { id: crypto.randomUUID(), created: new Date().toISOString(), status: 'pending', country: cc, currency: str(b.currency, 3).toUpperCase(), lang: str(b.lang, 2), ship, lines, total_usd: total, promo, vip, tracking: '' };
  const all = load('orders.json', []); all.push(o); save('orders.json', all);
  return o;
}
const updOrder = (id, fn) => { const all = load('orders.json', []), o = all.find(x => x.id === id); if (!o) throw fail(404, 'commande introuvable'); fn(o); save('orders.json', all); return o; };
let ppTok = { v: '', t: 0 };
async function ppToken() {
  if (!PP_ID || !PP_SECRET) throw fail(501, 'PayPal non configuré');
  if (ppTok.v && Date.now() < ppTok.t) return ppTok.v;
  const r = await fetch(PP_BASE + '/v1/oauth2/token', { method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(PP_ID + ':' + PP_SECRET).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials', signal: AbortSignal.timeout(10000) });
  const d = await r.json(); if (!r.ok) throw fail(502, 'PayPal : authentification refusée');
  ppTok = { v: d.access_token, t: Date.now() + (d.expires_in - 60) * 1000 }; return ppTok.v;
}
async function ppCall(method, p, payload) {
  const r = await fetch(PP_BASE + p, { method, headers: { Authorization: 'Bearer ' + await ppToken(), 'Content-Type': 'application/json' }, body: payload ? JSON.stringify(payload) : undefined, signal: AbortSignal.timeout(15000) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw fail(502, 'PayPal : ' + (d.message || r.status)); return d;
}

/* ---------- synchro des prix / images officiels (par pays) ---------- */
let rates = { t: 0, v: { USD: 1 } };
async function getRates() { if (Date.now() - rates.t < 864e5) return rates.v; try { const d = await (await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(8000) })).json(); if (d.rates) rates = { t: Date.now(), v: d.rates }; } catch (e) {} return rates.v; }
const robotsCache = new Map();
async function allowedByRobots(u) {
  const url = new URL(u); let r = robotsCache.get(url.origin);
  if (!r || Date.now() - r.t > 864e5) {
    let txt = ''; try { const x = await fetch(url.origin + '/robots.txt', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) }); if (x.ok) txt = await x.text(); } catch (e) {}
    const dis = []; let on = false; txt.split(/\r?\n/).forEach(l => { const m = l.match(/^\s*(user-agent|disallow)\s*:\s*(.*?)\s*$/i); if (!m) return; if (m[1].toLowerCase() === 'user-agent') on = m[2] === '*' || /kifftech/i.test(m[2]); else if (on && m[2]) dis.push(m[2]); });
    r = { t: Date.now(), dis }; robotsCache.set(url.origin, r);
  }
  return !r.dis.some(d => (url.pathname + url.search).startsWith(d.replace(/\*.*$/, '')));
}
function extractOffer(html) {
  const out = { price: 0, cur: '', image: '' };
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const walk = n => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)) return n.forEach(walk);
    const t = [].concat(n['@type'] || []).join(',');
    if (/Product/i.test(t)) { if (!out.image && n.image) out.image = [].concat(typeof n.image === 'object' && !Array.isArray(n.image) ? n.image.url : n.image)[0] || '';
      [].concat(n.offers || []).forEach(o => { if (o && !out.price) { const p = +(o.price || (o.priceSpecification && o.priceSpecification.price) || o.lowPrice); if (p > 0) { out.price = p; out.cur = o.priceCurrency || (o.priceSpecification && o.priceSpecification.priceCurrency) || ''; } } }); }
    Object.values(n).forEach(v => typeof v === 'object' && walk(v)); };
  blocks.forEach(b => { try { walk(JSON.parse(b[1])); } catch (e) {} });
  if (!out.price) { const p = html.match(/property=["']product:price:amount["'][^>]*content=["']([\d.,]+)/i), c = html.match(/property=["']product:price:currency["'][^>]*content=["']([A-Z]{3})/i); if (p) { out.price = parseFloat(p[1].replace(',', '.')); out.cur = c ? c[1] : ''; } }
  if (!out.image) { const m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i); if (m) out.image = m[1]; }
  if (out.image && out.image.startsWith('//')) out.image = 'https:' + out.image;
  return out;
}
let syncing = false;
async function runSync() {
  if (syncing) throw fail(409, 'synchro déjà en cours'); syncing = true;
  try {
    const sources = load('sources.json', {}), R = await getRates(), cands = []; let checked = 0, found = 0;
    for (const [id, byC] of Object.entries(sources)) for (const [cc, u] of Object.entries(byC)) {
      if (!/^https:\/\//.test(u)) continue; checked++;
      const c = { id, country: cc, src: u, usd: 0, raw: '', image: '', checked: new Date().toISOString().slice(0, 10), applied: false };
      try {
        if (!(await allowedByRobots(u))) { c.raw = 'bloqué par robots.txt'; cands.push(c); continue; }
        const r = await fetch(u, { headers: { 'User-Agent': UA, 'Accept-Language': 'en,fr;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
        const html = (await r.text()).slice(0, 2e6), o = extractOffer(html);
        if (o.price > 0) { const rate = R[o.cur || 'USD']; if (rate) { c.usd = Math.round(o.price / rate * 100) / 100; c.raw = o.price + ' ' + (o.cur || 'USD'); } }
        if (o.image) c.image = o.image; if (c.usd || c.image) found++;
      } catch (e) { c.raw = 'erreur : ' + e.message; }
      cands.push(c); await new Promise(r => setTimeout(r, 1500));      // une requête / 1,5 s : poli
    }
    const st = { last: new Date().toISOString(), candidates: cands }; save('sync.json', st);
    if (AUTO_APPLY) cands.forEach(c => { try { applyCandidate(c.id, c.country, true); } catch (e) {} });
    return { checked, found, candidates: load('sync.json', st).candidates };
  } finally { syncing = false; }
}
function applyCandidate(id, cc, auto) {
  const st = load('sync.json', { candidates: [] }), c = st.candidates.find(x => x.id === String(id) && x.country === cc);
  if (!c) throw fail(404, 'candidat introuvable'); if (!c.usd && !(ALLOW_IMG && c.image)) throw fail(400, 'rien à appliquer');
  const cat = load('catalog.json', { items: {} }), it = cat.items[id] = cat.items[id] || {};
  if (c.usd) {
    const prev = (mergedCatalog()[id] || {}).official; const old = prev && prev[cc] ? prev[cc].usd : 0;
    if (auto && old && Math.abs(c.usd - old) / old > 0.4) throw fail(409, 'variation > 40 % : validation manuelle requise');
    it.official = Object.assign({}, it.official || {}, { [cc]: { usd: c.usd, src: c.src, checked: c.checked } });
  }
  if (ALLOW_IMG && c.image && /^https:\/\//.test(c.image)) it.photo = c.image;
  cat.updated = new Date().toISOString().slice(0, 10); save('catalog.json', cat);
  c.applied = true; save('sync.json', st);
}
function sanitizeCatalog(inp) {
  if (!inp || typeof inp.items !== 'object') throw fail(400, 'format attendu : {items:{...}}');
  const out = { updated: new Date().toISOString().slice(0, 10), items: {} };
  const url = u => (typeof u === 'string' && /^https:\/\/[^\s"'<>]{4,500}$/.test(u)) ? u : '';
  Object.entries(inp.items).slice(0, 500).forEach(([k, v]) => {
    if (!/^\d{1,6}$/.test(k) || !v || typeof v !== 'object') return; const o = {};
    if (typeof v.label === 'string') o.label = v.label.slice(0, 120);
    if (v.photo !== undefined) o.photo = url(v.photo);
    if (typeof v.video === 'string') o.video = /^[A-Za-z0-9_-]{11}$/.test(v.video) ? v.video : '';
    if (v.facts && typeof v.facts === 'object') { o.facts = {}; Object.entries(v.facts).forEach(([l, arr]) => { if (/^[a-z]{2}$/.test(l) && Array.isArray(arr)) o.facts[l] = arr.slice(0, 20).map(x => String(x).slice(0, 160)); }); }
    if (v.official && typeof v.official === 'object') { o.official = {}; Object.entries(v.official).forEach(([c, x]) => { if (!COUNTRIES[c] || !x || !url(x.src)) return; if (+x.amt > 0 && /^[A-Z]{3}$/.test(x.cur || '')) o.official[c] = { amt: +x.amt, cur: x.cur, src: x.src, checked: str(x.checked, 10) }; else if (+x.usd > 0) o.official[c] = { usd: +x.usd, src: x.src, checked: str(x.checked, 10) }; }); }
    if (typeof v.factsSrc === 'string') o.factsSrc = url(v.factsSrc);
    if (typeof v.photoSrc === 'string') o.photoSrc = str(v.photoSrc, 60);
    if (v.product && typeof v.product === 'object') { const pr = v.product, nn = {}; Object.entries(pr.n || {}).forEach(([l, t]) => { if (/^[a-z]{2}$/.test(l)) nn[l] = String(t).slice(0, 120); }); o.product = { ico: str(pr.ico, 8), brand: str(pr.brand, 40), n: nn, cat: ['smart', 'future', 'eng'].includes(pr.cat) ? pr.cat : 'smart', tags: (Array.isArray(pr.tags) ? pr.tags : []).slice(0, 6).map(t => String(t).slice(0, 30)), ref: Math.max(0, +pr.ref || 0) }; }
    if (v.ali && typeof v.ali === 'object') o.ali = { price: Math.max(0, +v.ali.price || 0), ship: Math.max(0, +v.ali.ship || 0), title: str(v.ali.title, 200), checked: str(v.ali.checked, 10), src: str(v.ali.src, 300) };
    if (v.proof && typeof v.proof === 'object') o.proof = { tested: str(v.proof.tested, 10), auth: str(v.proof.auth, 300), label: url(v.proof.label), gallery: (Array.isArray(v.proof.gallery) ? v.proof.gallery : []).map(url).filter(Boolean).slice(0, 12) };
    out.items[k] = o;
  });
  return out;
}

/* ---------- routes ---------- */
async function api(req, res, u) {
  const m = req.method, p = u.pathname, ip = ipOf(req);
  if (m === 'GET' && p === '/api/health') return send(res, 200, { ok: true });
  if (m === 'GET' && p === '/api/config') return send(res, 200, { paypalClientId: PP_ID, paypalServer: !!(PP_ID && PP_SECRET), vipPlans: false, syncAuto: AUTO_APPLY });
  if (m === 'GET' && p === '/api/countries') return send(res, 200, COUNTRIES, { 'Cache-Control': 'public, max-age=86400' });
  if (m === 'GET' && p === '/api/geo') return send(res, 200, await geo(req));
  if (m === 'GET' && p === '/api/demand') return send(res, 200, demand());
  if (m === 'POST' && p === '/api/leads') {
    if (limited('lead:' + ip, 10, 3600e3)) throw fail(429, 'trop de demandes');
    const b = await body(req), email = str(b.email, 160).toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw fail(400, 'e-mail invalide');
    const all = load('leads.json', []); if (!all.some(l => l.email === email)) { all.push({ created: new Date().toISOString(), email, country: str(b.country, 2).toUpperCase(), lang: str(b.lang, 2), source: str(b.source, 30) }); save('leads.json', all); }
    return send(res, 200, { ok: true });
  }
  if (m === 'POST' && p === '/api/orders') { const o = createOrder(await body(req), ip); return send(res, 200, { id: o.id, total_usd: o.total_usd, lines: o.lines.map(l => ({ id: l.id, q: l.q, unit: l.unit })), promo: o.promo }); }
  let mm;
  if (m === 'POST' && (mm = p.match(/^\/api\/orders\/([0-9a-f-]{36})\/paypal$/))) {
    const o = load('orders.json', []).find(x => x.id === mm[1]); if (!o || o.status !== 'pending') throw fail(404, 'commande introuvable');
    const d = await ppCall('POST', '/v2/checkout/orders', { intent: 'CAPTURE', purchase_units: [{ reference_id: o.id, custom_id: o.id, amount: { currency_code: 'USD', value: o.total_usd.toFixed(2) } }] });
    updOrder(o.id, x => { x.paypalId = d.id; }); return send(res, 200, { paypalId: d.id });
  }
  if (m === 'POST' && (mm = p.match(/^\/api\/orders\/([0-9a-f-]{36})\/capture$/))) {
    const b = await body(req), o = load('orders.json', []).find(x => x.id === mm[1]); if (!o || o.status !== 'pending' || !o.paypalId || o.paypalId !== str(b.paypalId, 40)) throw fail(400, 'paiement non reconnu');
    const d = await ppCall('POST', '/v2/checkout/orders/' + encodeURIComponent(o.paypalId) + '/capture', {});
    const cap = ((d.purchase_units || [])[0] || {}).payments; const c = cap && (cap.captures || [])[0];
    if (d.status !== 'COMPLETED' || !c || c.status !== 'COMPLETED' || c.amount.currency_code !== 'USD' || Math.abs(+c.amount.value - o.total_usd) > 0.005) throw fail(402, 'paiement incomplet ou montant différent');
    updOrder(o.id, x => { x.status = 'paid'; x.paidAt = new Date().toISOString(); x.captureId = c.id; }); return send(res, 200, { ok: true });
  }
  if (m === 'POST' && p === '/api/vip/redeem') {
    if (limited('vip:' + ip, 10, 3600e3)) throw fail(429, 'trop d\'essais');
    const b = await body(req), code = str(b.code, 40).toUpperCase(), v = load('vip.json', { codes: {}, tokens: {} }), c = v.codes[code];
    if (!c || c.used) throw fail(400, 'code invalide ou déjà utilisé');
    const token = crypto.randomBytes(24).toString('hex'); c.used = new Date().toISOString(); v.tokens[token] = { level: c.level, until: new Date(Date.now() + c.days * 864e5).toISOString() }; save('vip.json', v);
    return send(res, 200, { token, level: c.level, until: v.tokens[token].until });
  }
  if (m === 'GET' && p === '/api/vip/check') return send(res, 200, { level: vipLevelOf(str(u.searchParams.get('token'), 100)) });
  if (p.startsWith('/api/admin/')) {
    if (!isAdmin(req)) throw fail(401, 'non autorisé');
    if (m === 'GET' && p === '/api/admin/summary') { const o = load('orders.json', []), paid = o.filter(x => ['paid', 'ordered_supplier', 'shipped', 'delivered'].includes(x.status)); return send(res, 200, { orders: o.length, paid: paid.length, revenue: paid.reduce((a, x) => a + x.total_usd, 0), leads: load('leads.json', []).length, lastSync: load('sync.json', {}).last }); }
    if (m === 'GET' && p === '/api/admin/orders') return send(res, 200, { orders: load('orders.json', []).slice().reverse().slice(0, 300) });
    if (m === 'PATCH' && (mm = p.match(/^\/api\/admin\/orders\/([0-9a-f-]{36})$/))) { const b = await body(req); const ST = ['pending', 'paid', 'ordered_supplier', 'shipped', 'delivered', 'refunded', 'cancelled']; updOrder(mm[1], o => { if (b.status !== undefined) { if (!ST.includes(b.status)) throw fail(400, 'statut inconnu'); o.status = b.status; } if (b.tracking !== undefined) o.tracking = str(b.tracking, 80); }); return send(res, 200, { ok: true }); }
    if (m === 'GET' && p === '/api/admin/leads') return send(res, 200, { leads: load('leads.json', []).slice().reverse() });
    if (m === 'PUT' && p === '/api/admin/catalog') { save('catalog.json', sanitizeCatalog(await body(req, 1e6))); return send(res, 200, { ok: true }); }
    if (m === 'POST' && p === '/api/admin/vip') { const b = await body(req), lv = +b.level; if (![1, 2].includes(lv)) throw fail(400, 'niveau 1 ou 2'); const v = load('vip.json', { codes: {}, tokens: {} }), code = 'VIP-' + crypto.randomBytes(4).toString('hex').toUpperCase(); v.codes[code] = { level: lv, days: Math.min(366, Math.max(1, +b.days || 31)), used: '' }; save('vip.json', v); return send(res, 200, { code }); }
    if (m === 'POST' && p === '/api/admin/ingest') {                       // lit une page officielle pour le Studio (robots.txt respecté)
      const b = await body(req), u2 = str(b.url, 500); if (!/^https:\/\/[^\s]+$/.test(u2)) throw fail(400, 'URL https requise');
      if (!(await allowedByRobots(u2))) throw fail(403, 'cette page est interdite aux robots (robots.txt) : copie son code source dans le Studio');
      const r = await fetch(u2, { headers: { 'User-Agent': UA, 'Accept-Language': 'fr,en;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw fail(502, 'la page répond ' + r.status);
      return send(res, 200, { html: (await r.text()).slice(0, 600000) });
    }
    if (m === 'POST' && p === '/api/admin/sync') return send(res, 200, await runSync());
    if (m === 'POST' && p === '/api/admin/sync/apply') { const b = await body(req); applyCandidate(str(b.id, 10), str(b.country, 2).toUpperCase(), false); return send(res, 200, { ok: true }); }
  }
  throw fail(404, 'route inconnue');
}

const STATIC = { '/': 'index.html', '/index.html': 'index.html', '/sw.js': 'sw.js' };
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x'), p = u.pathname;
    Object.entries(SEC).forEach(([k, v]) => res.setHeader(k, v));
    if (p.startsWith('/api/')) return await api(req, res, u);
    if (req.method !== 'GET' && req.method !== 'HEAD') throw fail(405, 'méthode non autorisée');
    if (STATIC[p]) { const f = fs.readFileSync(path.join(ROOT, STATIC[p])); res.writeHead(200, { 'Content-Type': STATIC[p].endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }); return res.end(req.method === 'HEAD' ? undefined : f); }
    if (p === '/catalog.json') { const f = fs.readFileSync(fp('catalog.json')); res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' }); return res.end(f); }
    throw fail(404, 'introuvable');
  } catch (e) {
    const code = e.code && e.code >= 400 && e.code < 600 ? e.code : 500;
    if (code === 500) console.error(e);
    if (!res.headersSent) send(res, code, { error: code === 500 ? 'erreur serveur' : e.message });
  }
});

ctx = buildEngine();
getRates().then(r => ctx.__rates(r)).catch(() => {}); setInterval(() => getRates().then(r => ctx.__rates(r)).catch(() => {}), 12 * 3600e3).unref();
fs.watchFile(path.join(ROOT, 'index.html'), { interval: 2000 }, () => { try { ctx = buildEngine(); getRates().then(r => ctx.__rates(r)).catch(() => {}); console.log('moteur rechargé depuis index.html'); } catch (e) { console.error('moteur NON rechargé :', e.message); } }).unref();
const every = +process.env.SYNC_EVERY_HOURS || 0;
if (every > 0) setInterval(() => runSync().catch(e => console.error('sync:', e.message)), every * 3600e3).unref();
if (require.main === module) server.listen(PORT, () => console.log(`Kiff Tech : http://localhost:${PORT}  (données : ${DATA})`));
module.exports = { server, priceTable, createOrder, extractOffer, mergedCatalog, getCtx: () => ctx, getRates };
