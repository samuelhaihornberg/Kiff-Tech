# Kiff Tech — 1 fichier (index.html) qui contient le front ET le backend

    node server.js            # http://localhost:3000   (Node 18+, aucune dépendance)
    node test.js              # 26 vérifications API/prix

**Mode autonome** : ouvre `index.html` seul. Un backend embarqué tourne dans le navigateur (mêmes routes que server.js : commandes, leads, codes VIP, admin), données enregistrées dans CE navigateur.
**Mode serveur** : `index.html` contient aussi le code de `server.js` (page coulisses → « Télécharger server.js »). Mets les deux fichiers côte à côte et lance `node server.js` : le serveur prend le relais automatiquement (commandes de tous les visiteurs, PayPal vérifié, synchro officielle, lecture des pages officielles pour le Studio).
`node build.js` ré-embarque server.js dans index.html après une modification.

Fichiers : `index.html` · `server.js` · `sw.js` · `build.js` · `data/*.json`.

## Variables d'environnement (toutes optionnelles)
ADMIN_TOKEN · PORT · PAYPAL_CLIENT_ID + PAYPAL_SECRET (+ PAYPAL_MODE=live) · TRUST_PROXY=1 (derrière Nginx/Cloudflare) ·
SYNC_EVERY_HOURS=24 · SYNC_AUTO_APPLY=1 · ALLOW_OFFICIAL_IMAGES=1 (uniquement avec autorisation écrite).
Sans ADMIN_TOKEN, un jeton est généré dans `data/admin_token.txt`.

## Ce que fait le serveur
- Recalcule TOUS les prix avec le moteur de index.html (le client ne fixe jamais le prix), TVA du pays incluse.
- Commandes (`/api/orders`), paiement PayPal vérifié côté serveur (montant + statut), leads, codes VIP, demande 30 j.
- Pays par IP (`/api/geo` : en-têtes Cloudflare/Vercel/… sinon ipwho.is), 215 pays/territoires sans exclusion (TVA estimées, à vérifier).
- Synchro officielle : lit les pages listées dans `data/sources.json` (JSON-LD / og:image), respecte robots.txt, 1 requête/1,5 s.
  Les prix détectés sont des candidats à valider dans « coulisses » (ou auto avec SYNC_AUTO_APPLY=1).
- Admin : `index.html#coulisses` → jeton → publier le catalogue, commandes (articles à commander chez le fournisseur, suivi), leads, codes VIP, synchro.

## À savoir
- Les TVA par pays sont des valeurs de départ à vérifier ; les taxes par État américain ne sont pas calculées (le champ État est enregistré).
- VIP : codes à usage unique créés dans « coulisses » ; PayPal Abonnements n'est pas branché.
- Un modèle officiel n'est publié qu'avec un coût fournisseur exact ET un score de preuve ≥ 30 (réglable).
- Ouvert sans serveur (double-clic), index.html reste en mode test local.
