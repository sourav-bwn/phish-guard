const { handleCheck } = require('../lib/handler');

module.exports = async (req, res) => {
  res.setHeader('cache-control', 'no-store');
  let url = req.query && req.query.url;
  if (!url && req.method === 'POST') url = req.body && req.body.url;
  const out = await handleCheck(url, process.env);
  res.status(out.status).json(out.body);
};
