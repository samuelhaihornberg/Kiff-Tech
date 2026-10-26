# PROGRESSION KiffTech — Dropshipping Bioluminescent

**Dernière MAJ** : 2026-10-26
**Objectif** : SPA PWA dropshipping international, catalogue bioluminescent, abonnements, import auto

## État global : 85%

| Public | Progression | Justification |
|--------|-------------|---------------|
| Client / User | 85% | PWA installable, catalogue interactif, fiches produits, panier, abonnements |
| Développeur | 80% | Architecture import, mappings, mappings, export CSV/JSON, SW offline |
| Admin | 70% | Remises configurables, vérification prix référence, planification cron (Trésor) |

## Checklist PWA

- [x] `manifest.json` (icônes PNG 192/512/maskable/apple-touch, thème, `display: standalone`, `scope: "./"`, `id: "./"`, `orientation: "portrait-primary"`, `shortcuts`, `categories`)
- [x] Service Worker (`sw.js` v1) : network-first nav, cache-first assets, purge anciens caches, `skipWaiting`/`clients.claim`
- [x] Registration SW dans `app.js` + `install.js`
- [x] Gestion `beforeinstallprompt` → bouton installer, aide iOS
- [x] Meta `theme-color`, `apple-mobile-web-app-*`, `link rel=manifest`
- [x] Icônes PNG réelles : 192x192, 512x512, 512x512 maskable, apple-touch-icon 180x180, favicon.ico (générées Canvas)
- [x] `scope: "./"` et `id: "./"` pour GitHub Pages
- [x] `orientation: "portrait-primary"` (app mobile)
- [x] Shortcuts : Catalogue, Abonnements

## Fonctionnalités implémentées (Étape 1 - Démo)

### Catalogue Bioluminescent
- [x] 120 produits démo générés (pas de vraies données) — marques, catégories, fournisseurs réalistes
- [x] Grille responsive (2-4 colonnes), scroll infini "Charger plus"
- [x] Filtres : catégorie, fournisseur, recherche temps réel (debounced)
- [x] Cartes produit : image (Unsplash), badge (Nouveau/Promo/Rupture), prix, prix référence barré, remise %, stock, bouton ajouter
- [x] Fiche produit modale + page dédiée : specs complètes, description, actions
- [x] Design bioluminescent : particules, glow, glassmorphism, thème sombre #03050a, accent #00ffc8

### Abonnements
- [x] **Basic** : 1€/semaine — catalogue complet, prix référence, alertes stock, import CSV manuel
- [x] **Trésor** : 3,35€/semaine — tout Basic + import auto cron, remises 5-25% configurables, API REST + webhooks, sync temps réel, rapports marge/ROI
- [x] UI cartes avec ruban "TRÉSOR", glow doré, liste features, bouton d'activation
- [x] Gestion état abonnement (actif/annulé), persistance locale (démo)

### Import Automatisé (Architecture)
- [x] 4 sources démo : TechData (API), Ingram Micro (CSV), ALSO (XML), TD SYNNEX (API)
- [x] Statut actif/pause, toggle, configuration par source
- [x] Mappings champs configurables par source (SKU, titre, prix, stock, catégorie)
- [x] Planification cron (Trésor uniquement) : liste tâches, activation/désactivation
- [x] Tableau mappings croisé sources × champs
- [x] Remises globales (slider 0-30%), marge cible (10-100%), auto-update prix, vérif prix référence

### Panier & Export
- [x] Panier persistant (localStorage), compteur badge, total
- [x] Export catalogue CSV / JSON
- [x] Import CSV (lecture FileReader, parsing basique)
- [x] Toast notifications (succès/erreur)

### Technique
- [x] PWA complète : SW v1, manifest, install prompt, splash screen animée
- [x] Bioluminescent particles (18, respect `prefers-reduced-motion`)
- [x] Responsive mobile-first : 360px → 1024px+, safe-area insets
- [x] Navigation : tabs top (scroll-snap), bottom bar (5 sections), keyboard/gamepad ready
- [x] Pas de framework, pas de build, ES module, chemins relatifs `./`
- [x] Médias : images Unsplash (libres usage commercial), icônes générées Canvas
- [x] Aucune donnée réelle présentée comme telle — tout est démo explicite

## Fichiers déployés

- `index.html` (HTML sémantique, 5 panels, modal, splash, toasts)
- `style.css` (bioluminescent, glassmorphism, grid, responsive, animations)
- `app.js` (ES module, state, catalogue, abonnements, import, export, cart, SW, install)
- `sw.js` v1 (network-first nav, cache-first assets, version statique)
- `manifest.json` (PWA complet, shortcuts, categories)
- `install.js` (beforeinstallprompt, SW update banner)
- `icons/` : icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png, favicon.ico
- `tools/check-pwa.js` (validateur autonome)
- `generate-icons.js` (générateur Canvas)
- `package.json` / `package-lock.json` (canvas dependency)

## Vérifications effectuées

- [x] `node --check` sur app.js, sw.js, install.js, generate-icons.js ✅
- [x] `manifest.json` JSON valide ✅
- [x] `node tools/check-pwa.js` → 67 OK, 0 erreurs ✅
- [x] Serveur local `python3 -m http.server 8081` : tous fichiers 200 ✅
- [x] Chemins relatifs uniquement (aucun `/` absolu) ✅
- [x] Syntaxe JS validée ✅

## À tester sur téléphone (manuel)

- [ ] Installation Android Chrome (beforeinstallprompt → bouton « Installer »)
- [ ] Installation iOS Safari (aide « Partager ▸ Sur l'écran d'accueil »)
- [ ] Mode avion / hors ligne : catalogue + assets servis depuis cache
- [ ] Navigation : tabs, bottom bar, swipe, clavier, gamepad
- [ ] Catalogue : filtres, recherche, chargement plus, fiche produit, panier
- [ ] Abonnements : activation Basic/Trésor, annulation, UI état
- [ ] Import : sources, mappings, planification (Trésor)
- [ ] Réglages : sliders remises/marge, checkboxes, export/import CSV
- [ ] Lisibilité : texte 16px+, contraste, cibles tactiles 44px, pas de débordement 360px
- [ ] Particules désactivées si `prefers-reduced-motion`
- [ ] Mise à jour SW : banner « Nouvelle version disponible » + rechargement

## Prochaines actions (Étapes suivantes)

1. **Tests manuels Android/iOS** (cf. liste ci-dessus)
2. **Backend réel** : API Node/Express pour authentification, paiements (Stripe), webhooks fournisseurs
3. **Base de données** : PostgreSQL (produits, commandes, users, abonnements, logs import)
4. **Import réel** : Connecteurs API fournisseurs (TechData, Ingram, TD SYNNEX), parsing CSV/XML/JSON robuste, queue Bull/Redis
5. **Prix référence vérifiables** : Intégration APIs publiques (Keepa, CamelCamelCamel, PrixMoinsCher) + comparaison automatique
6. **Remises dynamiques** : Moteur de règles (paliers volume, fidélité, promo fournisseur)
7. **Trésor avancé** : API REST documentée (OpenAPI), webhooks commandes/stock, sync temps réel WebSocket
8. **Admin dashboard** : Analytics ventes, marge, ROI, alertes stock, gestion utilisateurs
9. **Lighthouse PWA audit** → corriger alertes
10. **Push GitHub Pages** si validé (ou déploiement Vercel/Netlify pour backend)

## Notes

- **Architecture** : SPA vanilla ES module, CSS custom properties, IndexedDB/localStorage pour persistance démo
- **Données** : 100% démo (générées `generateDemoProducts()`), images Unsplash (commercial free), pas de vraies clés API
- **Design** : Bioluminescent sci-fi, #03050a bg, #00ffc8 accent, glassmorphism, particules, glow subtils
- **Sécurité** : Pas de paiement réel, pas de secrets en dur, CSP ready, HTTPS requis pour PWA
- **Accessibilité** : ARIA labels, roles, focus-visible, contrastes, reduced-motion, sémantique HTML5