/* ===== KiffTech Service Worker v1 ===== */

const CACHE_NAME='kifftech-v1';
const PRECACHE_ASSETS=[
  './','./index.html','./style.css','./app.js','./manifest.json','./install.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return;
  const isNav=e.request.mode==='navigate';
  const isAsset=['style','script','image','font'].includes(e.request.destination);

  if(isNav){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE_NAME).then(ca=>ca.put(e.request,c));}return r;}).catch(()=>caches.match('./index.html')));
    return;
  }

  if(isAsset){
    e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE_NAME).then(ca=>ca.put(e.request,c));}return r;})));
    return;
  }

  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});

self.addEventListener('message',e=>{
  if(e.data?.type==='PRECACHE_ALL'){
    caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE_ASSETS));
  }
});