const express = require("express");
const store = require("../models/store");
const { validateTask, validateTaskUpdate } = require("../utils/validators");
const { filterTasks, sortTasks, paginate } = require("../utils/helpers");

const router = express.Router();

router.get("/summary", (_req, res) => {
  const summary = store.getSummaryByStatus();
  res.json({ byStatus: summary });
});

router.get("/overdue", (_req, res) => {
  const tasks = store.getOverdueTasks();
  res.json({ tasks });
});

router.get("/", (req, res) => {
  let tasks = store.getAllTasks();

  tasks = filterTasks(tasks, req.query);
  tasks = sortTasks(tasks, req.query.sortBy, req.query.order);

  const page = parseInt(req.query.page, 10) || 1;
  const perPage = parseInt(req.query.limit, 10) || 10;

  const result = paginate(tasks, page, perPage);
  res.json(result);
});

router.get("/:id", (req, res) => {
  const task = store.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ task });
});

router.post("/", (req, res) => {
  const errors = validateTask(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const task = store.createTask(req.body);
  res.status(200).json({ task });
});

router.put("/:id", (req, res) => {
  const existing = store.getTaskById(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const errors = validateTaskUpdate(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const task = store.updateTask(req.params.id, req.body);
  res.json({ task });
});

router.patch("/:id/complete", (req, res) => {
  const task = store.completeTask(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json({ task });
});

router.delete("/:id", (req, res) => {
  const success = store.deleteTask(req.params.id);

  if (!success) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
});

router.post("/bulk", (req, res) => {
  const { tasks: items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "body.tasks must be an array" });
  }

  const created = [];
  for (const item of items) {
    const errors = validateTask(item);
    if (errors.length > 0) {
      return res.status(400).json({ errors, index: created.length });
    }
    created.push(store.createTask(item));
  }

  res.status(201).json({ tasks: created });
});

module.exports = router;
