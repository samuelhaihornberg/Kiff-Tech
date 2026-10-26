/* ===== KiffTech — Bioluminescent Dropshipping SPA ===== */

// ---------- DEMO DATA (not real) ----------
const DEMO_CATEGORIES = [
  'Smartphones','Audio','Wearables','Smart Home','Computing','Gaming','Accessories','Photography'
];

const DEMO_SUPPLIERS = [
  {id:'techdata',name:'TechData Europe',type:'api',status:'active',color:'#0066ff'},
  {id:'ingram',name:'Ingram Micro',type:'csv',status:'active',color:'#00ffc8'},
  {id:'also',name:'ALSO Holding',type:'xml',status:'paused',color:'#b84dff'},
  {id:'tdsynnex',name:'TD SYNNEX',type:'api',status:'active',color:'#ff6b00'},
];

function generateDemoProducts(count=120){
  const products=[];
  const brands=['Samsung','Xiaomi','Apple','Sony','LG','ASUS','MSI','Logitech','Razer','DJI','GoPro','Anker'];
  const prefixes=['Galaxy','Redmi','iPhone','Xperia','Gram','ROG','Legion','G Pro','Viper','Mavic','Hero','PowerCore'];
  const suffixes=['Pro','Ultra','Max','Plus','Lite','SE','FE','Neo','Edge','Fold','Flip'];
  
  for(let i=0;i<count;i++){
    const brand=brands[Math.floor(Math.random()*brands.length)];
    const prefix=prefixes[Math.floor(Math.random()*prefixes.length)];
    const suffix=suffixes[Math.floor(Math.random()*suffixes.length)];
    const category=DEMO_CATEGORIES[Math.floor(Math.random()*DEMO_CATEGORIES.length)];
    const supplier=DEMO_SUPPLIERS[Math.floor(Math.random()*DEMO_SUPPLIERS.length)];
    
    const basePrice=Math.round((50+Math.random()*1200)*100)/100;
    const refPrice=Math.round(basePrice*(1.15+Math.random()*0.4)*100)/100;
    const discount=Math.round((basePrice/refPrice-1)*-100);
    const stock=Math.random()>.15?Math.floor(Math.random()*500):0;
    
    products.push({
      id:`KT-${String(i+1).padStart(5,'0')}`,
      title:`${brand} ${prefix} ${suffix}`,
      category,
      supplier:supplier.id,
      supplierName:supplier.name,
      price:basePrice,
      refPrice,
      discount,
      stock,
      image:`https://picsum.photos/seed/${encodeURIComponent(brand+prefix+suffix+i)}/400/400.jpg`,
      specs:{
        'Écran':['6.1"','6.5"','6.7"','6.9"','13"','15.6"','27"','32"'][Math.floor(Math.random()*8)],
        'Stockage':['128GB','256GB','512GB','1TB','2TB'][Math.floor(Math.random()*5)],
        'RAM':['6GB','8GB','12GB','16GB','32GB'][Math.floor(Math.random()*5)],
        'Processeur':['Snapdragon 8 Gen 3','Dimensity 9300','A17 Pro','M3','Ryzen 9 7940HS','Intel Core Ultra 7'][Math.floor(Math.random()*6)],
        'Batterie':['4500mAh','5000mAh','5500mAh','80Wh','99Wh'][Math.floor(Math.random()*5)],
        'OS':['Android 14','iOS 17','Windows 11','macOS Sonoma'][Math.floor(Math.random()*4)]
      },
      tags:discount>20?['promo']:stock===0?['rupture']:i<5?['nouveau']:[],
      description:`${brand} ${prefix} ${suffix} — ${category}. Prix fournisseur vérifié, marge configurable. Stock temps réel depuis ${supplier.name}.`
    });
  }
  return products.sort((a,b)=>b.price-a.price);
}

const DEMO_PRODUCTS = generateDemoProducts(120);

// ---------- UTILITIES ----------
function sanitizeHTML(str){const div=document.createElement('div');div.textContent=str;return div.innerHTML;}
function formatPrice(val,currency='€'){return val.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+currency;}
function formatDiscount(pct){return pct>0?`-${pct}%`:'';}
function debounce(fn,ms){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};}

// ---------- STATE ----------
const state={
  products:DEMO_PRODUCTS,
  filteredProducts:[],
  currentCategory:'',
  currentSupplier:'',
  currentSearch:'',
  visibleCount:24,
  currentProduct:null,
  currentTab:'catalog',
  subscription:null, // 'basic' | 'tresor' | null
  importSources:[
    {id:'techdata',name:'TechData Europe',type:'api',status:'active',cron:'0 6 * * *',enabled:true,mapping:{sku:'SKU',title:'ProductName',price:'Price',stock:'Qty',category:'Category'}},
    {id:'ingram',name:'Ingram Micro',type:'csv',status:'active',cron:'0 7 * * *',enabled:true,mapping:{sku:'ItemID',title:'Description',price:'Cost',stock:'Available',category:'Cat'}},
    {id:'also',name:'ALSO Holding',type:'xml',status:'paused',cron:'',enabled:false,mapping:{}},
    {id:'tdsynnex',name:'TD SYNNEX',type:'api',status:'active',cron:'0 5 * * *',enabled:true,mapping:{sku:'PartNumber',title:'Name',price:'DealerPrice',stock:'StockLevel',category:'Group'}},
  ],
  schedules:[],
  mappings:{globalDiscount:10,targetMargin:35,autoPriceUpdate:true,verifyRefPrice:true},
  cart:[],
  toastQueue:[],
};

// ---------- MAIN CLASS ----------
class KiffTech{
  constructor(){
    this.tabs=['catalog','product','subscriptions','import','settings'];
    this.tabLabels={catalog:'Catalogue',product:'Produit',subscriptions:'Abonnements',import:'Import',settings:'Réglages'};
    this.tabIcons={
      catalog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><line x1="4" y1="6" x2="4" y2="18"/><line x1="20" y1="6" x2="20" y2="18"/></svg>',
      product:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9"/><path d="M11 7v10"/><path d="M18 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/></svg>',
      subscriptions:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      import:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
      settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    };

    this.mainTabs=document.getElementById('mainTabs');
    this.bottomTabs=document.getElementById('bottomTabs');
    this.productsGrid=document.getElementById('productsGrid');
    this.loadMore=document.getElementById('loadMore');
    this.categoryFilter=document.getElementById('categoryFilter');
    this.supplierFilter=document.getElementById('supplierFilter');
    this.searchInput=document.getElementById('searchInput');
    this.productDetail=document.getElementById('productDetail');
    this.cartCount=document.getElementById('cartCount');
    this.importSources=document.getElementById('importSources');
    this.scheduleList=document.getElementById('scheduleList');
    this.mappingsTable=document.getElementById('mappingsTable');
    this.currentSub=document.getElementById('currentSub');
    this.subActions=document.getElementById('subActions');
    this.globalDiscount=document.getElementById('globalDiscount');
    this.globalDiscountVal=document.getElementById('globalDiscountVal');
    this.targetMargin=document.getElementById('targetMargin');
    this.targetMarginVal=document.getElementById('targetMarginVal');
    this.autoPriceUpdate=document.getElementById('autoPriceUpdate');
    this.verifyRefPrice=document.getElementById('verifyRefPrice');
    this.exportCSV=document.getElementById('exportCSV');
    this.exportJSON=document.getElementById('exportJSON');
    this.importCSV=document.getElementById('importCSV');
    this.csvImportInput=document.getElementById('csvImportInput');
    this.addSourceBtn=document.getElementById('addSourceBtn');
    this.addScheduleBtn=document.getElementById('addScheduleBtn');
    this.modal=document.getElementById('productModal');
    this.modalBody=document.getElementById('modalBody');
    this.toastContainer=document.getElementById('toastContainer');
    this.splashBar=document.getElementById('splashBar');
    this.splashText=document.getElementById('splashText');

    this.init();
  }

  init(){
    this.setProgress(10,'Initialisation…');
    this.buildTabs();
    this.bindEvents();
    this.populateFilters();
    this.applyFilters();
    this.renderImportSources();
    this.renderSchedules();
    this.renderMappings();
    this.updateSubscriptionUI();
    this.initBioParticles();
    this.registerSW();
    this.setupInstallPrompt();

    if(document.readyState==='complete') this.onLoaded();
    else window.addEventListener('load',()=>this.onLoaded());
  }

  onLoaded(){
    this.animateProgress(100,'Prêt',()=>{this.hideSplash();});
  }

  // ---------- PROGRESS ----------
  setProgress(pct,text){this.splashBar.style.width=pct+'%';this.splashText.textContent=text;}
  animateProgress(target,text,cb){let cur=parseInt(this.splashBar.style.width)||0;const step=()=>{if(cur<target){cur=Math.min(target,cur+3);this.setProgress(cur,text);requestAnimationFrame(()=>setTimeout(step,20));}else if(cb)cb();};step();}
  hideSplash(){document.getElementById('splash').classList.add('hidden');}

  // ---------- TABS ----------
  buildTabs(){
    const tabsHTML=this.tabs.map((t,i)=>`<button class="main-tab" role="tab" aria-selected="${i===0}" data-tab="${t}">${this.tabLabels[t]}</button>`).join('');
    this.mainTabs.innerHTML=tabsHTML;
    this.mainTabs.querySelectorAll('.main-tab').forEach(btn=>btn.addEventListener('click',()=>this.switchTab(btn.dataset.tab)));

    const bottomHTML=this.tabs.map((t,i)=>`<button class="bottom-tab" role="tab" aria-selected="${i===0}" data-tab="${t}">${this.tabIcons[t]}<span>${this.tabLabels[t]}</span></button>`).join('');
    this.bottomTabs.innerHTML=bottomHTML;
    this.bottomTabs.querySelectorAll('.bottom-tab').forEach(btn=>btn.addEventListener('click',()=>this.switchTab(btn.dataset.tab)));
  }

  switchTab(tab){
    if(tab==='product' && !state.currentProduct){this.showToast('Sélectionnez un produit','error');return;}
    state.currentTab=tab;
    document.querySelectorAll('.panel').forEach(p=>p.hidden=true);
    document.getElementById(`panel-${tab}`).hidden=false;
    document.querySelectorAll('[role="tab"]').forEach(btn=>{btn.setAttribute('aria-selected',btn.dataset.tab===tab);});
    if(tab==='product') this.renderProductDetail();
    if(tab==='import' && state.subscription!=='tresor') this.addScheduleBtn.disabled=true;
    else this.addScheduleBtn.disabled=false;
  }

  // ---------- FILTERS ----------
  populateFilters(){
    this.categoryFilter.innerHTML='<option value="">Toutes catégories</option>'+DEMO_CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join('');
    this.supplierFilter.innerHTML='<option value="">Tous fournisseurs</option>'+DEMO_SUPPLIERS.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  }

  applyFilters=debounce(()=>{
    state.currentCategory=this.categoryFilter.value;
    state.currentSupplier=this.supplierFilter.value;
    state.currentSearch=this.searchInput.value.toLowerCase();
    state.visibleCount=24;

    state.filteredProducts=state.products.filter(p=>{
      if(state.currentCategory && p.category!==state.currentCategory) return false;
      if(state.currentSupplier && p.supplier!==state.currentSupplier) return false;
      if(state.currentSearch && !p.title.toLowerCase().includes(state.currentSearch) && !p.description.toLowerCase().includes(state.currentSearch)) return false;
      return true;
    });
    this.renderProducts();
  },150);

  renderProducts(){
    const toShow=state.filteredProducts.slice(0,state.visibleCount);
    this.productsGrid.innerHTML=toShow.map(p=>this.productCardHTML(p)).join('');
    this.loadMore.hidden=state.visibleCount>=state.filteredProducts.length;

    this.productsGrid.querySelectorAll('.product-card').forEach(card=>{
      card.addEventListener('click',()=>this.openProduct(card.dataset.id));
      card.querySelector('.product-action').addEventListener('click',(e)=>{e.stopPropagation();this.addToCart(card.dataset.id);});
    });
  }

  productCardHTML(p){
    const badge=p.tags.includes('nouveau')?'<span class="product-badge badge-new">Nouveau</span>':p.tags.includes('promo')?'<span class="product-badge badge-promo">Promo</span>':p.tags.includes('rupture')?'<span class="product-badge badge-stock">Rupture</span>':'';
    const ref=formatPrice(p.refPrice);
    const disc=formatDiscount(p.discount);
    return `<article class="product-card" data-id="${p.id}" role="listitem">
      <div class="product-thumb" style="background-image:url('${p.image}')">${badge}</div>
      <div class="product-info">
        <h3 class="product-title">${sanitizeHTML(p.title)}</h3>
        <div class="product-meta">
          <span class="product-supplier">${sanitizeHTML(p.supplierName)}</span>
          <span class="product-category">${sanitizeHTML(p.category)}</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(p.price)}</span>
          ${p.refPrice>p.price?`<span class="product-ref-price">${ref}</span><span class="product-discount">${disc}</span>`:''}
        </div>
        <button class="product-action" type="button" ${p.stock===0?'disabled':''}>${p.stock===0?'Rupture':'Ajouter'}</button>
      </div>
    </article>`;
  }

  loadMoreProducts(){
    state.visibleCount+=24;
    this.renderProducts();
  }

  // ---------- PRODUCT DETAIL ----------
  openProduct(id){
    state.currentProduct=state.products.find(p=>p.id===id);
    if(state.currentProduct) this.switchTab('product');
  }

  renderProductDetail(){
    if(!state.currentProduct){this.productDetail.innerHTML='<p class="empty">Aucun produit sélectionné</p>';return;}
    const p=state.currentProduct;
    const specsHTML=Object.entries(p.specs).map(([k,v])=>`<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('');
    this.productDetail.innerHTML=`
      <div class="detail-header">
        <div class="detail-thumb" style="background-image:url('${p.image}')"></div>
        <div class="detail-meta">
          <h2 class="detail-title">${sanitizeHTML(p.title)}</h2>
          <span class="detail-supplier">${sanitizeHTML(p.supplierName)}</span>
          <span class="detail-category">${sanitizeHTML(p.category)}</span>
          <div class="detail-price-row">
            <span class="detail-price">${formatPrice(p.price)}</span>
            ${p.refPrice>p.price?`<span class="detail-ref-price">${formatPrice(p.refPrice)}</span><span class="detail-discount">${formatDiscount(p.discount)}</span>`:''}
          </div>
        </div>
      </div>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs">
        <h4>Spécifications</h4>
        <div class="specs-grid">${specsHTML}</div>
      </div>
      <div class="detail-actions">
        <button class="btn-secondary" onclick="window.keffTech.addToCart('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ${p.stock===0?'Rupture de stock':'Ajouter au panier'}</button>
        <button class="btn-secondary" onclick="window.keffTech.openModal('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Détails</button>
      </div>`;
  }

  // ---------- MODAL ----------
  openModal(id){
    const p=state.products.find(x=>x.id===id);
    if(!p) return;
    this.modalBody.innerHTML=`
      <h3>${sanitizeHTML(p.title)}</h3>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs" style="margin-top:1rem">
        <h4>Spécifications complètes</h4>
        <div class="specs-grid">${Object.entries(p.specs).map(([k,v])=>`<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('')}</div>
      </div>
      <div class="detail-actions" style="margin-top:1.5rem">
        <button class="btn-primary" onclick="window.keffTech.addToCart('${p.id}');window.keffTech.closeModal()">${p.stock===0?'Rupture':'Ajouter au panier'}</button>
      </div>`;
    this.modal.hidden=false;
    document.body.style.overflow='hidden';
  }
  closeModal(){this.modal.hidden=true;document.body.style.overflow='';}

  // ---------- CART ----------
  addToCart(id){
    const p=state.products.find(x=>x.id===id);
    if(!p || p.stock===0) return;
    const existing=state.cart.find(i=>i.id===id);
    if(existing) existing.qty++;
    else state.cart.push({...p,qty:1});
    this.updateCartCount();
    this.showToast(`${p.title} ajouté au panier`,'success');
  }
  updateCartCount(){const total=state.cart.reduce((s,i)=>s+i.qty,0);this.cartCount.textContent=total;}
  getCartTotal(){return state.cart.reduce((s,i)=>s+i.price*i.qty,0);}

  // ---------- IMPORT ----------
  renderImportSources(){
    this.importSources.innerHTML=state.importSources.map(s=>`
      <div class="import-source">
        <div class="source-info">
          <div class="source-icon ${s.type}">${this.sourceIcon(s.type)}</div>
          <div><div class="source-name">${sanitizeHTML(s.name)}</div><span class="source-status status-${s.status}">${s.status==='active'?'Actif':'En pause'}</span></div>
        </div>
        <div class="source-actions">
          <button class="icon-btn-sm" onclick="window.keffTech.toggleSource('${s.id}')" aria-label="${s.status==='active'?'Pause':'Activer'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${s.status==='active'?'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>':'<polygon points="5 3 19 12 5 21 5 3"/>'}</svg></button>
          <button class="icon-btn-sm" onclick="window.keffTech.editSource('${s.id}')" aria-label="Configurer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
        </div>
      </div>
    `).join('');
  }
  sourceIcon(type){const icons={csv:'📄',xml:'📋',json:'{ }',api:'🔌'};return icons[type]||'📦';}
  toggleSource(id){const s=state.importSources.find(x=>x.id===id);if(s){s.status=s.status==='active'?'paused':'active';this.renderImportSources();this.showToast(`${s.name} ${s.status==='active'?'activé':'mis en pause'}`,'success');}}
  editSource(id){this.showToast(`Édition de ${id} — démo seulement`);}

  renderSchedules(){
    this.scheduleList.innerHTML=state.schedules.map((sch,i)=>`<div class="schedule-item ${sch.enabled?'enabled':''}"><div class="schedule-info"><span class="schedule-cron">${sanitizeHTML(sch.cron)}</span><span class="schedule-next">Prochain: ${sanitizeHTML(sch.next)}</span></div><input type="checkbox" class="schedule-toggle" ${sch.enabled?'checked':''} onchange="window.keffTech.toggleSchedule(${i})"></div>`).join('');
  }
  renderMappings(){
    const fields=['sku','title','price','stock','category'];
    this.mappingsTable.innerHTML=`<table><thead><tr><th>Champ catalogue</th><th>TechData</th><th>Ingram Micro</th><th>ALSO</th><th>TD SYNNEX</th></tr></thead><tbody>${fields.map(f=>`<tr><td>${f}</td>${state.importSources.map(s=>`<td><select onchange="window.keffTech.updateMapping('${s.id}','${f}',this.value)">${['SKU','ProductName','ItemID','Description','PartNumber','Name','Reference','Title'].map(opt=>`<option value="${opt}" ${s.mapping[f]===opt?'selected':''}>${opt}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  updateMapping(sourceId,field,value){const s=state.importSources.find(x=>x.id===sourceId);if(s){s.mapping[field]=value;this.showToast(`Mapping ${field} mis à jour pour ${s.name}`);}}
  toggleSchedule(i){state.schedules[i].enabled=!state.schedules[i].enabled;this.renderSchedules();}

  // ---------- SUBSCRIPTIONS ----------
  subscribe(tier){
    if(tier==='tresor' && state.subscription!=='basic'){this.showToast('Passez d\'abord au Basic pour accéder au Trésor','error');return;}
    state.subscription=tier;
    this.updateSubscriptionUI();
    this.showToast(`Abonnement ${tier==='basic'?'Basic':'Trésor'} activé (démo)`);
  }
  cancelSubscription(){state.subscription=null;this.updateSubscriptionUI();this.showToast('Abonnement annulé');}
  updateSubscriptionUI(){
    const sub=state.subscription;
    if(sub){
      this.currentSub.innerHTML=`<strong>${sub==='basic'?'KiffTech Basic (1€/sem)':'KiffTech Trésor (3,35€/sem)'}</strong><br><small>Renouvellement automatique simulé</small>`;
      this.subActions.innerHTML=`<button class="btn-secondary" onclick="window.keffTech.cancelSubscription()">Annuler</button>`;
    }else{
      this.currentSub.textContent='Aucun abonnement actif';
      this.subActions.innerHTML='';
    }
    document.querySelectorAll('.btn-subscribe').forEach(btn=>{btn.disabled=!!sub;btn.textContent=sub?`${sub==='basic'?'Basic actif':'Trésor actif'}`:btn.dataset.tier==='basic'?'S\'abonner':'Activer Trésor';});
    this.addScheduleBtn.disabled=sub!=='tresor';
  }

  // ---------- SETTINGS ----------
  bindSettings(){
    this.globalDiscount.addEventListener('input',()=>{state.mappings.globalDiscount=+this.globalDiscount.value;this.globalDiscountVal.textContent=state.mappings.globalDiscount+'%';});
    this.targetMargin.addEventListener('input',()=>{state.mappings.targetMargin=+this.targetMargin.value;this.targetMarginVal.textContent=state.mappings.targetMargin+'%';});
    this.autoPriceUpdate.addEventListener('change',()=>{state.mappings.autoPriceUpdate=this.autoPriceUpdate.checked;});
    this.verifyRefPrice.addEventListener('change',()=>{state.mappings.verifyRefPrice=this.verifyRefPrice.checked;});
  }

  // ---------- EXPORT / IMPORT ----------
  exportCatalog(format){
    const data=state.products.map(p=>({id:p.id,title:p.title,category:p.category,supplier:p.supplierName,price:p.price,refPrice:p.refPrice,discount:p.discount,stock:p.stock}));
    if(format==='csv'){
      const headers=Object.keys(data[0]).join(',');
      const rows=data.map(r=>Object.values(r).map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      this.download(headers+'\n'+rows,'kifftech-catalog.csv','text/csv');
    }else{
      this.download(JSON.stringify(data,null,2),'kifftech-catalog.json','application/json');
    }
    this.showToast(`Catalogue exporté (${format.toUpperCase()})`);
  }
  download(content,filename,mime){const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
  handleCSVImport(e){const file=e.target.files[0];if(!file) return;const reader=new FileReader();reader.onload=()=>{try{const text=reader.result;const lines=text.trim().split('\n');const headers=lines[0].split(',').map(h=>h.trim().replace(/^"|"$/g,''));const imported=lines.slice(1).map(line=>{const vals=line.split(',').map(v=>v.trim().replace(/^"|"$/g,''));const obj={};headers.forEach((h,i)=>{obj[h]=vals[i];});return obj;});this.showToast(`${imported.length} produits importés (démo)`);}catch(err){this.showToast('Erreur lecture CSV','error');}};reader.readAsText(file);this.csvImportInput.value='';}

  // ---------- EVENTS ----------
  bindEvents(){
    this.loadMore.querySelector('button').addEventListener('click',()=>this.loadMoreProducts());
    this.categoryFilter.addEventListener('change',this.applyFilters);
    this.supplierFilter.addEventListener('change',this.applyFilters);
    this.searchInput.addEventListener('input',this.applyFilters);
    document.querySelectorAll('.btn-subscribe').forEach(btn=>btn.addEventListener('click',()=>this.subscribe(btn.dataset.tier)));
    this.addSourceBtn.addEventListener('click',()=>this.showToast('Ajout source — démo seulement'));
    this.addScheduleBtn.addEventListener('click',()=>this.showToast('Nouvelle tâche cron — démo seulement'));
    this.exportCSV.addEventListener('click',()=>this.exportCatalog('csv'));
    this.exportJSON.addEventListener('click',()=>this.exportCatalog('json'));
    this.importCSV.addEventListener('click',()=>this.csvImportInput.click());
    this.csvImportInput.addEventListener('change',(e)=>this.handleCSVImport(e));
    this.modal.querySelector('.modal-close').addEventListener('click',()=>this.closeModal());
    this.modal.querySelector('.modal-backdrop').addEventListener('click',()=>this.closeModal());
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape') this.closeModal();});

    // Cart button
    document.getElementById('cartBtn').addEventListener('click',()=>this.showToast(`Panier: ${state.cart.length} articles, ${formatPrice(this.getCartTotal())}`));
    // User button
    document.getElementById('userBtn').addEventListener('click',()=>this.switchTab('settings'));
    // Search button
    document.getElementById('searchBtn').addEventListener('click',()=>{this.searchInput.focus();this.switchTab('catalog');});
  }

  // ---------- BIO PARTICLES ----------
  initBioParticles(){
    const container=document.getElementById('bioParticles');
    if(!container) return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const colors=['#00ffc8','#0066ff','#b84dff','#ff6b00','#ffd23f'];
    for(let i=0;i<18;i++){
      const p=document.createElement('div');
      p.className='bio-particle';
      const size=1.5+Math.random()*3;
      const sx=(Math.random()-0.5)*innerWidth*0.8;
      const sy=(Math.random()-0.5)*innerHeight*0.8;
      const ex=(Math.random()-0.5)*innerWidth*0.8;
      const ey=(Math.random()-0.5)*innerHeight*0.8;
      const dx=ex-sx, dy=ey-sy;
      const clr=colors[Math.floor(Math.random()*colors.length)];
      const op=0.05+Math.random()*0.1;
      const dur=20+Math.random()*20;
      const delay=Math.random()*5;
      p.style.cssText=`left:50%;top:50%;width:${size}px;height:${size}px;--sx:${sx}px;--sy:${sy}px;--dx:${dx}px;--dy:${dy}px;--ex:${ex}px;--ey:${ey}px;--op:${op};background:${clr};color:${clr};animation-duration:${dur}s;animation-delay:${delay}s`;
      if(Math.random()<.4) p.classList.add('glow');
      container.appendChild(p);
    }
  }

  // ---------- TOASTS ----------
  showToast(msg,type='success'){const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;this.toastContainer.appendChild(t);setTimeout(()=>{t.style.animation='toastIn .3s reverse';setTimeout(()=>t.remove(),300);},3500);}

  // ---------- SW ----------
  registerSW(){if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(console.warn);}}

  // ---------- INSTALL ----------
  setupInstallPrompt(){
    let deferredPrompt=null;
    const installBtn=document.createElement('button');
    installBtn.className='install-btn';
    installBtn.textContent='Installer KiffTech';
    installBtn.style.cssText='position:fixed;bottom:calc(var(--bottom-bar-h) + 1rem + var(--safe-bottom));left:50%;transform:translateX(-50%);z-index:90;padding:.75rem 1.5rem;background:var(--accent);color:#03050a;border:none;border-radius:999px;font-weight:700;display:none;box-shadow:0 4px 20px rgba(0,255,200,.4)';
    document.body.appendChild(installBtn);

    window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault();deferredPrompt=e;installBtn.style.display='block';});
    window.addEventListener('appinstalled',()=>{deferredPrompt=null;installBtn.style.display='none';});
    installBtn.addEventListener('click',async()=>{if(!deferredPrompt) return;deferredPrompt.prompt();const{outcome}=await deferredPrompt.userChoice;if(outcome==='accepted') installBtn.style.display='none';deferredPrompt=null;});
    if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) installBtn.style.display='none';
  }
}

// ---------- BOOT ----------
document.addEventListener('DOMContentLoaded',()=>{window.keffTech=new KiffTech();});