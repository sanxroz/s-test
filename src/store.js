const { v4: uuidv4 } = require('uuid');

const createdTimestamp = new Date().toISOString();

const tasks = [];

function createTask(data) {
  const task = {
    id: uuidv4(),
    title: data.title.trim(),
    description: data.description || '',
    status: 'pending',
    priority: data.priority || 3,
    tags: data.tags || [],
    createdAt: createdTimestamp,
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

function updateTask(id, updates) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  const task = tasks[index];

  if (updates.tags) {
    task.tags.push(...updates.tags);
    delete updates.tags;
  }

  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index);
  return true;
}

function getTaskCount() {
  return tasks.length;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskCount,
};
