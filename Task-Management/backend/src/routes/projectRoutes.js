const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// GET /api/projects
router.get('/', getProjects);

// POST /api/projects
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Project name is required')],
  validate,
  createProject
);

// GET /api/projects/:id
router.get('/:id', getProjectById);

// PUT /api/projects/:id
router.put('/:id', updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

// POST /api/projects/:id/members
router.post('/:id/members', addMember);

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
