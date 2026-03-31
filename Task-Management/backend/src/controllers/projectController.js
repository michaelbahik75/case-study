const Project = require('../models/Project');
const Task = require('../models/Task');

// @route  GET /api/projects
// @access Private
const getProjects = async (req, res, next) => {
  try {
    // Return projects where user is owner or member
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/projects
// @access Private
const createProject = async (req, res, next) => {
  try {
    const { name, description, color, members } = req.body;

    const project = await Project.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: members || [],
    });

    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/projects/:id
// @access Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isMember =
      project.owner._id.equals(req.user._id) ||
      project.members.some((m) => m._id.equals(req.user._id));

    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/projects/:id
// @access Private (owner or admin)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the project owner can update it' });
    }

    const { name, description, color, members } = req.body;
    Object.assign(project, { name, description, color, members });
    await project.save();

    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/projects/:id
// @access Private (owner or admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the project owner can delete it' });
    }

    // Delete all tasks in this project
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project and all its tasks deleted' });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/projects/:id/members
// @access Private (owner or admin)
const addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the project owner can add members' });
    }

    const { userId } = req.body;
    if (project.members.includes(userId)) {
      return res.status(409).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email avatar');

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/projects/:id/members/:userId
// @access Private (owner or admin)
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the project owner can remove members' });
    }

    project.members = project.members.filter((m) => m.toString() !== req.params.userId);
    await project.save();
    await project.populate('members', 'name email avatar');

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
