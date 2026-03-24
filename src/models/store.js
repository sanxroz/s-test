const { v4: uuidv4 } = require("uuid");

const data = {
  tasks: [],
  users: [],
};

data.users.push(
  { id: uuidv4(), name: "Alice", email: "alice@example.com", role: "admin", apiKey: "key-alice-admin" },
  { id: uuidv4(), name: "Bob", email: "bob@example.com", role: "member", apiKey: "key-bob-member" },
  { id: uuidv4(), name: "Charlie", email: "charlie@example.com", role: "member", apiKey: "key-charlie-member" }
);

const store = {
  getAllTasks() {
    return data.tasks;
  },

  getTaskById(id) {
    return data.tasks.find((t) => t.id === id);
  },

  createTask(task) {
    const newTask = {
      id: uuidv4(),
      title: task.title,
      description: task.description || "",
      status: "pending",
      priority: task.priority || "medium",
      tags: task.tags || [],
      assignee: task.assignee || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    return newTask;
  },

  updateTask(id, updates) {
    const index = data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    data.tasks[index] = {
      ...data.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return data.tasks[index];
  },

  deleteTask(id) {
    const index = data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    data.tasks.splice(index, 1);
    return true;
  },

  getAllUsers() {
    return data.users.map(({ apiKey, ...user }) => user);
  },

  getUserByApiKey(key) {
    return data.users.find((u) => u.apiKey === key);
  },

  getUserById(id) {
    const user = data.users.find((u) => u.id === id);
    if (!user) return null;
    const { apiKey, ...safe } = user;
    return safe;
  },
};

module.exports = store;
