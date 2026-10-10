// Local dev server: node dev/server.js  ->  http://localhost:3000
const http = require('http'), fs = require('fs'), path = require('path');
const { handleCheck } = require('../lib/handler');
const PUB = path.join(__dirname, '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/check') {
    let input = u.searchParams.get('url');
    if (req.method === 'POST') {
      let b = ''; for await (const c of req) b += c;
      try { input = JSON.parse(b); } catch (e) { input = null; }
    }
    const out = await handleCheck(input, process.env, { ip: req.socket.remoteAddress });
    res.writeHead(out.status, Object.assign({ 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' }, out.headers || {}));
    return res.end(JSON.stringify(out.body));
  }
  let f = path.normalize(path.join(PUB, u.pathname === '/' ? 'index.html' : u.pathname));
  if (!f.startsWith(PUB) || !fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log('PhishGuard on http://localhost:' + (process.env.PORT || 3000)));
