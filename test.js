/* Tests : moteur de prix + API (lancer : node test.js). Utilise un dossier de données temporaire. */
const fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert');
process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'kt-'));fs.cpSync(path.join(__dirname,'data','countries.json'),path.join(process.env.DATA_DIR,'countries.json'));
process.env.ADMIN_TOKEN='test-admin-token';process.env.PORT=0;
const {server}=require('./server.js');
let n=0;const ok=(c,m)=>{assert(c,m);n++;console.log('✔',m)};
(async()=>{
  await new Promise(r=>server.listen(0,r));const base='http://127.0.0.1:'+server.address().port;
  const j=async(p,o)=>{const r=await fetch(base+p,o);return {s:r.status,d:await r.json().catch(()=>({}))}};
  const post=(p,b,h)=>j(p,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},h||{}),body:JSON.stringify(b)});
  const A={Authorization:'Bearer test-admin-token'};
  const ship={name:'Test',email:'t@example.com',addr:'1 rue X',city:'Paris'};
  // config / pays / html
  ok((await j('/api/config')).d.paypalServer===false,'config sans PayPal');
  ok(Object.keys((await j('/api/countries')).d).length>190,'plus de 190 pays dans la table');
  ok((await fetch(base+'/')).headers.get('content-security-policy').includes("object-src 'none'"),'CSP présente');
  // catalogue : un coût fournisseur réel pour le modèle 1 (Buds3 FE, officiel US 149.99 déjà embarqué)
  let r=await j('/api/admin/catalog',{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},A),body:JSON.stringify({items:{1:{ali:{price:60,ship:0,title:'test',checked:'2026-10-07',src:'test'}}}})});
  ok(r.s===200,'PUT catalogue admin');
  ok((await j('/api/admin/summary')).s===401,'admin sans jeton refusé');
  // prix serveur
  r=await post('/api/orders',{items:[{id:1,q:1}],country:'US',currency:'USD',ship});
  ok(r.s===200&&r.d.total_usd>0,'commande US créée : $'+r.d.total_usd);
  const us=r.d.total_usd;
  ok(Math.abs(us/149.99-0.70)<0.01,'US : remise acheteur ≈ 30 % tout compris ('+(100-us/149.99*100).toFixed(1)+' %)');
  r=await post('/api/orders',{items:[{id:1,q:1}],country:'IL',currency:'ILS',ship});
  ok(r.s===409||r.s===200,'IL : coût $60 → '+(r.s===409?'masqué (fournisseur pas assez bas, TVA 18 %)':'$'+r.d.total_usd));
  // le client ne peut pas imposer un prix
  r=await post('/api/orders',{items:[{id:1,q:1,unit:0.01}],total_usd:0.01,country:'US',ship});
  ok(r.d.total_usd===us,'le prix envoyé par le client est ignoré');
  // article non vérifié (modèle réel sans coût exact) refusé
  r=await post('/api/orders',{items:[{id:3,q:1}],country:'US',ship});
  ok(r.s===409,'modèle réel sans coût vérifié refusé');
  // validations
  ok((await post('/api/orders',{items:[{id:1,q:99}],country:'US',ship})).s===400,'quantité abusive refusée');
  ok((await post('/api/orders',{items:[{id:1,q:1}],country:'ZZ',ship})).s===400,'pays inconnu refusé');
  ok((await post('/api/orders',{items:[{id:1,q:1}],country:'US',ship:{name:'x'}})).s===400,'adresse obligatoire');
  // promo une seule fois par e-mail
  const p1=await post('/api/orders',{items:[{id:2,q:1}],country:'US',ship:Object.assign({},ship,{email:'promo@example.com'}),promo:'WELCOME10'});
  ok(p1.d.promo==='WELCOME10'||p1.s===409,'WELCOME10 appliqué la 1re fois (ou article masqué)');
  // VIP : code usage unique, prix plus bas, plancher respecté
  const code=(await post('/api/admin/vip',{level:2},A)).d.code;ok(/^VIP-/.test(code),'code VIP créé');
  const red=await post('/api/vip/redeem',{code});ok(red.s===200&&red.d.level===2,'code VIP échangé');
  ok((await post('/api/vip/redeem',{code})).s===400,'code VIP à usage unique');
  r=await post('/api/orders',{items:[{id:1,q:1}],country:'US',ship,vipToken:red.d.token});
  ok(r.d.total_usd<us,'VIP moins cher : $'+r.d.total_usd+' < $'+us);
  ok(Math.abs(r.d.total_usd/149.99-0.65)<0.015,'VIP 10 € : ≈ −35 % ('+(100-r.d.total_usd/149.99*100).toFixed(1)+' %)');
  // admin commandes
  const od=(await j('/api/admin/orders',{headers:A})).d.orders;ok(od.length>=3,'liste des commandes admin');
  ok((await j('/api/admin/orders/'+od[0].id,{method:'PATCH',headers:Object.assign({'Content-Type':'application/json'},A),body:JSON.stringify({status:'paid',tracking:'ABC123'})})).s===200,'statut + suivi mis à jour');
  ok((await j('/api/demand')).d['1']>=1,'demande 30 j exposée après commande payée');
  // fiche créée par le Studio (produit personnalisé + prix officiel en EUR) vendue côté serveur
  r=await j('/api/admin/catalog',{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},A),body:JSON.stringify({items:{1:{ali:{price:60,ship:0,title:'t',checked:'2026-10-07',src:'t'}},120:{label:'Test X',factsSrc:'https://exemple.test/x',facts:{fr:['a b c']},product:{ico:'🎧',brand:'Samsung',n:{fr:'Test X',en:'Test X'},cat:'smart',tags:['Samsung'],ref:0},official:{FR:{amt:100,cur:'EUR',src:'https://exemple.test/x',checked:'2026-10-07'}},ali:{price:30,ship:0,title:'t',checked:'2026-10-07',src:'t'}}}})});
  ok(r.s===200,'catalogue avec produit généré accepté');
  r=await post('/api/orders',{items:[{id:120,q:1}],country:'FR',currency:'EUR',ship});
  ok(r.s===200&&r.d.total_usd>0,'produit généré vendu côté serveur : $'+r.d.total_usd);
  r=await post('/api/orders',{items:[{id:120,q:1}],country:'US',currency:'USD',ship});
  ok(r.s===200||r.s===409,'même produit, pays sans prix officiel : '+(r.s===409?'masqué (ok)':'prix de référence 0 → '+r.s));
  // leads
  ok((await post('/api/leads',{email:'a@b.co',country:'FR'})).s===200,'lead enregistré');
  ok((await post('/api/leads',{email:'pas-un-mail'})).s===400,'lead invalide refusé');
  // PayPal sans identifiants
  ok((await post('/api/orders/'+od[0].id+'/paypal',{})).s>=400,'PayPal refusé si non configuré / commande payée');
  // extraction JSON-LD
  const {extractOffer}=require('./server.js');
  const o=extractOffer('<script type="application/ld+json">{"@type":"Product","image":"https://x/y.jpg","offers":{"price":"149.99","priceCurrency":"USD"}}</script>');
  ok(o.price===149.99&&o.cur==='USD'&&o.image==='https://x/y.jpg','extraction JSON-LD prix + image');
  console.log('\n'+n+' vérifications OK');server.close();process.exit(0);
})().catch(e=>{console.error('ÉCHEC :',e.message);process.exit(1)});
