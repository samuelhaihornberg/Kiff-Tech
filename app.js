/* ===== KiffTech — Catalogue Smart Devices & Gadgets ===== */

// ---------- RAYONS (Catégories de produits) ----------
const RAYONS = [
  { id: 'smartphones', label: 'Smartphones', icon: '📱', color: '#00d4ff', desc: 'Smartphones et accessoires' },
  { id: 'montres', label: 'Montres connectées', icon: '⌚', color: '#00ff88', desc: 'Smartwatches et trackers fitness' },
  { id: 'audio', label: 'Audio', icon: '🎧', color: '#ff2d95', desc: 'Écouteurs, casques et enceintes' },
  { id: 'maison', label: 'Maison connectée', icon: '🏠', color: '#ff6b00', desc: 'Objets connectés pour la maison' },
  { id: 'securite', label: 'Sécurité', icon: '🔒', color: '#b84dff', desc: 'Caméras, alarmes et serrures connectées' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', color: '#ff6b00', desc: 'Accessoires et périphériques gaming' },
  { id: 'robots', label: 'Robots', icon: '🤖', color: '#00ffc8', desc: 'Robots aspirateurs et assistants' },
  { id: 'drones', label: 'Drones', icon: '🚁', color: '#ffd23f', desc: 'Drones et gadgets télécommandés' },
  { id: 'informatique', label: 'Informatique', icon: '💻', color: '#0066ff', desc: 'Claviers, souris, hubs et écrans' },
  { id: 'energie', label: 'Énergie', icon: '🔋', color: '#00ff88', desc: 'Chargeurs, batteries et énergie portable' },
  { id: 'auto', label: 'Auto', icon: '🚗', color: '#ff6b00', desc: 'Gadgets et accessoires auto' },
  { id: 'vr', label: 'Réalité Virtuelle', icon: '🥽', color: '#b84dff', desc: 'Casques VR et lunettes AR' }
];

const RAYONS_MAP = Object.fromEntries(RAYONS.map(r => [r.id, r]));

// ---------- MARQUES PAR RAYON (mélangées) ----------
const BRANDS_BY_RAYON = {
  smartphones: ['Samsung', 'Xiaomi', 'Apple', 'Google', 'OnePlus', 'Nothing', 'Motorola', 'OPPO', 'Realme', 'POCO'],
  montres: ['Apple', 'Samsung', 'Garmin', 'Xiaomi', 'Huawei', 'Amazfit', 'Withings', 'Fossil', 'Mobvoi'],
  audio: ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Anker', 'Nothing', 'Samsung', 'Apple', 'Jabra', 'Beats', 'Marshall'],
  maison: ['Philips Hue', 'Xiaomi', 'Aqara', 'Sonoff', 'Shelly', 'Meross', 'TP-Link', 'Google', 'Amazon', 'IKEA'],
  securite: ['Arlo', 'Ring', 'Eufy', 'Reolink', 'TP-Link', 'Xiaomi', 'Blink', 'Google Nest', 'Yale', 'Nuki'],
  gaming: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Roccat', 'GameSir', '8BitDo', 'Xbox', 'PlayStation'],
  robots: ['iRobot', 'Roborock', 'Ecovacs', 'Dreame', 'Xiaomi', 'Eufy', 'Neato', 'Mammotion', 'Segway'],
  drones: ['DJI', 'Autel', 'Skydio', 'Parrot', 'BetaFPV', 'iFlight', 'GEPRC', 'Holy Stone', 'Potensic'],
  informatique: ['Logitech', 'Keychron', 'Razer', 'SteelSeries', 'Corsair', 'Anker', 'CalDigit', 'Belkin', 'Satechi', 'HyperX'],
  energie: ['Anker', 'Baseus', 'UGREEN', 'Xiaomi', 'EcoFlow', 'Jackery', 'Bluetti', 'Nitecore', 'Nekteck', 'INIU'],
  auto: ['Baseus', 'Anker', 'UGREEN', '70mai', 'Nextbase', 'Vantrue', 'Cobra', 'OBDLink', 'Nonda'],
  vr: ['Meta', 'Apple', 'HTC', 'Valve', 'Pico', 'DPVR', 'XREAL', 'Rokid', 'Viture', 'RayNeo']
};

// ---------- GÉNÉRATION PRODUITS PAR RAYON ----------
function generateProductsForRayon(rayonId, count = 8) {
  const brands = BRANDS_BY_RAYON[rayonId] || ['Generic'];
  const products = [];
  
  const templates = {
    smartphones: [
      { prefix: 'Galaxy S', suffix: ['24 Ultra', '24+', '24', '23 FE'], brand: 'Samsung' },
      { prefix: 'iPhone', suffix: ['15 Pro Max', '15 Pro', '15', '15 Plus', '14', '13'], brand: 'Apple' },
      { prefix: 'Redmi Note', suffix: ['13 Pro+', '13 Pro', '13', '12 Pro'], brand: 'Xiaomi' },
      { prefix: 'Pixel', suffix: ['8 Pro', '8', '8a', '7a'], brand: 'Google' },
      { prefix: 'Nothing Phone', suffix: ['2a', '2', '1'], brand: 'Nothing' }
    ],
    montres: [
      { prefix: 'Apple Watch', suffix: ['Series 9', 'Ultra 2', 'SE 2023'], brand: 'Apple' },
      { prefix: 'Galaxy Watch', suffix: ['6 Classic', '6', '5 Pro', 'FE'], brand: 'Samsung' },
      { prefix: 'Garmin', suffix: ['Forerunner 965', '265', '165', 'Venu 3'], brand: 'Garmin' },
      { prefix: 'Xiaomi Watch', suffix: ['S3', '2 Pro', '2 Lite'], brand: 'Xiaomi' },
      { prefix: 'Amazfit', suffix: ['GTR 4', 'GTS 4', 'T-Rex Ultra', 'Active'], brand: 'Amazfit' }
    ],
    audio: [
      { prefix: 'WF-1000XM', suffix: ['5', '4'], brand: 'Sony' },
      { prefix: 'AirPods', suffix: ['Pro 2', '3', 'Max'], brand: 'Apple' },
      { prefix: 'WH-1000XM', suffix: ['5', '4'], brand: 'Sony' },
      { prefix: 'QuietComfort', suffix: ['Ultra', '45', 'Earbuds II'], brand: 'Bose' },
      { prefix: 'Galaxy Buds', suffix: ['2 Pro', '2', 'FE', 'Live'], brand: 'Samsung' },
      { prefix: 'Soundcore', suffix: ['Liberty 4', 'Space A40', 'Life P3'], brand: 'Anker' }
    ],
    maison: [
      { prefix: 'Hue', suffix: ['White & Color', 'White', 'Play', 'Go', 'Strip'], brand: 'Philips Hue' },
      { prefix: 'Mi Smart', suffix: ['Plug', 'Bulb', 'Sensor', 'Gateway', 'Switch'], brand: 'Xiaomi' },
      { prefix: 'Aqara', suffix: ['Hub M2', 'Sensor', 'Switch', 'Curtain', 'Valve'], brand: 'Aqara' },
      { prefix: 'Sonoff', suffix: ['Mini R4', 'Basic R4', 'SwitchMan', 'THR320D'], brand: 'Sonoff' }
    ],
    securite: [
      { prefix: 'Arlo', suffix: ['Pro 5', 'Pro 4', 'Essential', 'Go 2'], brand: 'Arlo' },
      { prefix: 'Ring', suffix: ['Video Doorbell Pro 2', 'Battery Doorbell', 'Stick Up Cam Pro'], brand: 'Ring' },
      { prefix: 'Eufy', suffix: ['Cam 3', 'SoloCam S340', 'Video Doorbell E340'], brand: 'Eufy' },
      { prefix: 'Reolink', suffix: ['Argus 4 Pro', 'TrackMix', 'Duo 3 PoE', 'Altas PT Ultra'], brand: 'Reolink' }
    ],
    gaming: [
      { prefix: 'G Pro X', suffix: ['Superlight 2', 'Superlight', 'Wireless'], brand: 'Logitech' },
      { prefix: 'DeathAdder', suffix: ['V3 Pro', 'V3', 'V2'], brand: 'Razer' },
      { prefix: 'BlackShark', suffix: ['V2 Pro', 'V2', 'X'], brand: 'Razer' },
      { prefix: 'Apex Pro', suffix: ['TKL', 'Mini', 'Gen 3'], brand: 'SteelSeries' },
      { prefix: 'Cloud', suffix: ['III', 'II Wireless', 'Alpha'], brand: 'HyperX' }
    ],
    robots: [
      { prefix: 'Roomba', suffix: ['j9+', 'j7+', 'i7+', 'Combo j9+'], brand: 'iRobot' },
      { prefix: 'Roborock', suffix: ['S8 Pro Ultra', 'S8 MaxV Ultra', 'Q Revo', 'Q8 Max+'], brand: 'Roborock' },
      { prefix: 'Deebot', suffix: ['X2 Omni', 'T20 Omni', 'N8 Pro+'], brand: 'Ecovacs' },
      { prefix: 'Dreame', suffix: ['L20 Ultra', 'L10s Ultra', 'X30 Ultra'], brand: 'Dreame' }
    ],
    drones: [
      { prefix: 'DJI', suffix: ['Air 3', 'Mini 4 Pro', 'Mavic 3 Pro', 'Avata 2', 'FPV'], brand: 'DJI' },
      { prefix: 'Autel', suffix: ['EVO II Pro V3', 'EVO Lite+', 'Dragonfish'], brand: 'Autel' },
      { prefix: 'BetaFPV', suffix: ['Cetus Pro', 'Pavo Pico', 'Meteor 75'], brand: 'BetaFPV' }
    ],
    informatique: [
      { prefix: 'MX Keys', suffix: ['S', 'Mini', 'Full'], brand: 'Logitech' },
      { prefix: 'MX Master', suffix: ['3S', '3', '2S'], brand: 'Logitech' },
      { prefix: 'Keychron', suffix: ['K2 Pro', 'V1', 'Q1 Pro', 'Q3 Pro'], brand: 'Keychron' },
      { prefix: 'Huntsman', suffix: ['V3 Pro', 'V2', 'Mini'], brand: 'Razer' }
    ],
    energie: [
      { prefix: 'PowerCore', suffix: ['24K', '20K', '10K', '5K'], brand: 'Anker' },
      { prefix: 'Prime', suffix: ['20000', '10000', '67W GaN'], brand: 'UGREEN' },
      { prefix: 'RIVER', suffix: ['2 Pro', '2 Max', '2'], brand: 'EcoFlow' },
      { prefix: 'Explorer', suffix: ['1000', '500', '300', '240'], brand: 'Jackery' }
    ],
    auto: [
      { prefix: '70mai', suffix: ['A800', 'A500S', 'M500', 'Omni'], brand: '70mai' },
      { prefix: 'Anker', suffix: ['Roav DashCam', 'Roav Jump Starter', 'Car Charger'], brand: 'Anker' },
      { prefix: 'Baseus', suffix: ['Car Charger', 'Jump Starter', 'Dash Cam'], brand: 'Baseus' }
    ],
    vr: [
      { prefix: 'Quest', suffix: ['3', 'Pro', '2'], brand: 'Meta' },
      { prefix: 'Vision Pro', suffix: ['256GB', '512GB', '1TB'], brand: 'Apple' },
      { prefix: 'Pico', suffix: ['4', '4 Pro', '4 Enterprise'], brand: 'Pico' },
      { prefix: 'XREAL', suffix: ['Air 2 Pro', 'Air 2', 'Air'], brand: 'XREAL' }
    ]
  };

  const rayTemplates = templates[rayonId] || [{ prefix: 'Produit', suffix: ['1', '2', '3'], brand: 'Generic' }];
  
  for (let i = 0; i < count; i++) {
    const template = rayTemplates[i % rayTemplates.length];
    const brand = template.brand;
    const suffix = template.suffix[i % template.suffix.length];
    const title = `${brand} ${template.prefix} ${suffix}`;
    
    const basePrice = Math.round((30 + Math.random() * 800) * 100) / 100;
    const officialPrice = Math.round(basePrice * (1.15 + Math.random() * 0.25) * 100) / 100;
    const promoPercent = 10 + Math.floor(Math.random() * 11);
    const promoPrice = Math.round(officialPrice * (1 - promoPercent / 100) * 100) / 100;
    const stock = Math.random() > 0.1 ? Math.floor(Math.random() * 200) : 0;
    
    const rayon = RAYONS.find(r => r.id === rayonId);
    
    products.push({
      id: `KT-${rayonId.toUpperCase()}-${String(i+1).padStart(3,'0')}`,
      title,
      category: rayonId,
      brand,
      supplier: 'kifftech',
      supplierName: 'KiffTech Official',
      price: promoPrice,
      officialPrice,
      promoPercent,
      stock,
      images: [
        `https://picsum.photos/seed/${encodeURIComponent(brand + title + i + 'a')}/600/600.jpg`,
        `https://picsum.photos/seed/${encodeURIComponent(brand + title + i + 'b')}/600/600.jpg`,
        `https://picsum.photos/seed/${encodeURIComponent(brand + title + i + 'c')}/600/600.jpg`,
        `https://picsum.photos/seed/${encodeURIComponent(brand + title + i + 'd')}/600/600.jpg`
      ],
      videoUrl: `https://cdn.pixabay.com/video/2023/01/01/00-00-00-${Math.floor(Math.random()*1000).toString().padStart(4,'0')}_medium.mp4`,
      specs: generateSpecs(rayonId, brand),
      tags: promoPercent >= 15 ? ['promo'] : stock === 0 ? ['rupture'] : i < 2 ? ['nouveau'] : [],
      description: `${title} — ${rayon?.desc || 'Produit tech'}. Prix officiel barré, promotion ${promoPercent}%.`,
      reference: `REF-${rayonId.toUpperCase()}-${String(Math.floor(Math.random()*10000)).padStart(4,'0')}`,
      gtin: String(Math.floor(Math.random()*1e13)).padStart(13,'0')
    });
  }
  return products;
}

function generateSpecs(rayonId, brand) {
  const baseSpecs = {};
  
  switch(rayonId) {
    case 'smartphones':
      baseSpecs['Écran'] = ['6.1"', '6.5"', '6.7"', '6.9"'][Math.floor(Math.random()*4)];
      baseSpecs['Stockage'] = ['128GB', '256GB', '512GB', '1TB'][Math.floor(Math.random()*4)];
      baseSpecs['RAM'] = ['6GB', '8GB', '12GB', '16GB'][Math.floor(Math.random()*4)];
      baseSpecs['Processeur'] = ['Snapdragon 8 Gen 3', 'Dimensity 9300', 'A17 Pro', 'Tensor G3', 'Snapdragon 7 Gen 3'][Math.floor(Math.random()*5)];
      baseSpecs['Batterie'] = ['4500mAh', '5000mAh', '5500mAh'][Math.floor(Math.random()*3)];
      break;
    case 'montres':
      baseSpecs['Écran'] = ['1.3"', '1.4"', '1.5"', '1.75"'][Math.floor(Math.random()*4)];
      baseSpecs['Autonomie'] = ['18h', '24h', '36h', '48h', '72h'][Math.floor(Math.random()*5)];
      baseSpecs['GPS'] = ['Intégré', 'Intégré + GLONASS', 'Multi-bandes'][Math.floor(Math.random()*3)];
      baseSpecs['Étanchéité'] = ['5 ATM', '10 ATM', 'IP68'][Math.floor(Math.random()*3)];
      break;
    case 'audio':
      baseSpecs['Type'] = ['True Wireless', 'Casque circum-aural', 'Supra-aural'][Math.floor(Math.random()*3)];
      baseSpecs['ANC'] = ['Hybride 50dB', 'Adaptatif 45dB', 'Passif', 'Aucun'][Math.floor(Math.random()*4)];
      baseSpecs['Autonomie'] = ['6h+24h', '8h+30h', '20h', '40h', '60h'][Math.floor(Math.random()*5)];
      baseSpecs['Codec'] = ['LDAC', 'aptX Adaptive', 'AAC', 'SBC'][Math.floor(Math.random()*4)];
      break;
    case 'maison':
      baseSpecs['Protocole'] = ['Matter', 'Zigbee', 'Wi-Fi', 'Bluetooth', 'Thread'][Math.floor(Math.random()*5)];
      baseSpecs['Alimentation'] = ['Secteur', 'Pile', 'Batterie rechargeable', 'Solaire'][Math.floor(Math.random()*4)];
      baseSpecs['Compatibilité'] = ['Home Assistant', 'HomeKit', 'Google Home', 'Alexa', 'SmartThings'][Math.floor(Math.random()*5)];
      break;
    case 'securite':
      baseSpecs['Résolution'] = ['2K', '4K', '1080p'][Math.floor(Math.random()*3)];
      baseSpecs['Vision nocturne'] = ['Couleur', 'Infrarouge', 'Projecteur'][Math.floor(Math.random()*3)];
      baseSpecs['Alimentation'] = ['Secteur', 'Batterie', 'Solaire', 'PoE'][Math.floor(Math.random()*4)];
      baseSpecs['Stockage'] = ['Cloud', 'Locale (SD)', 'NVR', 'Les deux'][Math.floor(Math.random()*4)];
      break;
    case 'gaming':
      baseSpecs['Connexion'] = ['Sans fil 2.4GHz', 'Bluetooth', 'Filaire USB-C', 'Multi-mode'][Math.floor(Math.random()*4)];
      baseSpecs['Autonomie'] = ['50h', '70h', '100h', '150h'][Math.floor(Math.random()*4)];
      baseSpecs['Poids'] = ['45g', '55g', '65g', '85g'][Math.floor(Math.random()*4)];
      break;
    case 'robots':
      baseSpecs['Navigation'] = ['LiDAR', 'vSLAM', 'Caméra AI', 'Gyroscope'][Math.floor(Math.random()*4)];
      baseSpecs['Aspiration'] = ['5000 Pa', '6000 Pa', '7000 Pa', '8000 Pa', '10000 Pa'][Math.floor(Math.random()*5)];
      baseSpecs['Autonomie'] = ['120min', '180min', '240min', '300min'][Math.floor(Math.random()*4)];
      baseSpecs['Station'] = ['Auto-vidange', 'Lavage serpillère', 'Séchage', 'Base simple'][Math.floor(Math.random()*4)];
      break;
    case 'drones':
      baseSpecs['Caméra'] = ['4K/60fps', '4K/120fps', '5.1K/50fps', '6K/30fps'][Math.floor(Math.random()*4)];
      baseSpecs['Autonomie'] = ['28min', '34min', '40min', '46min'][Math.floor(Math.random()*4)];
      baseSpecs['Transmission'] = ['O3/O4', 'OcuSync', 'SkyLink', 'WiFi'][Math.floor(Math.random()*4)];
      baseSpecs['Poids'] = ['<250g', '~500g', '~900g', '>1kg'][Math.floor(Math.random()*4)];
      break;
    case 'informatique':
      baseSpecs['Type'] = ['Clavier mécanique', 'Souris gaming', 'Hub USB-C', 'Dock Thunderbolt', 'Écran portable'][Math.floor(Math.random()*5)];
      baseSpecs['Switch'] = ['Red', 'Brown', 'Blue', 'Silver', 'Low Profile'][Math.floor(Math.random()*5)];
      baseSpecs['Connexion'] = ['USB-C', 'Bluetooth', '2.4GHz', 'Filaire'][Math.floor(Math.random()*4)];
      break;
    case 'energie':
      baseSpecs['Capacité'] = ['5000mAh', '10000mAh', '20000mAh', '24000mAh', '256Wh'][Math.floor(Math.random()*5)];
      baseSpecs['Puissance max'] = ['30W', '65W', '100W', '140W', '240W'][Math.floor(Math.random()*5)];
      baseSpecs['Ports'] = ['USB-C x2', 'USB-C + USB-A', 'USB-C x3', 'AC + USB-C'][Math.floor(Math.random()*4)];
      break;
    case 'auto':
      baseSpecs['Type'] = ['Dashcam', 'Chargeur', 'Démarreur', 'Purificateur', 'Support'][Math.floor(Math.random()*5)];
      baseSpecs['Résolution'] = ['4K', '2K', '1080p'][Math.floor(Math.random()*3)];
      baseSpecs['Alimentation'] = ['Allume-cigare', 'Batterie', 'OBD-II', 'Solaire'][Math.floor(Math.random()*4)];
      break;
    case 'vr':
      baseSpecs['Type'] = ['Autonome', 'PC VR', 'Hybride', 'AR'][Math.floor(Math.random()*4)];
      baseSpecs['Résolution'] = ['2K/œil', '4K/œil', 'Micro-OLED'][Math.floor(Math.random()*3)];
      baseSpecs['FOV'] = ['90°', '100°', '110°', '120°'][Math.floor(Math.random()*4)];
      baseSpecs['Tracking'] = ['Inside-out', 'Outside-in', 'Eye-tracking', 'Hand-tracking'][Math.floor(Math.random()*4)];
      break;
    default:
      baseSpecs['Caractéristique'] = 'Standard';
  }
  
  return baseSpecs;
}

// Générer tous les produits (fallback)
let DEMO_PRODUCTS = [];
RAYONS.forEach(rayon => {
  DEMO_PRODUCTS = DEMO_PRODUCTS.concat(generateProductsForRayon(rayon.id, 8));
});

// Mélanger pour variété
DEMO_PRODUCTS = DEMO_PRODUCTS.sort(() => Math.random() - 0.5);

const FALLBACK_PRODUCTS = DEMO_PRODUCTS;

// ---------- UTILITIES ----------
function sanitizeHTML(str){const div=document.createElement('div');div.textContent=str;return div.innerHTML;}
function formatPrice(val,currency='€'){return val.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+currency;}
function formatDiscount(pct){return pct>0?`-${pct}%`:'';}
function debounce(fn,ms){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};}

// ---------- STATE ----------
const state = {
  products: DEMO_PRODUCTS,
  productsMap: new Map(),
  filteredProducts: [],
  currentRayon: null,
  currentCategory: '',
  currentSupplier: '',
  currentSearch: '',
  visibleCount: 24,
  currentProduct: null,
  currentTab: 'catalog',
  subscription: null,
  sortBy: 'featured',
  importSources: [],
  schedules: [],
  mappings: {globalDiscount:10,targetMargin:35,autoPriceUpdate:true,verifyRefPrice:true},
  cart: [],
  toastQueue: [],
};

// ---------- MAIN CLASS ----------
class KiffTech{
  constructor(){
    this.tabs = ['catalog'];
    this.tabLabels = {catalog:'Catalogue'};
    this.tabIcons = {
      catalog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><line x1="4" y1="6" x2="4" y2="18"/><line x1="20" y1="6" x2="20" y2="18"/></svg>'
    };

    this.productsGrid = document.getElementById('productsGrid');
    this.loadMore = document.getElementById('loadMore');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.supplierFilter = document.getElementById('supplierFilter');
    this.searchInput = document.getElementById('searchInput');
    this.productDetail = document.getElementById('productDetail');
    this.cartCount = document.getElementById('cartCount');
    this.modal = document.getElementById('productModal');
    this.modalBody = document.getElementById('modalBody');
    this.toastContainer = document.getElementById('toastContainer');
    this.splashBar = document.getElementById('splashBar');
    this.splashText = document.getElementById('splashText');

    this.currentRayon = null;
    this.currentRayonProducts = [];
    this.rayonSort = 'featured';
    this.rayonBrandFilter = '';

    this.init();
  }

  init(){
    this.setProgress(10,'Initialisation…');
    this.buildTabs();
    this.bindEvents();
    this.populateFilters();
    this.applyFilters();
    this.initBioParticles();
    this.registerSW();
    this.setupInstallPrompt();
    this.bindCartEvents();

    this.loadProducts();

    if(document.readyState==='complete') this.onLoaded();
    else window.addEventListener('load',()=>this.onLoaded());
  }

  async loadProducts() {
    this.setProgress(30, 'Chargement catalogue…');
    
    const cached = getCachedProducts();
    if (cached) {
      state.products = cached;
      this.buildProductsMap();
      this.setProgress(80, 'Catalogue chargé (cache)');
      this.applyFilters();
      return;
    }

    this.setProgress(50, 'Synchronisation…');
    try {
      const products = await productAgent.syncAllProducts();
      state.products = products;
      this.buildProductsMap();
      setCachedProducts(products);
      this.setProgress(80, 'Catalogue synchronisé');
      this.applyFilters();
    } catch (err) {
      console.warn('[KiffTech] Erreur sync, fallback:', err.message);
      state.products = FALLBACK_PRODUCTS;
      this.buildProductsMap();
      this.applyFilters();
    }
    
    this.setProgress(100, 'Prêt');
  }

  buildProductsMap() {
    state.productsMap = new Map();
    state.products.forEach(p => state.productsMap.set(p.id, p));
  }

  onLoaded(){
    this.animateProgress(100,'Prêt',()=>{this.hideSplash();});
  }

  setProgress(pct,text){this.splashBar.style.width=pct+'%';this.splashText.textContent=text;}
  animateProgress(target,text,cb){let cur=parseInt(this.splashBar.style.width)||0;const step=()=>{if(cur<target){cur=Math.min(target,cur+3);this.setProgress(cur,text);requestAnimationFrame(()=>setTimeout(step,20));}else if(cb)cb();};step();}
  hideSplash(){document.getElementById('splash').classList.add('hidden');}

  buildTabs(){
    const tabsHTML=this.tabs.map((t,i)=>`<button class="main-tab" role="tab" aria-selected="${i===0}" data-tab="${t}">${this.tabLabels[t]}</button>`).join('');
    this.mainTabs.innerHTML=tabsHTML;
    this.mainTabs.querySelectorAll('.main-tab').forEach(btn=>btn.addEventListener('click',()=>this.switchTab(btn.dataset.tab)));
  }

  switchTab(tab){
    state.currentTab=tab;
    document.querySelectorAll('.panel').forEach(p=>p.hidden=true);
    document.getElementById(`panel-${tab}`).hidden=false;
    document.querySelectorAll('[role="tab"]').forEach(btn=>{btn.setAttribute('aria-selected',btn.dataset.tab===tab);});
  }

  populateFilters(){
    this.categoryFilter.innerHTML = '<option value="">Tous les rayons</option>' + RAYONS.map(r=>`<option value="${r.id}">${r.label}</option>`).join('');
    this.supplierFilter.innerHTML = '<option value="">Tous fournisseurs</option>';
  }

  applyFilters=debounce(()=>{
    state.currentCategory=this.categoryFilter.value;
    state.currentSupplier=this.supplierFilter.value;
    state.currentSearch=this.searchInput.value.toLowerCase();
    state.visibleCount=24;

    let baseProducts = state.products;
    
    if(this.currentRayon){
      baseProducts = baseProducts.filter(p => p.category === this.currentRayon);
    } else if(state.currentCategory){
      baseProducts = baseProducts.filter(p => p.category === state.currentCategory);
    }
    
    if(this.rayonBrandFilter) baseProducts = baseProducts.filter(p => p.brand === this.rayonBrandFilter);
    if(state.currentSupplier) baseProducts = baseProducts.filter(p => p.supplierName === state.currentSupplier);
    if(state.currentSearch) baseProducts = baseProducts.filter(p => p.title.toLowerCase().includes(state.currentSearch) || p.description.toLowerCase().includes(state.currentSearch) || p.brand.toLowerCase().includes(state.currentSearch));

    state.filteredProducts = baseProducts;
    
    if(this.currentRayon){
      this.currentRayonProducts = baseProducts;
      this.sortRayonProducts();
      baseProducts = this.currentRayonProducts;
    }
    
    state.visibleCount = 24;
    this.renderProducts();
  },150);

  renderProducts(){
    const grid = this.productsGrid;
    
    if(this.currentRayon){
      const toShow = this.currentRayonProducts.slice(0, state.visibleCount);
      grid.innerHTML = toShow.map(p => this.catalogProductHTML(p)).join('');
    } else {
      grid.innerHTML = RAYONS.map(r => this.rayonCardHTML(r)).join('');
      this.bindRayonCards();
    }
    
    this.loadMore.hidden = state.visibleCount >= state.filteredProducts.length;

    grid.querySelectorAll('.catalog-product').forEach(card=>{
      card.addEventListener('click',(e)=>{
        if(e.target.closest('a, button')) return;
        this.openProduct(card.dataset.id);
      });
      const btn = card.querySelector('.btn-catalog:not(.secondary)');
      if(btn) btn.addEventListener('click',(e)=>{e.stopPropagation();e.preventDefault();this.openProductLink(card.dataset.id);});
      const btnDetail = card.querySelector('.btn-catalog.secondary');
      if(btnDetail) btnDetail.addEventListener('click',(e)=>{e.stopPropagation();this.openProduct(card.dataset.id);});
    });
  }

  rayonCardHTML(r){
    const count = state.products.filter(p => p.category === r.id).length;
    const hasProducts = count > 0;
    return `
      <article class="rayon-card" data-rayon="${r.id}" style="--rayon-color:${r.color};" ${!hasProducts ? 'data-empty="true"' : ''}>
        <div class="rayon-icon" style="background:${r.color}20;color:${r.color};">${r.icon}</div>
        <h3 class="rayon-label">${r.label}</h3>
        <p class="rayon-desc">${r.desc}</p>
        <div class="rayon-meta">
          <span class="rayon-count">${count} produit${count>1?'s':''}</span>
          ${!hasProducts ? '<span class="rayon-empty">Bientôt disponible</span>' : ''}
        </div>
        <button class="rayon-btn" type="button" aria-label="Voir ${r.label}">Explorer le rayon</button>
      </article>
    `;
  }

  bindRayonCards(){
    this.productsGrid.querySelectorAll('.rayon-card').forEach(card=>{
      card.addEventListener('click',()=>this.openRayon(card.dataset.rayon));
    });
  }

  openRayon(rayonId){
    this.currentRayon = rayonId;
    this.currentRayonProducts = state.products.filter(p => p.category === rayonId);
    this.applyFilters();
    this.showRayonHeader(rayonId);
  }

  showRayonHeader(rayonId){
    const rayon = RAYONS_MAP[rayonId];
    if(!rayon) return;
    
    const header = this.productsGrid.parentElement.querySelector('.panel-header');
    if(header){
      header.innerHTML = `
        <div class="rayon-header" style="--rayon-color:${rayon.color};">
          <button class="btn-back" onclick="window.keffTech.closeRayon()" aria-label="Retour au catalogue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>CATALOGUES</span>
          </button>
          <div class="rayon-header-info">
            <span class="rayon-header-icon" style="background:${rayon.color}20;color:${rayon.color};">${rayon.icon}</span>
            <div>
              <h2>${rayon.label}</h2>
              <p>${rayon.desc}</p>
            </div>
          </div>
          <div class="rayon-header-actions">
            <select id="rayonSort" onchange="window.keffTech.setRayonSort(this.value)" style="padding:.4rem .75rem;font-size:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--fg);min-width:140px;">
              <option value="featured">Sélection</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
              <option value="discount">Promos</option>
            </select>
            <select id="rayonBrandFilter" onchange="window.keffTech.setRayonBrandFilter(this.value)" style="padding:.4rem .75rem;font-size:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--fg);min-width:140px;">
              <option value="">Toutes marques</option>
              ${RAYONS_MAP[this.currentRayon]?.brands?.map(b=>`<option value="${b}">${b}</option>`).join('') || ''}
            </select>
          </div>
        `;
    }
  }

  closeRayon(){
    this.currentRayon = null;
    this.currentRayonProducts = [];
    this.applyFilters();
    const header = this.productsGrid.parentElement.querySelector('.panel-header');
    if(header){
      header.innerHTML = `
        <h2>CATALOGUES</h2>
        <div class="filter-bar">
          <input type="search" id="searchInput" placeholder="Rechercher produits..." aria-label="Recherche">
        </div>
      `;
      this.populateFilters();
      this.renderProducts();
    }
  }

  setRayonSort(value){
    this.rayonSort = value;
    this.sortRayonProducts();
    this.renderProducts();
  }

  setRayonBrandFilter(value){
    this.rayonBrandFilter = value;
    this.applyFilters();
  }

  sortRayonProducts(){
    if(!this.currentRayon) return;
    switch(this.rayonSort){
      case 'price-asc': this.currentRayonProducts.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': this.currentRayonProducts.sort((a,b)=>b.price-a.price); break;
      case 'newest': this.currentRayonProducts.sort((a,b)=>b.id.localeCompare(a.id)); break;
      case 'discount': this.currentRayonProducts.sort((a,b)=>b.promoPercent-a.promoPercent); break;
      default: break;
    }
  }

  applyFilters=debounce(()=>{
    state.currentCategory=this.categoryFilter.value;
    state.currentSupplier=this.supplierFilter.value;
    state.currentSearch=this.searchInput.value.toLowerCase();
    state.visibleCount=24;

    let baseProducts = state.products;
    
    if(this.currentRayon){
      baseProducts = baseProducts.filter(p => p.category === this.currentRayon);
    } else if(state.currentCategory){
      baseProducts = baseProducts.filter(p => p.category === state.currentCategory);
    }
    
    if(this.rayonBrandFilter) baseProducts = baseProducts.filter(p => p.brand === this.rayonBrandFilter);
    if(state.currentSupplier) baseProducts = baseProducts.filter(p => p.supplierName === state.currentSupplier);
    if(state.currentSearch) baseProducts = baseProducts.filter(p => p.title.toLowerCase().includes(state.currentSearch) || p.description.toLowerCase().includes(state.currentSearch) || p.brand.toLowerCase().includes(state.currentSearch));

    state.filteredProducts = baseProducts;
    
    if(this.currentRayon){
      this.currentRayonProducts = baseProducts;
      this.sortRayonProducts();
      baseProducts = this.currentRayonProducts;
    }
    
    state.visibleCount = 24;
    this.renderProducts();
  },150);

  catalogProductHTML(p){
    const color = RAYONS_MAP[p.category]?.color || '#00ffc8';
    const verified = p.supplier === 'clickwise' || p.supplier === 'kifftech';
    return `
      <article class="catalog-product" data-id="${p.id}" style="--rayon-color:${p.category ? RAYONS_MAP[p.category]?.color || '#00ffc8' : '#00ffc8'};">
        <div class="product-thumb" style="background-image:url('${p.images?.[0] || `https://picsum.photos/seed/${encodeURIComponent(p.title)}/600/600.jpg`}')" aria-hidden="true">
          ${p.supplier === 'clickwise' ? '<span class="verified-badge">✓ Vérifié</span>' : ''}
          ${p.promoPercent >= 15 ? `<span class="promo-badge">${p.promoPercent}%</span>` : ''}
          ${p.stock === 0 ? '<span class="rupture-badge">Rupture</span>' : ''}
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span class="product-brand" style="background:${this.getBrandColor(p.brand)}20;color:${this.getBrandColor(p.brand)};border-color:${this.getBrandColor(p.brand)}40;">${sanitizeHTML(p.brand)}</span>
            <span class="product-category">${sanitizeHTML(p.category)}</span>
            ${p.reference ? `<span class="product-ref">${sanitizeHTML(p.reference)}</span>` : ''}
          </div>
          <h3 class="product-title">${sanitizeHTML(p.title)}</h3>
          <div class="product-price-row">
            <span class="product-price">${formatPrice(p.price)}</span>
            <span class="product-official-price">${formatPrice(p.officialPrice)}</span>
            <span class="product-discount">${p.promoPercent}%</span>
          </div>
          <div class="product-actions">
            <a href="${sanitizeHTML(p.clickwiseTrackingUrl || '#')}" target="_blank" rel="noopener" class="btn-catalog" style="flex:1;padding:.5rem;font-size:.7rem;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--blue));color:#03050a;border:none;border-radius:var(--radius-sm);text-align:center;text-decoration:none;min-height:36px;">Voir le produit</a>
            <button class="btn-catalog secondary" onclick="window.keffTech.openProduct('${p.id}')" style="padding:.5rem .75rem;font-size:.7rem;background:var(--glass);color:var(--fg);border:1px solid var(--border);border-radius:var(--radius-sm);min-height:36px;">Détails</button>
          </div>
          <div class="product-meta" style="margin-top:.5rem;font-size:.6rem;color:var(--fg-muted);display:flex;gap:1rem;flex-wrap:wrap;">
            ${p.reference ? `<span>Réf: ${sanitizeHTML(p.reference)}</span>` : ''}
            ${p.gtin ? `<span>GTIN: ${sanitizeHTML(p.gtin)}</span>` : ''}
          </div>
        </div>
      </article>`;
  }

  getBrandColor(brand){
    const colors = {
      'Samsung': '#0066ff', 'Xiaomi': '#ff6b00', 'Apple': '#888', 'Google': '#4285f4',
      'Sony': '#0066ff', 'Bose': '#b84dff', 'Sennheiser': '#0066ff', 'JBL': '#ff6b00',
      'Anker': '#00d4ff', 'Nothing': '#888', 'Sennheiser': '#0066ff', 'Jabra': '#00ffc8',
      'Garmin': '#00ff88', 'Garmin': '#00ff88', 'Amazfit': '#ff6b00', 'Huawei': '#ff2d95',
      'Philips Hue': '#00d4ff', 'Aqara': '#00ff88', 'Sonoff': '#ff6b00', 'Shelly': '#b84dff',
      'TP-Link': '#0066ff', 'Meross': '#00d4ff', 'IKEA': '#0066ff',
      'Arlo': '#00d4ff', 'Ring': '#ff6b00', 'Eufy': '#00ff88', 'Reolink': '#b84dff',
      'Logitech': '#0066ff', 'Razer': '#00ff88', 'SteelSeries': '#ff6b00', 'Corsair': '#ffd23f',
      'iRobot': '#00d4ff', 'Roborock': '#00ff88', 'Ecovacs': '#ff6b00', 'Dreame': '#b84dff',
      'DJI': '#0066ff', 'Autel': '#b84dff', 'BetaFPV': '#ff6b00',
      'Keychron': '#00d4ff', 'Razer': '#00ff88', 'CalDigit': '#0066ff', 'Satechi': '#00d4ff',
      'Anker': '#00d4ff', 'Baseus': '#ff6b00', 'UGREEN': '#00ff88', 'EcoFlow': '#0066ff',
      'Jackery': '#ff6b00', 'Bluetti': '#ffd23f', 'Nitecore': '#b84dff',
      '70mai': '#00d4ff', 'Nextbase': '#0066ff', 'Vantrue': '#ff6b00',
      'Meta': '#0066ff', 'Apple': '#888', 'Pico': '#ff6b00', 'XREAL': '#00d4ff'
    };
    return colors[brand] || '#00ffc8';
  }

  loadMoreProducts(){
    state.visibleCount += 24;
    this.renderProducts();
  }

  openProduct(id){
    state.currentProduct = state.products.find(p => p.id === id);
    if(state.currentProduct) this.switchTab('product');
  }

  openProductLink(id){
    const p = state.products.find(p => p.id === id);
    if (p && p.clickwiseTrackingUrl) {
      window.open(p.clickwiseTrackingUrl, '_blank', 'noopener');
    } else if (p && p.affiliateUrl) {
      window.open(p.affiliateUrl, '_blank', 'noopener');
    }
  }

  renderProductDetail(){
    if(!state.currentProduct){this.productDetail.innerHTML='<p class="empty">Aucun produit sélectionné</p>';return;}
    const p = state.currentProduct;
    const color = RAYONS_MAP[p.category]?.color || '#00ffc8';
    
    this.productDetail.innerHTML = `
      <div class="detail-header" style="--rayon-color:${color};">
        <div class="detail-gallery">
          <div class="main-image" style="background-image:url('${p.images?.[0] || `https://picsum.photos/seed/${encodeURIComponent(p.title)}/600/600.jpg`}')"></div>
          <div class="thumbnails">${p.images?.slice(0,4).map((img, i) => `<img src="${img}" alt="${p.title} ${i+1}" onclick="document.querySelector('.main-image').style.backgroundImage='url(${img})'" style="width:60px;height:60px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid ${i===0?'var(--accent)':'transparent'};">`).join('')}</div>
        </div>
        ${p.videoUrl ? `<div class="product-video"><video controls src="${p.videoUrl}" style="width:100%;border-radius:var(--radius-md);background:#000;"></video></div>` : ''}
        <div class="detail-meta">
          <h2 class="detail-title">${sanitizeHTML(p.title)}</h2>
          <span class="detail-brand" style="background:${this.getBrandColor(p.brand)}20;color:${this.getBrandColor(p.brand)};border-color:${this.getBrandColor(p.brand)}40;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:600;">${sanitizeHTML(p.brand)}</span>
          <span class="detail-category">${sanitizeHTML(RAYONS_MAP[p.category]?.label || p.category)}</span>
          <div class="detail-price-row">
            <span class="detail-price">${formatPrice(p.price)}</span>
            <span class="detail-official-price">${formatPrice(p.officialPrice)}</span>
            <span class="detail-discount">${p.promoPercent}% PROMO</span>
          </div>
          <div class="detail-ref">Réf: ${sanitizeHTML(p.reference)} | GTIN: ${sanitizeHTML(p.gtin)}</div>
        </div>
      </div>
      <div class="detail-video" style="margin:1rem 0;">
        <video controls src="${p.videoUrl}" style="width:100%;border-radius:var(--radius-md);background:#000;"></video>
        <p style="font-size:.7rem;color:var(--fg-muted);margin-top:.5rem;">Vidéo démo produit (source: réseaux sociaux / site officiel)</p>
      </div>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs">
        <h4>Caractéristiques principales</h4>
        <div class="specs-grid">${Object.entries(p.specs).map(([k,v]) => `<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('')}</div>
      </div>
      <div class="detail-price-breakdown" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1rem;margin:1rem 0;">
        <h4>Détail du prix</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;font-size:.85rem;">
          <div><span style="color:var(--fg-muted);">Prix officiel :</span> <span style="text-decoration:line-through;color:var(--fg-muted);">${formatPrice(p.officialPrice)}</span></div>
          <div><span style="color:var(--accent);font-weight:700;">Promotion ${p.promoPercent}% :</span> <span style="color:var(--accent);font-weight:700;">-${p.promoPercent}%</span></div>
          <div><span style="color:var(--fg-muted);">Votre prix :</span> <span style="color:var(--accent);font-weight:800;font-size:1.1rem;">${formatPrice(p.price)}</span></div>
          <div><span style="color:var(--green);font-weight:700;">Économie :</span> <span style="color:var(--green);font-weight:700;">${formatPrice(p.officialPrice - p.price)}</span></div>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn-primary" onclick="window.keffTech.addToCart('${p.id}')" style="flex:1;padding:.8rem;font-size:.9rem;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:.5rem;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Ajouter au panier (${formatPrice(p.price)})</button>
        <button class="btn-secondary" onclick="window.keffTech.openModal('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Plus de détails</button>
      </div>`;
  }

  openModal(id){
    const p = state.products.find(x => x.id === id);
    if(!p) return;
    this.modalBody.innerHTML = `
      <h3>${sanitizeHTML(p.title)}</h3>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs" style="margin-top:1rem">
        <h4>Spécifications complètes</h4>
        <div class="specs-grid">${Object.entries(p.specs).map(([k,v]) => `<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('')}</div>
      </div>
      <div class="detail-actions" style="margin-top:1.5rem">
        <button class="btn-primary" onclick="window.keffTech.addToCart('${p.id}');window.keffTech.closeModal()">${p.stock===0?'Rupture':'Ajouter au panier'}</button>
      </div>`;
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  closeModal(){this.modal.hidden=true;document.body.style.overflow='';}

  bindCartEvents() {
    window.addEventListener('cart:change', () => this.updateCartDisplay());
  }

  updateCartDisplay() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.cartCount.textContent = totals.totalItems;
    
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  renderCartPanel() {
    const panel = document.getElementById('panel-cart');
    if (!panel) return;
    
    const items = cartManager.getItems();
    
    if (items.length === 0) {
      panel.querySelector('.panel-content').innerHTML = `
        <div class="empty-state" style="text-align:center;padding:3rem 1rem;color:var(--fg-muted);">
          <div style="font-size:3rem;margin-bottom:1rem;">🛒</div>
          <h3 style="margin-bottom:.5rem;">Panier vide</h3>
          <p>Ajoutez des produits depuis le catalogue</p>
          <button class="btn-primary" onclick="window.keffTech.switchTab('catalog')" style="margin-top:1rem;">Aller au catalogue</button>
        </div>`;
      return;
    }

    const totals = cartManager.calculateTotals(state.productsMap);
    const itemsHTML = cartManager.getItems().map(item => {
      const product = state.productsMap.get(item.productId);
      if (!product) return '';
      const lineTotal = product.price * item.quantity;
      return `
        <article class="cart-item" style="display:flex;gap:1rem;padding:1rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:.75rem;align-items:center;">
          <img src="${product.images?.[0] || `https://picsum.photos/seed/${encodeURIComponent(product.title)}/120/120.jpg`}" alt="${product.title}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius-md);">
          <div style="flex:1;min-width:0;">
            <h4 style="font-size:.9rem;font-weight:600;margin-bottom:.25rem;">${sanitizeHTML(product.title)}</h4>
            <p style="font-size:.7rem;color:var(--fg-muted);">${sanitizeHTML(product.brand)} • ${formatPrice(product.price)} x ${item.quantity}</p>
            <div style="display:flex;align-items:center;gap:.5rem;margin-top:.5rem;">
              <button onclick="window.keffTech.updateCartQty('${product.id}', ${item.quantity - 1})" class="icon-btn-sm" style="width:32px;height:32px;">−</button>
              <span style="min-width:2rem;text-align:center;font-weight:600;">${item.quantity}</span>
              <button onclick="window.keffTech.updateCartQty('${product.id}', ${item.quantity + 1})" class="icon-btn-sm" style="width:32px;height:32px;">+</button>
              <span style="margin-left:auto;font-weight:700;color:var(--accent);">${formatPrice(product.price * item.quantity)}</span>
              <button onclick="window.keffTech.removeFromCart('${product.id}')" class="icon-btn-sm" style="color:var(--danger);" aria-label="Supprimer">🗑️</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    const promoDetails = totals.details.map(d => `
      <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border);font-size:.8rem;">
        <span>${d.label}</span>
        <span style="color:var(--green);font-weight:700;">-${formatPrice(d.discount)}</span>
      </div>
    `).join('');

    const content = panel.querySelector('.panel-content');
    content.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:.5rem;">Panier (${totals.totalItems} articles)</h2>
        <p style="color:var(--fg-muted);font-size:.8rem;">${totals.uniqueItems} produit${totals.uniqueItems > 1 ? 's' : ''} différent${totals.uniqueItems > 1 ? 's' : ''}</p>
      </div>
      <div class="cart-items">${itemsHTML}</div>
      <div class="cart-summary" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:1.5rem;margin-top:1.5rem;">
        <div style="display:flex;justify-content:space-between;padding:.5rem 0;">
          <span>Sous-total</span>
          <span>${formatPrice(totals.subtotal)}</span>
        </div>
        ${totals.details.length > 0 ? `
          <div style="border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin:1rem 0;padding:1rem 0;">
            <h4 style="margin-bottom:.75rem;font-size:.9rem;">Promotions appliquées</h4>
            ${promoDetails}
          </div>
        ` : ''}
        <div style="display:flex;justify-content:space-between;padding:.5rem 0;">
          <span>Livraison</span>
          <span style="color:${totals.shipping === 0 ? 'var(--green)' : 'var(--fg)'};font-weight:700;">${totals.shipping === 0 ? 'GRATUITE' : formatPrice(totals.shipping)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-top:2px solid var(--accent);margin-top:1rem;font-size:1.1rem;font-weight:800;">
          <span>TOTAL</span>
          <span style="color:var(--accent);">${formatPrice(totals.finalTotal)}</span>
        </div>
        <div style="margin-top:1rem;padding:1rem;background:rgba(0,255,200,.05);border:1px solid var(--accent);border-radius:var(--radius-md);font-size:.75rem;color:var(--accent);">
          💡 <strong>Rappel promos :</strong> -5% par 10 articles (douanes/taxes/livraison) • Livraison gratuite 20+ articles • <strong>25% promo + livraison/douanes/taxes gratuites à 25 articles</strong> (même non abonné)
        </div>
        <div style="display:flex;gap:.75rem;margin-top:1.5rem;">
          <button class="btn-secondary" onclick="window.keffTech.switchTab('catalog')" style="flex:1;">Continuer mes achats</button>
          <button class="btn-primary" onclick="window.keffTech.checkout()" style="flex:2;padding:1rem;font-size:1rem;">Commander - ${formatPrice(totals.finalTotal)}</button>
        </div>
      `;
  }

  updateCartQty(productId, quantity) {
    cartManager.updateQuantity(productId, quantity);
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  removeFromCart(productId) {
    cartManager.remove(productId);
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  checkout() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.showToast(`Commande de ${totals.totalItems} articles pour ${formatPrice(totals.finalTotal)} - Démo seulement`, 'success');
  }

  openModal(id){
    const p = state.products.find(x => x.id === id);
    if(!p) return;
    this.modalBody.innerHTML = `
      <h3>${sanitizeHTML(p.title)}</h3>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs" style="margin-top:1rem">
        <h4>Spécifications complètes</h4>
        <div class="specs-grid">${Object.entries(p.specs).map(([k,v]) => `<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('')}</div>
      </div>
      <div class="detail-actions" style="margin-top:1.5rem">
        <button class="btn-primary" onclick="window.keffTech.addToCart('${p.id}');window.keffTech.closeModal()">${p.stock===0?'Rupture':'Ajouter au panier'}</button>
      </div>`;
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  closeModal(){this.modal.hidden=true;document.body.style.overflow='';}

  bindCartEvents() {
    window.addEventListener('cart:change', () => this.updateCartDisplay());
  }

  updateCartDisplay() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.cartCount.textContent = totals.totalItems;
    
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

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

    document.getElementById('cartBtn').addEventListener('click',()=>this.switchTab('cart'));
    document.getElementById('userBtn').addEventListener('click',()=>this.switchTab('settings'));
    document.getElementById('searchBtn').addEventListener('click',()=>{this.searchInput.focus();});
  }

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

  showToast(msg,type='success'){const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;this.toastContainer.appendChild(t);setTimeout(()=>{t.style.animation='toastIn .3s reverse';setTimeout(()=>t.remove(),300);},3500);}

  registerSW(){if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(console.warn);}}

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

  bindCartEvents() {
    window.addEventListener('cart:change', () => this.updateCartDisplay());
  }

  updateCartDisplay() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.cartCount.textContent = totals.totalItems;
    
    if (state.currentTab === 'cart') this.renderCartPanel();
  }
}

document.addEventListener('DOMContentLoaded',()=>{window.keffTech=new KiffTech();});