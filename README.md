# Task Manager API 🐛

A simple Express.js REST API for managing tasks. **This codebase contains 10 intentional bugs** — can you find them all?

## Setup

```bash
npm install
npm start
```

The API runs on `http://localhost:3000`.

## Authentication

All endpoints (except `/health`) require an `x-api-key` header.

Available API keys:
| Key | User | Role |
|-----|------|------|
| `key-alice-admin` | Alice | admin |
| `key-bob-member` | Bob | member |
| `key-charlie-member` | Charlie | member |

## Endpoints

### Health
- `GET /health` — Server status

### Tasks
- `GET /api/tasks?page=1&perPage=10&status=pending&search=keyword&priority=high` — List tasks (paginated)
- `GET /api/tasks/summary` — Tasks grouped by status
- `GET /api/tasks/overdue` — Overdue tasks
- `GET /api/tasks/:id` — Get task by ID
- `POST /api/tasks` — Create task
- `PUT /api/tasks/:id` — Update task
- `PATCH /api/tasks/:id/complete` — Mark task as completed
- `DELETE /api/tasks/:id` — Delete task (admin only)
- `POST /api/tasks/bulk` — Create multiple tasks (admin only)

### Users
- `GET /api/users` — List all users
- `GET /api/users/me` — Get current user
- `GET /api/users/:id` — Get user by ID

## Task Schema

```json
{
  "title": "string (required)",
  "description": "string",
  "priority": "low | medium | high | urgent",
  "tags": ["string"],
  "assignee": "string",
  "dueDate": "ISO 8601 string"
}
```

## The Challenge

There are **10 bugs** hidden across the codebase. They range from subtle logic errors to classic JavaScript gotchas. Good luck!

### Hints

- Bugs are spread across multiple files
- Some are syntax-level, some are logic-level
- Pay attention to how JavaScript handles types, scope, and async
- Test edge cases: pagination boundaries, concurrent operations, data mutations

## Project Structure

```
src/
├── index.js              # Express app setup
├── middleware/
│   └── auth.js           # API key authentication
├── models/
│   └── store.js          # In-memory data store
├── routes/
│   ├── tasks.js          # Task CRUD endpoints
│   └── users.js          # User endpoints
└── utils/
    ├── helpers.js         # Pagination, formatting, scheduling
    └── validators.js      # Input validation
```
