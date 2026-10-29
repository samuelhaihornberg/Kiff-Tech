# KiffTech

Catalogue bioluminescent dropshipping international — Abonnements 1€/sem et Trésor 3,35€/sem. PWA (Progressive Web App).

## Aperçu

Catalogue de smart devices & gadgets avec promotions automatiques (-10% à -25%), livraison gratuite, remboursement douanes/taxes. Interface PWA avec service worker, icônes, mode hors-ligne et installation sur écran d'accueil.

## Stack

- HTML5, CSS3, JavaScript (ES modules)
- Service Worker (`sw.js`) + Web App Manifest (`manifest.json`)
- Génération d'icônes via `generate-icons.js` (dépendance `canvas` uniquement pour la génération, pas pour l'exécution)
- GitHub Pages (statique)

## Utilisation

```bash
git clone https://github.com/samuelhaihornberg/Kiff-Tech.git
cd Kiff-Tech
# Ouvrir index.html directement dans le navigateur, ou servir avec un serveur HTTP :
# python3 -m http.server 8000
# npx http-server -p 8000
```

> `node_modules/` n'est requis que pour `generate-icons.js` (paquet `canvas`). Il n'est pas nécessaire pour exécuter l'application.

## Scripts

```bash
npm install          # installe canvas (pour generate-icons.js uniquement)
node generate-icons.js  # régénère les icônes PWA
```

## Déploiement

GitHub Pages activé, site servi depuis la branche `main`.

GitHub Pages : https://samuelhaihornberg.github.io/Kiff-Tech/

## Sécurité

- Pas de paiement réel
- Pas de secrets en dur (les clés API utilisent des variables d'environnement)
- CSP ready, HTTPS requis pour le PWA

## Licence

Privé — tous droits réservés.
