require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seed = async () => {
  await connectDB();

  // Wipe existing data
  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────
  const [admin, alice, bob, carol] = await User.create([
    { name: 'Admin User',  email: 'admin@taskflow.com',  password: 'password123', role: 'admin'  },
    { name: 'Alice Kim',   email: 'alice@taskflow.com',  password: 'password123', role: 'member' },
    { name: 'Bob Singh',   email: 'bob@taskflow.com',    password: 'password123', role: 'member' },
    { name: 'Carol Nair',  email: 'carol@taskflow.com',  password: 'password123', role: 'member' },
  ]);
  console.log('👤 Created 4 users');

  // ── Project ────────────────────────────────────────────────────────────
  const project = await Project.create({
    name: 'TaskFlow MVP',
    description: 'Build the TaskFlow kanban product from scratch',
    owner: admin._id,
    members: [alice._id, bob._id, carol._id],
    color: '#6366f1',
  });
  console.log(`📁 Created project: ${project.name}`);

  // ── Tasks ──────────────────────────────────────────────────────────────
  await Task.create([
    // TODO
    {
      title: 'Design database schema',
      description: 'Define collections and indexes for Users, Projects, Tasks',
      status: 'todo', priority: 'high',
      assignee: alice._id, project: project._id, createdBy: admin._id,
      tags: ['backend', 'db'], order: 0,
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'GitHub Actions workflow for lint, test, deploy',
      status: 'todo', priority: 'medium',
      assignee: bob._id, project: project._id, createdBy: admin._id,
      tags: ['devops'], order: 1,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Write API documentation',
      description: 'Swagger/OpenAPI docs for all endpoints',
      status: 'todo', priority: 'low',
      assignee: carol._id, project: project._id, createdBy: admin._id,
      tags: ['docs'], order: 2,
    },

    // IN PROGRESS
    {
      title: 'Build auth endpoints',
      description: 'Register, login, JWT middleware, /me route',
      status: 'in-progress', priority: 'urgent',
      assignee: alice._id, project: project._id, createdBy: admin._id,
      tags: ['backend', 'auth'], order: 0,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Implement task CRUD',
      description: 'GET, POST, PUT, PATCH /status, DELETE for tasks',
      status: 'in-progress', priority: 'high',
      assignee: bob._id, project: project._id, createdBy: admin._id,
      tags: ['backend'], order: 1,
    },

    // IN REVIEW
    {
      title: 'Kanban drag-and-drop UI',
      description: 'React frontend with @hello-pangea/dnd and Socket.io client',
      status: 'in-review', priority: 'high',
      assignee: carol._id, project: project._id, createdBy: admin._id,
      tags: ['frontend'], order: 0,
    },
    {
      title: 'Socket.io gateway',
      description: 'JWT-authenticated rooms, task:created / updated / deleted events',
      status: 'in-review', priority: 'medium',
      assignee: alice._id, project: project._id, createdBy: admin._id,
      tags: ['backend', 'realtime'], order: 1,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // overdue
    },

    // DONE
    {
      title: 'Project setup & folder structure',
      description: 'Express app, dotenv, Mongoose, nodemon configured',
      status: 'done', priority: 'medium',
      assignee: admin._id, project: project._id, createdBy: admin._id,
      tags: ['setup'], order: 0,
    },
    {
      title: 'User model with bcrypt hashing',
      description: 'Mongoose schema, pre-save hook, comparePassword method',
      status: 'done', priority: 'high',
      assignee: bob._id, project: project._id, createdBy: admin._id,
      tags: ['backend'], order: 1,
    },
  ]);
  console.log('✅ Created 9 tasks across all columns');

  console.log('\n🎉 Seed complete! Login credentials:');
  console.log('   admin@taskflow.com  / password123  (admin)');
  console.log('   alice@taskflow.com  / password123  (member)');
  console.log('   bob@taskflow.com    / password123  (member)');
  console.log('   carol@taskflow.com  / password123  (member)');
  console.log(`\n   Project ID: ${project._id}\n`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
