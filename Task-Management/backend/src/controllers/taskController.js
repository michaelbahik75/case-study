const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: check project membership
const checkProjectAccess = async (projectId, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };

  const isMember =
    project.owner.equals(userId) ||
    project.members.some((m) => m.equals(userId));

  if (!isMember && userRole !== 'admin') {
    return { error: 'Access denied', status: 403 };
  }
  return { project };
};

// @route  GET /api/tasks?project=&status=&assignee=&priority=
// @access Private
const getTasks = async (req, res, next) => {
  try {
    const { project, status, assignee, priority } = req.query;

    if (!project) {
      return res.status(400).json({ success: false, message: 'project query param is required' });
    }

    const access = await checkProjectAccess(project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    const filter = { project };
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/tasks
// @access Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignee, project, dueDate, tags } = req.body;

    const access = await checkProjectAccess(project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    // Set order to end of column
    const lastTask = await Task.findOne({ project, status: status || 'todo' }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      project,
      dueDate: dueDate || null,
      tags: tags || [],
      createdBy: req.user._id,
      order,
    });

    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Emit real-time event to project room
    const io = req.app.get('io');
    if (io) {
      io.to(`project:${project}`).emit('task:created', { task });
    }

    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const access = await checkProjectAccess(task.project._id, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    const { title, description, status, priority, assignee, dueDate, tags, order } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assignee, dueDate, tags, order },
      { new: true, runValidators: true }
    )
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(`project:${task.project}`).emit('task:updated', { task: updatedTask });
    }

    res.json({ success: true, task: updatedTask });
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/tasks/:id/status
// @access Private — dedicated endpoint for drag-and-drop status changes
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    task.status = status;
    if (order !== undefined) task.order = order;
    await task.save();

    await task.populate('assignee', 'name email avatar');

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(`project:${task.project}`).emit('task:status_changed', {
        taskId: task._id,
        status,
        order,
      });
    }

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    const projectId = task.project;
    await task.deleteOne();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(`project:${projectId}`).emit('task:deleted', { taskId: req.params.id });
    }

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
