const express = require("express");
const store = require("../models/store");

const router = express.Router();

router.get("/", (_req, res) => {
  const users = store.getAllUsers();
  res.json({ users });
});

router.get("/me", (req, res) => {
  const user = store.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

router.get("/:id", (req, res) => {
  const user = store.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

module.exports = router;
