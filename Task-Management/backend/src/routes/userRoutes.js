const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/users — admin only
router.get('/', adminOnly, getAllUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

// PUT /api/users/:id — self or admin
router.put('/:id', updateUser);

// DELETE /api/users/:id — admin only
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;
