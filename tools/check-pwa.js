#!/usr/bin/env node
/* ===== KiffTech PWA Validator ===== */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const ROOT = __dirname.replace('/tools', '');
let ok = 0, errors = 0, warnings = 0;

function log(msg, type = 'ok') {
  const icons = { ok: '✅', err: '❌', warn: '⚠️' };
  console.log(`${icons[type]} ${msg}`);
  if (type === 'ok') ok++;
  else if (type === 'err') errors++;
  else warnings++;
}

function checkFile(file, desc) {
  const p = path.join(ROOT, file);
  if (fs.existsSync(p)) log(`${desc}: ${file}`, 'ok');
  else log(`${desc} MANQUANT: ${file}`, 'err');
}

function checkJSON(file, requiredKeys) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return log(`${file} absent`, 'err');
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    log(`${file} JSON valide`, 'ok');
    for (const key of requiredKeys) {
      if (key in data) log(`  ${key} présent`, 'ok');
      else log(`  ${key} MANQUANT`, 'err');
    }
    return data;
  } catch (e) {
    log(`${file} JSON INVALIDE: ${e.message}`, 'err');
  }
}

function checkImage(file, expectedW, expectedH) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return log(`${file} absent`, 'err');
  try {
    const { Image } = require('canvas');
    const image = new Image();
    image.src = fs.readFileSync(p);
    if (image.width === expectedW && image.height === expectedH) {
      log(`${file} ${image.width}x${image.height}`, 'ok');
    } else {
      log(`${file} taille ${image.width}x${image.height} (attendu ${expectedW}x${expectedH})`, 'warn');
    }
  } catch (e) {
    log(`${file} lecture erreur: ${e.message}`, 'warn');
  }
}

console.log('\n🔍 Validation PWA KiffTech\n');

checkFile('index.html', 'HTML');
checkFile('style.css', 'CSS');
checkFile('app.js', 'JS Module');
checkFile('manifest.json', 'Manifest');
checkFile('sw.js', 'Service Worker');
checkFile('install.js', 'Install Handler');
checkFile('icons/icon-192.png', 'Icon 192');
checkFile('icons/icon-512.png', 'Icon 512');
checkFile('icons/maskable-512.png', 'Maskable 512');
checkFile('icons/apple-touch-icon.png', 'Apple Touch Icon');
checkFile('icons/favicon.ico', 'Favicon');

const manifest = checkJSON('manifest.json', [
  'name', 'short_name', 'description', 'start_url', 'scope', 'id',
  'display', 'orientation', 'background_color', 'theme_color', 'icons'
]);

if (manifest) {
  if (manifest.start_url === './') log('start_url = "./" (relatif)', 'ok'); else log('start_url doit être "./"', 'err');
  if (manifest.scope === './') log('scope = "./" (relatif)', 'ok'); else log('scope doit être "./"', 'err');
  if (manifest.id === './') log('id = "./" (relatif)', 'ok'); else log('id doit être "./"', 'err');
  if (manifest.display === 'standalone') log('display = standalone', 'ok'); else log('display doit être standalone', 'err');
  if (manifest.icons?.length >= 3) log(`Icons: ${manifest.icons.length}`, 'ok'); else log('Il faut au moins 3 icônes', 'err');
  const maskable = manifest.icons?.find(i => i.purpose?.includes('maskable'));
  if (maskable) log('Icône maskable présente', 'ok'); else log('Icône maskable manquante', 'warn');
  if (manifest.shortcuts?.length) log(`Shortcuts: ${manifest.shortcuts.length}`, 'ok');
}

checkImage('icons/icon-192.png', 192, 192);
checkImage('icons/icon-512.png', 512, 512);
checkImage('icons/maskable-512.png', 512, 512);
checkImage('icons/apple-touch-icon.png', 180, 180);

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const checks = [
  ['viewport', /viewport.*width=device-width/],
  ['theme-color', /theme-color.*#03050a/],
  ['manifest link', /rel="manifest".*href="\.\/manifest\.json"/],
  ['apple-mobile-web-app-capable', /apple-mobile-web-app-capable.*yes/],
  ['apple-touch-icon', /rel="apple-touch-icon"/],
  ['noscript', /<noscript>/],
  ['script module app.js', /type="module".*src="\.\/app\.js"/],
  ['script install.js', /src="\.\/install\.js"/],
  ['splash', /id="splash"/],
  ['main-tabs', /id="mainTabs"/],
  ['products-grid', /id="productsGrid"/],
  ['bottom-tabs', /id="bottomTabs"/],
  ['Aucun chemin absolu', !/href="\//.test(html) && !/src="\//.test(html)],
];
checks.forEach(([name, regex]) => {
  if (regex instanceof RegExp) regex.test(html) ? log(`HTML: ${name}`, 'ok') : log(`HTML: ${name} MANQUANT`, 'err');
  else regex ? log(`HTML: ${name}`, 'ok') : log(`HTML: ${name} MANQUANT`, 'err');
});

const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
['skipWaiting', 'clients.claim', 'caches.keys', 'fetch(', 'PRECACHE_ASSETS'].forEach(k => {
  sw.includes(k) ? log(`SW: ${k}`, 'ok') : log(`SW: ${k} MANQUANT`, 'err');
});

const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
['100dvh', 'safe-area-inset', 'prefers-reduced-motion', '@media (max-width:480px)', '@media (min-width:720px)'].forEach(k => {
  css.includes(k) ? log(`CSS: ${k}`, 'ok') : log(`CSS: ${k} MANQUANT`, 'warn');
});

const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
['DEMO_PRODUCTS', 'DEMO_SUPPLIERS', 'switchTab', 'applyFilters', 'renderProducts', 'subscribe', 'exportCatalog', 'registerSW', 'setupInstallPrompt', 'bioParticles'].forEach(k => {
  js.includes(k) ? log(`JS: ${k}`, 'ok') : log(`JS: ${k} MANQUANT`, 'err');
});

console.log('\n==================================================');
console.log(`📊 RÉSUMÉ`);
console.log('==================================================');
console.log(`✅ OK:      ${ok}`);
console.log(`❌ ERREURS: ${errors}`);
console.log(`⚠️ ATTENTION: ${warnings}`);
if (errors === 0) console.log('\n✅ SUCCÈS: PWA conforme !');
else console.log('\n❌ ÉCHEC: corrections nécessaires');
process.exit(errors > 0 ? 1 : 0);