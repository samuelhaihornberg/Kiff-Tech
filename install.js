/* ===== KiffTech Install Handler ===== */

(()=>{
  let deferredPrompt=null;
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;});
  window.addEventListener('appinstalled',()=>{deferredPrompt=null;});

  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(window.swUpdated) return;window.swUpdated=true;showUpdateBanner();});
    navigator.serviceWorker.register('./sw.js').then(reg=>{reg.addEventListener('updatefound',()=>{const nw=reg.installing;nw?.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller) showUpdateBanner();});});});
  }

  function showUpdateBanner(){
    const banner=document.createElement('div');
    banner.style.cssText='position:fixed;bottom:calc(var(--bottom-bar-h)+1rem+var(--safe-bottom));left:50%;transform:translateX(-50%);z-index:2000;background:var(--bg-card);border:1px solid var(--accent);border-radius:var(--radius-md);padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 0 24px var(--accent-glow)';
    banner.innerHTML='<span>Nouvelle version disponible</span><button style="padding:.4rem .8rem;border-radius:var(--radius-sm);background:var(--accent);color:#03050a;border:none;font-weight:700;cursor:pointer" onclick="location.reload()">Recharger</button>';
    document.body.appendChild(banner);
  }

  if(isStandalone) return;
})();