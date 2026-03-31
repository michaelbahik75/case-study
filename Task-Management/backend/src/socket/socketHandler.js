const { verifySocketToken } = require('../middleware/auth');
const User = require('../models/User');

const socketHandler = (io) => {
  // JWT auth middleware for every socket connection
  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: no token'));
    }

    const decoded = verifySocketToken(token);
    if (!decoded) {
      return next(new Error('Authentication error: invalid token'));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error: user not found'));
    }

    socket.user = user;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.id})`);

    // Join a project room to receive real-time task events
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`👥 ${socket.user.name} joined project room: ${projectId}`);
    });

    // Leave a project room
    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`👋 ${socket.user.name} left project room: ${projectId}`);
    });

    // Broadcast typing/cursor activity to teammates (optional UX feature)
    socket.on('task:typing', ({ projectId, taskId }) => {
      socket.to(`project:${projectId}`).emit('task:typing', {
        user: { id: socket.user._id, name: socket.user.name },
        taskId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.user.name} (${socket.id})`);
    });
  });
};

module.exports = socketHandler;
