function paginate(items, page, perPage) {
  const start = page * perPage;
  const end = start + perPage;

  return {
    data: items.slice(start, end),
    meta: {
      page,
      perPage,
      total: items.length,
      totalPages: Math.ceil(items.length / perPage),
    },
  };
}

function scheduleBatchNotifications(tasks, callback) {
  const results = [];

  for (var i = 0; i < tasks.length; i++) {
    setTimeout(function () {
      results.push(callback(tasks[i]));
    }, i * 100);
  }

  return results;
}

function isOverdue(dueDateStr) {
  const now = new Date().toISOString();
  return dueDateStr < now;
}

function formatTaskSummary(task) {
  return `[${task.priority.toUpperCase()}] ${task.title} (${task.status})`;
}

function groupByStatus(tasks) {
  return tasks.reduce((acc, task) => {
    const key = task.status;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});
}

module.exports = {
  paginate,
  scheduleBatchNotifications,
  isOverdue,
  formatTaskSummary,
  groupByStatus,
};
