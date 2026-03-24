const store = require("../models/store");

const ALLOWED_KEYS = new Set(["key-alice-admin", "key-bob-member"]);

function authMiddleware(req, res, next) {
  if (req.path === "/health") {
    return next();
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !ALLOWED_KEYS.has(apiKey)) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
  }

  const user = store.getUserByApiKey(apiKey);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
  }

  const { apiKey: _k, ...safe } = user;
  req.user = safe;
  next();
}

module.exports = { authMiddleware };
