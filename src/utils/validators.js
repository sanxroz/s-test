const VALID_STATUSES = ["pending", "in_progress", "completed", "cancelled"];
const VALID_PRIORITIES = ["low", "medium", "high", "urgent"];

function validateTask(body) {
  const errors = [];

  if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
    errors.push("title is required and must be a non-empty string");
  }

  if (body.title && body.title.length > 200) {
    errors.push("title must be 200 characters or less");
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push("tags must be an array");
  }

  return errors;
}

function validateTaskUpdate(body) {
  const errors = [];

  if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim().length === 0)) {
    errors.push("title must be a non-empty string");
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
  }

  return errors;
}

module.exports = {
  validateTask,
  validateTaskUpdate,
};
