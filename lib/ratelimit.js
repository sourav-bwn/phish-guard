// Small sliding-window limiter. Serverless-friendly: state lives in the warm instance only,
// so this is best-effort protection for the free tiers, not a hard guarantee across instances.
function createLimiter(opts) {
  const limit = opts.limit, windowMs = opts.windowMs, now = opts.now || Date.now, maxKeys = opts.maxKeys || 5000;
  const hits = new Map();
  function prune(t) {
    for (const [k, arr] of hits) {
      while (arr.length && arr[0] <= t - windowMs) arr.shift();
      if (!arr.length) hits.delete(k);
    }
  }
  return {
    // returns { ok, retryAfter } and records the hit only when allowed
    take(key) {
      const t = now();
      if (hits.size > maxKeys) prune(t);
      let arr = hits.get(key);
      if (!arr) { arr = []; hits.set(key, arr); }
      while (arr.length && arr[0] <= t - windowMs) arr.shift();
      if (arr.length >= limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((arr[0] + windowMs - t) / 1000)) };
      arr.push(t);
      return { ok: true, retryAfter: 0 };
    },
    size() { return hits.size; }
  };
}
module.exports = { createLimiter };
