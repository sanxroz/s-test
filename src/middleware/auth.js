const store = require("../models/store");

function authenticate(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key. Provide x-api-key header." });
  }

  const user = store.getUserByApiKey(apiKey);

  if (!user) {
    return res.status(401).json({ error: "Invalid API key." });
  }

  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
