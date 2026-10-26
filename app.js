/* ===== KiffTech — Catalogue Smart Devices & Gadgets ===== */

// ---------- RAYONS (Catégories visuelles) ----------
const RAYONS = [
  { id: 'smartphones', label: 'Smartphones et accessoires', icon: '📱', color: '#00d4ff', desc: 'Téléphones, coques, protections écran, accessoires' },
  { id: 'montres', label: 'Montres connectées', icon: '⌚', color: '#00ff88', desc: 'Smartwatches, trackers fitness, bracelets santé' },
  { id: 'audio', label: 'Écouteurs, casques et enceintes', icon: '🎧', color: '#ff2d95', desc: 'True wireless, casques ANC, enceintes portables' },
  { id: 'maison', label: 'Maison connectée', icon: '🏠', color: '#ff6b00', desc: 'Ampoules, prises, capteurs, hubs, assistants vocaux' },
  { id: 'securite', label: 'Caméras et sécurité', icon: '🔒', color: '#b84dff', desc: 'Caméras IP, sonnettes vidéo, alarmes, serrures' },
  { id: 'gaming', label: 'Gaming et gadgets gaming', icon: '🎮', color: '#ff6b00', desc: 'Manettes, claviers, souris, casques, accessoires' },
  { id: 'robots', label: 'Robots et assistants intelligents', icon: '🤖', color: '#00ffc8', desc: 'Aspirateurs, tondeuses, assistants IA, robots éducatifs' },
  { id: 'drones', label: 'Drones et gadgets télécommandés', icon: '🚁', color: '#ffd23f', desc: 'Drones caméra, FPV, voitures, bateaux RC' },
  { id: 'informatique', label: 'Informatique et accessoires', icon: '💻', color: '#0066ff', desc: 'Claviers, souris, hubs, docks, écrans, stockage' },
  { id: 'energie', label: 'Chargeurs, batteries et énergie portable', icon: '🔋', color: '#00ff88', desc: 'Powerbanks, chargeurs GaN, stations, solaire portable' },
  { id: 'auto', label: 'Gadgets automobiles', icon: '🚗', color: '#ff6b00', desc: 'Chargeurs, caméras, purificateurs, accessoires voiture' },
  { id: 'vr', label: 'Réalité virtuelle et augmentée', icon: '🥽', color: '#b84dff', desc: 'Casques VR, lunettes AR, contrôleurs, accessoires' }
];

// ---------- MARQUES PAR RAYON ----------
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

  const rayTemplates = templates[rayonId] || [{ prefix: 'Produit', suffix: ['1', '2', '3'], brand: brands[0] }];
  
  for (let i = 0; i < count; i++) {
    const template = rayTemplates[i % rayTemplates.length];
    const brand = template.brand;
    const suffix = template.suffix[i % template.suffix.length];
    const title = `${brand} ${template.prefix} ${suffix}`;
    
    const basePrice = Math.round((30 + Math.random() * 800) * 100) / 100;
    const refPrice = Math.round(basePrice * (1.1 + Math.random() * 0.3) * 100) / 100;
    const discount = Math.round((1 - basePrice / refPrice) * 100);
    const stock = Math.random() > 0.1 ? Math.floor(Math.random() * 200) : 0;
    
    products.push({
      id: `KT-${rayonId.toUpperCase()}-${String(i+1).padStart(3,'0')}`,
      title,
      category: rayonId,
      brand,
      supplier: 'demo',
      supplierName: 'KiffTech Demo',
      price: basePrice,
      refPrice,
      discount,
      stock,
      image: `https://picsum.photos/seed/${encodeURIComponent(brand + title + i)}/400/400.jpg`,
      specs: generateSpecs(rayonId, brand),
      tags: discount > 20 ? ['promo'] : stock === 0 ? ['rupture'] : i < 2 ? ['nouveau'] : [],
      description: `${title} — ${RAYONS.find(r => r.id === rayonId)?.desc || 'Produit tech'}. Prix compétitif, livraison rapide.`
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

// Générer tous les produits
let DEMO_PRODUCTS = [];
RAYONS.forEach(rayon => {
  DEMO_PRODUCTS = DEMO_PRODUCTS.concat(generateProductsForRayon(rayon.id, 8));
});

// Mélanger pour variété
DEMO_PRODUCTS = DEMO_PRODUCTS.sort(() => Math.random() - 0.5);

// ---------- UTILITIES ----------
function sanitizeHTML(str){const div=document.createElement('div');div.textContent=str;return div.innerHTML;}
function formatPrice(val,currency='€'){return val.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+currency;}
function formatDiscount(pct){return pct>0?`-${pct}%`:'';}
function debounce(fn,ms){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};}

// ---------- STATE ----------
const state = {
  products: DEMO_PRODUCTS,
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
  importSources: [
    {id:'techdata',name:'TechData Europe',type:'api',status:'active',cron:'0 6 * * *',enabled:true,mapping:{sku:'SKU',title:'ProductName',price:'Price',stock:'Qty',category:'Category'}},
    {id:'ingram',name:'Ingram Micro',type:'csv',status:'active',cron:'0 7 * * *',enabled:true,mapping:{sku:'ItemID',title:'Description',price:'Cost',stock:'Available',category:'Cat'}},
    {id:'also',name:'ALSO Holding',type:'xml',status:'paused',cron:'',enabled:false,mapping:{}},
    {id:'tdsynnex',name:'TD SYNNEX',type:'api',status:'active',cron:'0 5 * * *',enabled:true,mapping:{sku:'PartNumber',title:'Name',price:'DealerPrice',stock:'StockLevel',category:'Group'}},
  ],
  schedules: [],
  mappings: {globalDiscount:10,targetMargin:35,autoPriceUpdate:true,verifyRefPrice:true},
  cart: [],
  toastQueue: [],
};

// ---------- MAIN CLASS ----------
class KiffTech{
  constructor(){
    this.tabs = ['catalog','product','subscriptions','import','settings'];
    this.tabLabels = {catalog:'Catalogue',product:'Produit',subscriptions:'Abonnements',import:'Import',settings:'Réglages'};
    this.tabIcons = {
      catalog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><line x1="4" y1="6" x2="4" y2="18"/><line x1="20" y1="6" x2="20" y2="18"/></svg>',
      product:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9"/><path d="M11 7v10"/><path d="M18 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/></svg>',
      subscriptions:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      import:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
      settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    };

    this.mainTabs = document.getElementById('mainTabs');
    this.bottomTabs = document.getElementById('bottomTabs');
    this.productsGrid = document.getElementById('productsGrid');
    this.loadMore = document.getElementById('loadMore');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.supplierFilter = document.getElementById('supplierFilter');
    this.searchInput = document.getElementById('searchInput');
    this.productDetail = document.getElementById('productDetail');
    this.cartCount = document.getElementById('cartCount');
    this.importSources = document.getElementById('importSources');
    this.scheduleList = document.getElementById('scheduleList');
    this.mappingsTable = document.getElementById('mappingsTable');
    this.currentSub = document.getElementById('currentSub');
    this.subActions = document.getElementById('subActions');
    this.globalDiscount = document.getElementById('globalDiscount');
    this.globalDiscountVal = document.getElementById('globalDiscountVal');
    this.targetMargin = document.getElementById('targetMargin');
    this.targetMarginVal = document.getElementById('targetMarginVal');
    this.autoPriceUpdate = document.getElementById('autoPriceUpdate');
    this.verifyRefPrice = document.getElementById('verifyRefPrice');
    this.exportCSV = document.getElementById('exportCSV');
    this.exportJSON = document.getElementById('exportJSON');
    this.importCSV = document.getElementById('importCSV');
    this.csvImportInput = document.getElementById('csvImportInput');
    this.addSourceBtn = document.getElementById('addSourceBtn');
    this.addScheduleBtn = document.getElementById('addScheduleBtn');
    this.modal = document.getElementById('productModal');
    this.modalBody = document.getElementById('modalBody');
    this.toastContainer = document.getElementById('toastContainer');
    this.splashBar = document.getElementById('splashBar');
    this.splashText = document.getElementById('splashText');

    this.currentRayon = null;
    this.currentRayonProducts = [];
    this.rayonSort = 'featured';

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
    if(tab==='catalog' && this.currentRayon) this.renderRayonProducts();
  }

  // ---------- FILTRES ----------
  populateFilters(){
    // Catégories = rayons
    this.categoryFilter.innerHTML = '<option value="">Tous les rayons</option>' + RAYONS.map(r=>`<option value="${r.id}">${r.label}</option>`).join('');
    this.supplierFilter.innerHTML = '<option value="">Tous fournisseurs</option>' + [...new Set(state.products.map(p=>p.supplierName))].map(s=>`<option value="${s}">${s}</option>`).join('');
  }

  applyFilters=debounce(()=>{
    state.currentCategory=this.categoryFilter.value;
    state.currentSupplier=this.supplierFilter.value;
    state.currentSearch=this.searchInput.value.toLowerCase();
    state.visibleCount=24;

    let baseProducts = state.products;
    
    // Filtrer par rayon si sélectionné
    if(this.currentRayon){
      baseProducts = baseProducts.filter(p => p.category === this.currentRayon);
    } else if(state.currentCategory){
      baseProducts = baseProducts.filter(p => p.category === state.currentCategory);
    }
    
    if(state.currentSupplier) baseProducts = baseProducts.filter(p => p.supplierName === state.currentSupplier);
    if(state.currentSearch) baseProducts = baseProducts.filter(p => p.title.toLowerCase().includes(state.currentSearch) || p.description.toLowerCase().includes(state.currentSearch) || p.brand.toLowerCase().includes(state.currentSearch));

    state.filteredProducts = baseProducts;
    this.renderProducts();
  },150);

  renderProducts(){
    const toShow = state.filteredProducts.slice(0, state.visibleCount);
    const grid = this.productsGrid;
    
    if(this.currentRayon){
      // Mode rayon : affichage cartes produits
      grid.innerHTML = toShow.map(p => this.productCardHTML(p)).join('');
    } else {
      // Mode catalogue : afficher les rayons
      grid.innerHTML = RAYONS.map(r => this.rayonCardHTML(r)).join('');
      this.bindRayonCards();
    }
    
    this.loadMore.hidden = state.visibleCount >= state.filteredProducts.length;

    grid.querySelectorAll('.product-card').forEach(card=>{
      card.addEventListener('click',()=>this.openProduct(card.dataset.id));
      const btn = card.querySelector('.product-action');
      if(btn) btn.addEventListener('click',(e)=>{e.stopPropagation();this.addToCart(card.dataset.id);});
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
        <button class="rayon-btn" type="button" aria-label="Voir ${r.label}">Explorer</button>
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
    this.applyFilters(); // This will render products for this rayon
    this.showRayonHeader(rayonId);
  }

  showRayonHeader(rayonId){
    const rayon = RAYONS.find(r => r.id === rayonId);
    if(!rayon) return;
    
    const header = this.productsGrid.parentElement.querySelector('.panel-header');
    if(header){
      header.innerHTML = `
        <div class="rayon-header" style="--rayon-color:${rayon.color};">
          <button class="btn-back" onclick="window.keffTech.closeRayon()" aria-label="Retour au catalogue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
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
              ${BRANDS_BY_RAYON[this.currentRayon]?.map(b=>`<option value="${b}">${b}</option>`).join('') || ''}
            </select>
          </div>
        `;
    }
  }

  closeRayon(){
    this.currentRayon = null;
    this.currentRayonProducts = [];
    this.applyFilters(); // Returns to rayons view
    const header = this.productsGrid.parentElement.querySelector('.panel-header');
    if(header){
      header.innerHTML = `
        <h2>Catalogue</h2>
        <div class="filter-bar">
          <select id="categoryFilter" aria-label="Filtrer par rayon"><option value="">Tous les rayons</option></select>
          <select id="supplierFilter" aria-label="Filtrer par fournisseur"><option value="">Tous fournisseurs</option></select>
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
      case 'discount': this.currentRayonProducts.sort((a,b)=>b.discount-a.discount); break;
      default: break;
    }
  }

  // Override applyFilters to handle rayon-specific filtering
  applyFilters(){
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
  }

  // ---------- PRODUCT CARD ----------
  productCardHTML(p){
    const badge = p.tags.includes('nouveau') ? '<span class="product-badge badge-new">Nouveau</span>' : 
                  p.tags.includes('promo') ? '<span class="product-badge badge-promo">Promo</span>' : 
                  p.tags.includes('rupture') ? '<span class="product-badge badge-stock">Rupture</span>' : '';
    const ref = formatPrice(p.refPrice);
    const disc = formatDiscount(p.discount);
    return `<article class="product-card" data-id="${p.id}" role="listitem">
      <div class="product-thumb" style="background-image:url('${p.image}')">${badge}</div>
      <div class="product-info">
        <h3 class="product-title">${sanitizeHTML(p.title)}</h3>
        <div class="product-meta">
          <span class="product-brand" style="background:${this.getBrandColor(p.brand)}20;color:${this.getBrandColor(p.brand)};border-color:${this.getBrandColor(p.brand)}40;">${sanitizeHTML(p.brand)}</span>
          ${p.category !== this.currentRayon ? `<span class="product-category">${sanitizeHTML(RAYONS.find(r=>r.id===p.category)?.label||p.category)}</span>` : ''}
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(p.price)}</span>
          ${p.refPrice>p.price?`<span class="product-ref-price">${formatPrice(p.refPrice)}</span><span class="product-discount">${formatDiscount(p.discount)}</span>`:''}
        </div>
        <button class="product-action" type="button" ${p.stock===0?'disabled':''}>${p.stock===0?'Rupture':'Voir le produit'}</button>
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

  // ---------- PRODUCT DETAIL ----------
  openProduct(id){
    state.currentProduct = state.products.find(p => p.id === id);
    if(state.currentProduct) this.switchTab('product');
  }

  renderProductDetail(){
    if(!state.currentProduct){this.productDetail.innerHTML='<p class="empty">Aucun produit sélectionné</p>';return;}
    const p = state.currentProduct;
    const specsHTML = Object.entries(p.specs).map(([k,v])=>`<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('');
    this.productDetail.innerHTML = `
      <div class="detail-header">
        <div class="detail-thumb" style="background-image:url('${p.image}')"></div>
        <div class="detail-meta">
          <h2 class="detail-title">${sanitizeHTML(p.title)}</h2>
          <span class="detail-brand" style="background:${this.getBrandColor(p.brand)}20;color:${this.getBrandColor(p.brand)};border-color:${this.getBrandColor(p.brand)}40;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:600;">${sanitizeHTML(p.brand)}</span>
          <span class="detail-category">${sanitizeHTML(RAYONS.find(r=>r.id===p.category)?.label||p.category)}</span>
          <div class="detail-price-row">
            <span class="detail-price">${formatPrice(p.price)}</span>
            ${p.refPrice>p.price?`<span class="detail-ref-price">${formatPrice(p.refPrice)}</span><span class="detail-discount">${formatDiscount(p.discount)}</span>`:''}
          </div>
        </div>
      </div>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs">
        <h4>Caractéristiques principales</h4>
        <div class="specs-grid">${Object.entries(p.specs).map(([k,v])=>`<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('')}</div>
      </div>
      <div class="detail-actions">
        <button class="btn-secondary" onclick="window.keffTech.addToCart('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ${p.stock===0?'Rupture de stock':'Ajouter au panier'}</button>
        <button class="btn-secondary" onclick="window.keffTech.openModal('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Détails</button>
      </div>`;
  }

  // ---------- MODAL ----------
  openModal(id){
    const p = state.products.find(x => x.id === id);
    if(!p) return;
    this.modalBody.innerHTML = `
      <h3>${sanitizeHTML(p.title)}</h3>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div class="detail-specs" style="margin-top:1rem">
        <h4>Spécifications complètes</h4>
        <div class="specs-grid">${Object.entries(p.specs).map(([k,v])=>`<div class="spec-item"><div class="spec-label">${sanitizeHTML(k)}</div><div class="spec-value">${sanitizeHTML(v)}</div></div>`).join('')}</div>
      </div>
      <div class="detail-actions" style="margin-top:1.5rem">
        <button class="btn-primary" onclick="window.keffTech.addToCart('${p.id}');window.keffTech.closeModal()">${p.stock===0?'Rupture':'Ajouter au panier'}</button>
      </div>`;
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  closeModal(){this.modal.hidden=true;document.body.style.overflow='';}

  // ---------- CART ----------
  addToCart(id){
    const p = state.products.find(x => x.id === id);
    if(!p || p.stock===0) return;
    const existing = state.cart.find(i => i.id === id);
    if(existing) existing.qty++;
    else state.cart.push({...p,qty:1});
    this.updateCartCount();
    this.showToast(`${p.title} ajouté au panier`,'success');
  }
  updateCartCount(){const total=state.cart.reduce((s,i)=>s+i.qty,0);this.cartCount.textContent=total;}
  getCartTotal(){return state.cart.reduce((s,i)=>s+i.price*i.qty,0);}

  // ---------- IMPORT (inchangé) ----------
  renderImportSources(){
    this.importSources.innerHTML=state.importSources.map(s=>`
      <div class="import-source">
        <div class="source-info">
          <div class="source-icon ${s.type}">${this.sourceIcon(s.type)}</div>
          <div><div class="source-name">${sanitizeHTML(s.name)}</div><span class="source-status status-${s.status}">${s.status==='active'?'Actif':'En pause'}</span></div>
        </div>
        <div class="source-actions">
          <button class="icon-btn-sm" onclick="window.keffTech.toggleSource('${s.id}')" aria-label="${s.status==='active'?'Pause':'Activer'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${s.status==='active'?'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>':'<polygon points="5 3 19 12 5 21 5 3"/>'}</svg></button>
          <button class="icon-btn-sm" onclick="window.keffTech.editSource('${s.id}')" aria-label="Configurer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
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

  // ---------- SUBSCRIPTIONS (inchangé) ----------
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

  // ---------- SETTINGS (inchangé) ----------
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

    document.getElementById('cartBtn').addEventListener('click',()=>this.showToast(`Panier: ${state.cart.length} articles, ${formatPrice(this.getCartTotal())}`));
    document.getElementById('userBtn').addEventListener('click',()=>this.switchTab('settings'));
    document.getElementById('searchBtn').addEventListener('click',()=>{this.searchInput.focus();});
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