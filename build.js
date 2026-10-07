/* Embarque server.js dans index.html (bloc #server-src) : lance `node build.js` après chaque modification de server.js. */
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8'); const s = fs.readFileSync('server.js', 'utf8');
if (/<\/script/i.test(s) || s.includes('<!--')) throw new Error('server.js contient une séquence interdite dans une balise <script>');
const B = '<!--SERVER-SRC-BEGIN-->', E = '<!--SERVER-SRC-END-->', block = B + '\n<script type="text/plain" id="server-src">' + s + '</script>\n' + E;
const a = h.indexOf(B), b = h.indexOf(E);
if (a >= 0 && b > a) h = h.slice(0, a) + block + h.slice(b + E.length);
else { const i = h.lastIndexOf('</body>'); if (i < 0) throw new Error('</body> introuvable'); h = h.slice(0, i) + block + '\n' + h.slice(i); }
fs.writeFileSync('index.html', h); console.log('server.js embarqué dans index.html (' + s.length + ' octets)');
