const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'icons');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function drawIcon(size, filename, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Deep background
  ctx.fillStyle = '#03050a';
  ctx.fillRect(0, 0, size, size);

  // Subtle grid
  ctx.strokeStyle = 'rgba(0,255,200,.03)';
  ctx.lineWidth = 0.5;
  const step = size / 12;
  for (let i = 0; i <= 12; i++) {
    ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(size, i * step); ctx.stroke();
  }

  // Hexagon logo
  const cx = size / 2, cy = size / 2;
  const r = size * (maskable ? 0.32 : 0.38);

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#00ffc8');
  grad.addColorStop(0.5, '#0066ff');
  grad.addColorStop(1, '#b84dff');
  ctx.fillStyle = grad;
  ctx.fill();

  // Glow stroke
  ctx.shadowColor = '#00ffc8';
  ctx.shadowBlur = size * 0.06;
  ctx.strokeStyle = '#00ffc8';
  ctx.lineWidth = size * 0.015;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Inner hexagon
  const r2 = r * 0.55;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r2 * Math.cos(angle);
    const y = cy + r2 * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255,255,255,.3)';
  ctx.lineWidth = size * 0.008;
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.03, 0, Math.PI * 2);
  ctx.fillStyle = '#00ffc8';
  ctx.fill();

  // Maskable safe zone
  if (maskable) {
    const safeR = size * 0.38;
    ctx.beginPath();
    ctx.arc(cx, cy, safeR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,255,200,.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([size * 0.02, size * 0.02]);
    ctx.stroke();
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUT, filename), buffer);
  console.log(`Generated ${filename} (${size}x${size})`);
}

function drawFavicon() {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#03050a';
  ctx.fillRect(0, 0, 32, 32);
  const cx = 16, cy = 16, r = 11;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 32, 32);
  grad.addColorStop(0, '#00ffc8');
  grad.addColorStop(1, '#0066ff');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#00ffc8';
  ctx.lineWidth = 1;
  ctx.stroke();
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), canvas.toBuffer('image/png'));
  console.log('Generated favicon.ico (32x32)');
}

drawIcon(192, 'icon-192.png');
drawIcon(512, 'icon-512.png');
drawIcon(512, 'maskable-512.png', true);
drawIcon(180, 'apple-touch-icon.png');
drawFavicon();

console.log('All icons generated!');