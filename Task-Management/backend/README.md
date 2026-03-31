# TaskFlow Backend

Express + MongoDB + Socket.io REST API for the TaskFlow Kanban system.

## Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Real-time**: Socket.io
- **Validation**: express-validator

---

## Quick Start

### 1. Install dependencies
```bash
cd taskflow-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
```

### 3. Start MongoDB
```bash
# If running locally:
mongod
# or with Homebrew:
brew services start mongodb-community
```

### 4. Seed test data (optional but recommended)
```bash
npm run seed
```

### 5. Start the server
```bash
npm run dev       # development (nodemon)
npm start         # production
```

Server runs at: `http://localhost:5000`
Health check:   `http://localhost:5000/api/health`

---

## API Reference

### Auth
| Method | Route              | Access  | Description         |
|--------|--------------------|---------|---------------------|
| POST   | /api/auth/register | Public  | Register a new user |
| POST   | /api/auth/login    | Public  | Login, get JWT      |
| GET    | /api/auth/me       | Private | Get current user    |

#### POST /api/auth/register
```json
{ "name": "Alice Kim", "email": "alice@example.com", "password": "secret123" }
```

#### POST /api/auth/login
```json
{ "email": "alice@example.com", "password": "secret123" }
```
**Response**: `{ success, token, user }`

---

### Users
| Method | Route           | Access       | Description       |
|--------|-----------------|--------------|-------------------|
| GET    | /api/users      | Admin only   | List all users    |
| GET    | /api/users/:id  | Private      | Get user by ID    |
| PUT    | /api/users/:id  | Self / Admin | Update name/avatar|
| DELETE | /api/users/:id  | Admin only   | Delete user       |

---

### Projects
| Method | Route                          | Access        | Description          |
|--------|--------------------------------|---------------|----------------------|
| GET    | /api/projects                  | Private       | List my projects     |
| POST   | /api/projects                  | Private       | Create project       |
| GET    | /api/projects/:id              | Member/Admin  | Get project details  |
| PUT    | /api/projects/:id              | Owner/Admin   | Update project       |
| DELETE | /api/projects/:id              | Owner/Admin   | Delete + tasks       |
| POST   | /api/projects/:id/members      | Owner/Admin   | Add member           |
| DELETE | /api/projects/:id/members/:uid | Owner/Admin   | Remove member        |

#### POST /api/projects
```json
{ "name": "My Project", "description": "...", "color": "#6366f1", "members": [] }
```

---

### Tasks
| Method | Route                    | Access  | Description                    |
|--------|--------------------------|---------|--------------------------------|
| GET    | /api/tasks?project=ID    | Member  | List tasks (filterable)        |
| POST   | /api/tasks               | Member  | Create task                    |
| GET    | /api/tasks/:id           | Member  | Get task                       |
| PUT    | /api/tasks/:id           | Member  | Full update                    |
| PATCH  | /api/tasks/:id/status    | Member  | Drag-and-drop status change    |
| DELETE | /api/tasks/:id           | Member  | Delete task                    |

#### GET /api/tasks — query params
```
?project=<projectId>           required
&status=todo|in-progress|in-review|done
&assignee=<userId>
&priority=low|medium|high|urgent
```

#### POST /api/tasks
```json
{
  "title": "Build login page",
  "description": "...",
  "status": "todo",
  "priority": "high",
  "assignee": "<userId>",
  "project": "<projectId>",
  "dueDate": "2025-08-01",
  "tags": ["frontend", "auth"]
}
```

#### PATCH /api/tasks/:id/status — drag-and-drop
```json
{ "status": "in-progress", "order": 2 }
```

---

## Authentication

All private routes require a Bearer token header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Socket.io Events

Connect with:
```js
const socket = io('http://localhost:5000', {
  auth: { token: '<jwt_token>' }
});
```

### Client → Server
| Event          | Payload          | Description               |
|----------------|------------------|---------------------------|
| join:project   | projectId        | Subscribe to project room |
| leave:project  | projectId        | Unsubscribe               |
| task:typing    | { projectId, taskId } | Broadcast typing state |

### Server → Client
| Event               | Payload           | Description               |
|---------------------|-------------------|---------------------------|
| task:created        | { task }          | New task created          |
| task:updated        | { task }          | Task fields updated       |
| task:status_changed | { taskId, status, order } | Drag-and-drop   |
| task:deleted        | { taskId }        | Task deleted              |
| task:typing         | { user, taskId }  | Teammate is typing        |

---

## Seed Accounts (after npm run seed)

| Email                  | Password    | Role   |
|------------------------|-------------|--------|
| admin@taskflow.com     | password123 | admin  |
| alice@taskflow.com     | password123 | member |
| bob@taskflow.com       | password123 | member |
| carol@taskflow.com     | password123 | member |

---

## Project Structure

```
taskflow-backend/
├── .env
├── .env.example
├── package.json
├── seed.js
└── src/
    ├── server.js              ← Entry point
    ├── config/
    │   └── db.js              ← MongoDB connection
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js            ← Compound indexes on {project,status}
    ├── middleware/
    │   ├── auth.js            ← protect, adminOnly, verifySocketToken
    │   ├── errorHandler.js
    │   └── validate.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── projectController.js
    │   └── taskController.js  ← Emits Socket.io events
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── projectRoutes.js
    │   └── taskRoutes.js
    └── socket/
        └── socketHandler.js   ← JWT auth per socket, project rooms
```
