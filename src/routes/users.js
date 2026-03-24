const express = require("express");
const store = require("../models/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, (_req, res) => {
  const users = store.getAllUsers();
  res.json({ users });
});

router.get("/me", authenticate, (req, res) => {
  const user = store.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

router.get("/:id", authenticate, (req, res) => {
  const user = store.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

module.exports = router;
