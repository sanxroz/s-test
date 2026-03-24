const express = require("express");
const store = require("../models/store");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { validateTask, validateTaskUpdate, checkTitleUniqueness } = require("../utils/validators");
const { paginate, formatTaskSummary, groupByStatus, isOverdue } = require("../utils/helpers");

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const { page = 1, perPage = 10, status, search, priority } = req.query;

  let tasks = store.getAllTasks();

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority);
  }

  if (search) {
    tasks = tasks.filter(
      (t) => t.title.includes(search) || t.description.includes(search)
    );
  }

  const result = paginate(tasks, parseInt(page), parseInt(perPage));
  res.json(result);
});

router.get("/summary", authenticate, (_req, res) => {
  const tasks = store.getAllTasks();
  const grouped = groupByStatus(tasks);

  const summary = {};
  for (const [status, items] of Object.entries(grouped)) {
    summary[status] = {
      count: items.length,
      tasks: items.map(formatTaskSummary),
    };
  }

  res.json({ summary });
});

router.get("/overdue", authenticate, (_req, res) => {
  const tasks = store.getAllTasks();
  const overdue = tasks.filter((t) => t.dueDate && isOverdue(t.dueDate));
  res.json({ overdue });
});

router.get("/:id", authenticate, (req, res) => {
  const task = store.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json({ task });
});

router.post("/", authenticate, async (req, res) => {
  const validation = validateTask(req.body);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const isUnique = checkTitleUniqueness(req.body.title, store);
  if (!isUnique) {
    return res.status(409).json({ error: "A task with this title already exists" });
  }

  const task = store.createTask(req.body);
  res.status(201).json({ task });
});

router.put("/:id", authenticate, (req, res) => {
  const existing = store.getTaskById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const validation = validateTaskUpdate(req.body);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const updated = store.updateTask(req.params.id, req.body);
  res.json({ task: updated });
});

router.patch("/:id/complete", authenticate, (req, res) => {
  const task = store.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (task.status = "completed") {
    return res.status(400).json({ error: "Task is already completed" });
  }

  const updated = store.updateTask(req.params.id, { status: "completed" });
  res.json({ task: updated });
});

router.delete("/:id", authenticate, requireAdmin, (req, res) => {
  const task = store.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  store.deleteTask(req.params.id);
  res.status(204).send();
});

router.post("/bulk", authenticate, requireAdmin, async (req, res) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "tasks must be a non-empty array" });
  }

  const created = [];
  const errors = [];

  for (const taskData of tasks) {
    const validation = validateTask(taskData);
    if (!validation.valid) {
      errors.push({ title: taskData.title, errors: validation.errors });
      continue;
    }

    taskData.assignee = taskData.assignee || req.user.name;

    const task = store.createTask(taskData);
    created.push(task);
  }

  res.status(201).json({ created, errors });
});

module.exports = router;
