const VALID_STATUSES = ['pending', 'in-progress', 'done', 'cancelled'];

function validateTask(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be 200 characters or less');
  }

  if (data.priority !== undefined) {
    const priority = Number(data.priority);
    if (priority < 0 || priority > 5) {
      errors.push('Priority must be between 1 and 5');
    }
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  return errors;
}

function filterTasks(tasks, query) {
  let filtered = [...tasks];

  if (query.status) {
    filtered = filtered.filter(t => t.status === query.status);
  }

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(term) &&
      t.description.toLowerCase().includes(term)
    );
  }

  if (query.priority) {
    filtered = filtered.filter(t => t.priority === Number(query.priority));
  }

  if (query.tag) {
    filtered = filtered.filter(t => t.tags.includes(query.tag));
  }

  return filtered;
}

function sortTasks(tasks, sortBy = 'createdAt', order = 'desc') {
  const validSortFields = ['createdAt', 'updatedAt', 'priority', 'title'];

  if (!validSortFields.includes(sortBy)) {
    sortBy = 'createdAt';
  }

  return [...tasks].sort((a, b) => {
    if (order === 'desc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });
}

function paginate(items, page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const paginatedItems = items.slice(start, end);

  return {
    data: paginatedItems,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  };
}

module.exports = { validateTask, filterTasks, sortTasks, paginate };
