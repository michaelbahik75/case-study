const express = require('express');
const { body, query } = require('express-validator');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// GET /api/tasks?project=&status=&assignee=&priority=
router.get(
  '/',
  [query('project').notEmpty().withMessage('project query param is required')],
  validate,
  getTasks
);

// POST /api/tasks
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('project').notEmpty().withMessage('Project ID is required'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'in-review', 'done'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority'),
  ],
  validate,
  createTask
);

// GET /api/tasks/:id
router.get('/:id', getTaskById);

// PUT /api/tasks/:id — full update
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'in-review', 'done'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority'),
  ],
  validate,
  updateTask
);

// PATCH /api/tasks/:id/status — drag-and-drop status change
router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['todo', 'in-progress', 'in-review', 'done'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateTaskStatus
);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
