const API_KEYS = new Set([
  'sk-test-key-001',
  'sk-test-key-002',
]);

function authMiddleware(req, res, next) {
  if (req.path === '/health') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey || !API_KEYS.has(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next();
}

module.exports = authMiddleware;
