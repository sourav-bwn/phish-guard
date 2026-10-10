// Train: node tools/train.js phish.txt majestic.csv  -> public/model.json
// phish.txt: one URL per line (Phishing.Database, MIT). majestic.csv: Majestic Million (CC BY 3.0). Host-level features only, so both classes are described the same way.
const fs = require('fs');
const ML = require('../public/ml.js');
const [phishFile, majFile] = process.argv.slice(2);
function sample(arr, n, seed) { let s = seed; const out = []; const idx = arr.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { s = (s * 1664525 + 1013904223) % 4294967296; const j = s % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx.slice(0, n).map(i => arr[i]); }
const phish = new Set(); for (const l of fs.readFileSync(phishFile, 'utf8').split('\n')) { const h = ML.hostOf(l); if (h && h.includes('.') && !/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) phish.add(h); }
const benign = fs.readFileSync(majFile, 'utf8').split('\n').slice(1, 200001).map(l => (l.split(',')[2] || '').toLowerCase()).filter(h => h.includes('.'));
const N = 60000;
const P = sample([...phish], N, 7), B = sample(benign, N, 11);
const tc = {}; for (const h of [...P, ...B]) { const t = h.split('.').pop(); tc[t] = (tc[t] || 0) + 1; }
const tlds = Object.keys(tc).sort((a, b) => tc[b] - tc[a]).slice(0, 30);
let data = [...P.map(h => [h, 1]), ...B.map(h => [h, 0])];
data = sample(data, data.length, 3);
const split = Math.floor(data.length * 0.8), train = data.slice(0, split), test = data.slice(split);
const X = d => d.map(([h, y]) => [ML.features(h, tlds), y]);
const Xtr = X(train), Xte = X(test);
const names = Object.keys(Xtr[0][0]); const w = {}; names.forEach(n => w[n] = 0); let b = 0;
for (let ep = 0; ep < 25; ep++) { const lr = 0.5 / (1 + ep * 0.3);
  for (const [f, y] of Xtr) { let z = b; for (const n of names) z += w[n] * f[n]; const p = 1 / (1 + Math.exp(-z)); const g = p - y;
    b -= lr * g; for (const n of names) w[n] -= lr * (g * f[n] + 1e-5 * w[n]); } }
function evalSet(S) { let tp = 0, fp = 0, tn = 0, fn = 0; for (const [f, y] of S) { let z = b; for (const n of names) z += w[n] * f[n]; const pr = z > 0 ? 1 : 0; if (pr && y) tp++; else if (pr && !y) fp++; else if (!pr && !y) tn++; else fn++; }
  return { accuracy: (tp + tn) / S.length, precision: tp / (tp + fp), recall: tp / (tp + fn), n: S.length }; }
const metrics = evalSet(Xte);
fs.writeFileSync(__dirname + '/../public/model.json', JSON.stringify({ version: 1, tlds, bias: b, weights: Object.fromEntries(names.map(n => [n, +w[n].toFixed(4)])), metrics, trained_on: { phishing_hosts: P.length, benign_hosts: B.length, sources: ['Phishing.Database (MIT)', 'Majestic Million (CC BY 3.0)'] } }));
console.log(metrics);
