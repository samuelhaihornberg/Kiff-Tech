#!/usr/bin/env node
/* ============================================================================
   KIFF TECH — référencement automatique (zéro dépendance)
   Génère, à partir de index.html (+ catalog.json) :
     p/<id>-<nom>-<langue>.html   une page indexable par produit et par langue (JSON-LD Product, hreflang, Open Graph)
     sitemap.xml · robots.txt
     feed/feed-<PAYS>.xml          flux Google Merchant Center (annonces gratuites / Shopping), produits AVEC photo uniquement
     social/posts.md               une publication prête par produit (tu publies, rien n'est posté seul)
   Utilisation : SITE_URL=https://ton-site node seo.js     (lancé chaque nuit par .github/workflows/seo.yml)
   Il n'invente rien : pas de photo => pas d'image ; pas de prix officiel vérifié => aucune "économie" annoncée.
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
const ROOT = __dirname, OUT = process.env.OUT_DIR || ROOT;
const SITE = (process.env.SITE_URL || '').replace(/\/+$/, '');
if (!/^https?:\/\//.test(SITE)) { console.error('SITE_URL manquant (ex. https://samuelhaihornberg.github.io)'); process.exit(1); }
const LANGS = ['fr', 'en', 'he', 'ar', 'es'], RTL = { he: 1, ar: 1 };
const FEED = (process.env.FEED_COUNTRIES || 'IL,FR,US,GB').split(',').map(s => s.trim().toUpperCase());
const FEED_LANG = { IL: 'he', FR: 'fr', US: 'en', GB: 'en' };
const UI = {
  fr: { shop: 'Voir dans la boutique', price: 'Prix tout compris (taxes, paiement et livraison inclus) affiché au panier selon ton pays.', specs: 'Caractéristiques', src: 'Source des caractéristiques', slogan: 'Become whatever you want ! 👍😁👍', from: 'Prix de référence' },
  en: { shop: 'View in the shop', price: 'All-inclusive price (taxes, payment fees and shipping included) shown at checkout for your country.', specs: 'Specifications', src: 'Specs source', slogan: 'Become whatever you want ! 👍😁👍', from: 'Reference price' },
  he: { shop: 'לצפייה בחנות', price: 'המחיר הסופי (כולל מסים, עמלות תשלום ומשלוח) מוצג בקופה לפי המדינה שלך.', specs: 'מפרט', src: 'מקור המפרט', slogan: 'Become whatever you want ! 👍😁👍', from: 'מחיר ייחוס' },
  ar: { shop: 'عرض في المتجر', price: 'السعر النهائي (شامل الضرائب ورسوم الدفع والشحن) يظهر عند الدفع حسب بلدك.', specs: 'المواصفات', src: 'مصدر المواصفات', slogan: 'Become whatever you want ! 👍😁👍', from: 'سعر مرجعي' },
  es: { shop: 'Ver en la tienda', price: 'Precio final (impuestos, pago y envío incluidos) visible en la caja según tu país.', specs: 'Características', src: 'Fuente de las características', slogan: 'Become whatever you want ! 👍😁👍', from: 'Precio de referencia' }
};

/* ---- environnement temporaire pour réutiliser EXACTEMENT le moteur de prix de index.html ---- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kt-seo-'));
const world = (html.match(/const WORLD='([^']+)'/) || [])[1] || '';
const countries = {}; world.split(',').forEach(x => { const a = x.split(':'); if (a[0]) countries[a[0]] = { cur: a[1], vat: +a[2] }; });
fs.writeFileSync(path.join(tmp, 'countries.json'), JSON.stringify(countries));
const rootCat = path.join(ROOT, 'catalog.json');
if (fs.existsSync(rootCat)) fs.copyFileSync(rootCat, path.join(tmp, 'catalog.json'));
process.env.DATA_DIR = tmp; process.env.ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'seo-build';
const S = require('./server.js');

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = o => JSON.stringify(o).replace(/</g, '\\u003c');
const slug = s => String(s).normalize('NFKD').replace(/[^\x00-\x7F]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'produit';
const rm = d => { try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) {} };
const write = (rel, txt) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };

(async () => {
  const rates = await S.getRates(), ctx = S.getCtx();
  /* ---- prix par pays ---- */
  const byCountry = {};
  for (const cc of FEED) {
    S.priceTable(cc, 0);
    byCountry[cc] = JSON.parse(vm.runInContext(`JSON.stringify(PRODUCTS.map(p=>({id:p.id,ok:p.e.ok&&(!p.real||p.e.vcost),price:userPrice(p),ref:p.e.ref,vref:p.e.vref,cur:COUNTRIES[country].cur})))`, ctx));
  }
  const prods = JSON.parse(vm.runInContext(`JSON.stringify(PRODUCTS.map(p=>({id:p.id,brand:p.brand,cat:p.cat,n:p.n,tags:p.tags})))`, ctx));
  const cat = S.mergedCatalog();
  const rows = prods.map(p => {
    const c = cat[p.id] || {}, per = {};
    FEED.forEach(cc => { const r = byCountry[cc].find(x => x.id === p.id); if (r && r.ok) per[cc] = r; });
    return Object.assign(p, { c, per });
  }).filter(p => Object.keys(p.per).length);
  const nameOf = (p, l) => (p.n[l] || p.n.en || p.n.fr || ('#' + p.id));
  const factsOf = (p, l) => ((p.c.facts && (p.c.facts[l] || p.c.facts.en || p.c.facts.fr)) || []).slice(0, 12);
  const urlOf = (p, l) => `${SITE}/p/${p.id}-${slug(p.n.en || p.n.fr || p.id)}-${l}.html`;
  const baseline = p => { const cc = FEED.find(k => p.per[k]); return { cc, r: p.per[cc], usd: Math.round(p.per[cc].price * 100) / 100 }; };

  /* ---- pages produit ---- */
  rm(path.join(OUT, 'p'));
  let pages = 0;
  for (const p of rows) for (const l of LANGS) {
    const name = nameOf(p, l), facts = factsOf(p, l), b = baseline(p), u = UI[l], url = urlOf(p, l);
    const desc = ((facts.length ? name + ' — ' + facts.slice(0, 4).join(' · ') : name + ' — ' + p.brand) + ' | Kiff Tech').slice(0, 300);
    const ld = { '@context': 'https://schema.org', '@type': 'Product', name, brand: { '@type': 'Brand', name: p.brand }, description: desc, sku: 'KT-' + p.id, url,
      offers: { '@type': 'Offer', url: `${SITE}/index.html#p=${p.id}`, price: b.usd.toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition' } };
    if (p.c.photo) ld.image = [p.c.photo];
    const alts = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${esc(urlOf(p, x))}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${esc(urlOf(p, 'en'))}">`;
    write(`p/${p.id}-${slug(p.n.en || p.n.fr || p.id)}-${l}.html`, `<!doctype html>
<html lang="${l}" dir="${RTL[l] ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(name)} – Kiff Tech</title>
<meta name="description" content="${esc(desc.slice(0, 155))}">
<link rel="canonical" href="${esc(url)}">
${alts}
<meta property="og:type" content="product"><meta property="og:title" content="${esc(name)} – Kiff Tech"><meta property="og:description" content="${esc(desc.slice(0, 155))}"><meta property="og:url" content="${esc(url)}">${p.c.photo ? `<meta property="og:image" content="${esc(p.c.photo)}">` : ''}
<meta name="twitter:card" content="${p.c.photo ? 'summary_large_image' : 'summary'}">
<script type="application/ld+json">${jsonLd(ld)}</script>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:16px;background:#fff7ed;color:#1f1535}a.b{display:inline-block;background:#7c3aed;color:#fff;padding:10px 18px;border-radius:99px;text-decoration:none;font-weight:700}img{max-width:100%;border-radius:14px}li{margin:4px 0}small{color:#6b5f86}</style></head>
<body><header><a href="${esc(SITE)}/index.html" style="text-decoration:none;color:#7c3aed;font-weight:800">Kiff Tech</a> <small>${esc(u.slogan)}</small></header>
<main><h1>${esc(name)}</h1>${p.c.photo ? `<p><img src="${esc(p.c.photo)}" alt="${esc(name)}" loading="lazy">${p.c.photoSrc ? `<br><small>${esc(p.c.photoSrc)}</small>` : ''}</p>` : ''}
<p><b>${esc(p.brand)}</b> · ${esc(u.from)} : $${b.usd.toFixed(2)}</p><p><small>${esc(u.price)}</small></p>
${facts.length ? `<h2>${esc(u.specs)}</h2><ul>${facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>${p.c.factsSrc ? `<p><small>${esc(u.src)} : <a href="${esc(p.c.factsSrc)}" rel="noopener noreferrer">${esc(new URL(p.c.factsSrc).hostname)}</a></small></p>` : ''}` : ''}
<p><a class="b" href="${esc(SITE)}/index.html#p=${p.id}">${esc(u.shop)}</a></p></main></body></html>`);
    pages++;
  }

  /* ---- sitemap + robots ---- */
  const today = new Date().toISOString().slice(0, 10);
  const smap = [`<url><loc>${esc(SITE)}/</loc><lastmod>${today}</lastmod></url>`].concat(rows.flatMap(p => LANGS.map(l => `<url><loc>${esc(urlOf(p, l))}</loc><lastmod>${today}</lastmod>${LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${esc(urlOf(p, x))}"/>`).join('')}</url>`)));
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${smap.join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

  /* ---- flux Google Merchant (une photo est obligatoire) ---- */
  rm(path.join(OUT, 'feed'));
  const feedInfo = [];
  for (const cc of FEED) {
    const cur = (countries[cc] || {}).cur, rate = rates[cur]; if (!rate) { console.warn('flux', cc, ': taux', cur, 'indisponible, ignoré'); continue; }
    const l = FEED_LANG[cc] || 'en';
    const items = rows.filter(p => p.per[cc] && p.c.photo).map(p => { const r = p.per[cc], price = (r.price * rate).toFixed(2);
      return `<item><g:id>KT-${p.id}</g:id><title>${esc(nameOf(p, l))}</title><description>${esc((factsOf(p, l).slice(0, 5).join(' · ') || nameOf(p, l)).slice(0, 4900))}</description><link>${esc(urlOf(p, l))}</link><g:image_link>${esc(p.c.photo)}</g:image_link><g:availability>in stock</g:availability><g:condition>new</g:condition><g:price>${price} ${cur}</g:price><g:brand>${esc(p.brand)}</g:brand><g:identifier_exists>no</g:identifier_exists></item>`; });
    write(`feed/feed-${cc}.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Kiff Tech ${cc}</title><link>${esc(SITE)}</link><description>Kiff Tech</description>\n${items.join('\n')}\n</channel></rss>\n`);
    feedInfo.push(`${cc}: ${items.length} produit(s) avec photo`);
  }

  /* ---- publications prêtes (tu publies toi-même) ---- */
  const posts = rows.map(p => { const b = baseline(p), vr = b.r.vref && b.r.ref > b.r.price, save = vr ? Math.round((1 - b.r.price / b.r.ref) * 100) : 0;
    const tags = ['#KiffTech', '#smarttech', '#' + p.brand.replace(/\W/g, '')].join(' ');
    return `## ${nameOf(p, 'fr')}\n**FR** : ${nameOf(p, 'fr')} — ${vr ? `-${save} % vs prix officiel (US)` : 'prix tout compris'} 😁 ${urlOf(p, 'fr')} ${tags}\n\n**EN** : ${nameOf(p, 'en')} — ${vr ? `${save}% under the official price (US)` : 'all-inclusive price'} 😁 ${urlOf(p, 'en')} ${tags}\n`; });
  write('social/posts.md', `# Publications prêtes (générées ${today})\nCopie-colle sur Instagram / TikTok / Facebook / X. Rien n'est publié automatiquement.\n\n${posts.join('\n')}`);

  console.log(`SEO : ${rows.length} produit(s) en ligne, ${pages} page(s), sitemap.xml, robots.txt, flux [${feedInfo.join(' | ') || 'aucun'}], ${posts.length} publication(s).`);
  rm(tmp); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
