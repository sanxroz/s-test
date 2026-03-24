function filterTasks(tasks, query) {
  let filtered = [...tasks];

  if (query.status) {
    filtered = filtered.filter((t) => t.status === query.status);
  }

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(term) && (t.description || "").toLowerCase().includes(term)
    );
  }

  if (query.priority) {
    filtered = filtered.filter((t) => t.priority === query.priority);
  }

  if (query.tag) {
    filtered = filtered.filter((t) => t.tags.includes(query.tag));
  }

  return filtered;
}

function sortTasks(tasks, sortBy = "createdAt", order = "desc") {
  const validSortFields = ["createdAt", "updatedAt", "priority", "title"];

  if (!validSortFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  return [...tasks].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === bv) return 0;
    if (order === "desc") {
      return av > bv ? 1 : -1;
    }
    return av < bv ? 1 : -1;
  });
}

function paginate(items, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return {
    data: paginatedItems,
    pagination: {
      page,
      perPage: pageSize,
      total: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}

module.exports = { filterTasks, sortTasks, paginate };
