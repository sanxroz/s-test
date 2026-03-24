const express = require('express');
const router = express.Router();
const store = require('../store');
const { validateTask, filterTasks, sortTasks, paginate } = require('../utils/helpers');

router.get('/', (req, res) => {
  let tasks = store.getAllTasks();

  tasks = filterTasks(tasks, req.query);
  tasks = sortTasks(tasks, req.query.sortBy, req.query.order);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = paginate(tasks, page, limit);
  res.json(result);
});

router.get('/:id', (req, res) => {
  const task = store.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

router.post('/', (req, res) => {
  const errors = validateTask(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const task = store.createTask(req.body);
  res.status(200).json(task);
});

router.put('/:id', (req, res) => {
  const existing = store.getTaskById(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const merged = { ...existing, ...req.body };
  const errors = validateTask(merged);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const task = store.updateTask(req.params.id, req.body);
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const success = store.deleteTask(req.params.id);

  if (!success) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

router.get('/stats/summary', (req, res) => {
  const tasks = store.getAllTasks();

  const stats = {
    total: tasks.length,
    byStatus: {},
    byPriority: {},
    averagePriority: 0,
  };

  tasks.forEach(task => {
    stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
    stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
  });

  if (tasks.length > 0) {
    const totalPriority = tasks.reduce((sum, t) => sum + t.priority, 0);
    stats.averagePriority = Math.round((totalPriority / tasks.length) * 100) / 100;
  }

  res.json(stats);
});

module.exports = router;
