// Local dev server: node dev/server.js  ->  http://localhost:3000
const http = require('http'), fs = require('fs'), path = require('path');
const { handleCheck } = require('../lib/handler');
const PUB = path.join(__dirname, '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/check') {
    const out = await handleCheck(u.searchParams.get('url'), process.env);
    res.writeHead(out.status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    return res.end(JSON.stringify(out.body));
  }
  let f = path.normalize(path.join(PUB, u.pathname === '/' ? 'index.html' : u.pathname));
  if (!f.startsWith(PUB) || !fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log('PhishGuard on http://localhost:' + (process.env.PORT || 3000)));
