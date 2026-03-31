import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api/services';
import { useSocket } from '../context/SocketContext';

const useTasks = (projectId, filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { joinProject, leaveProject, on } = useSocket();

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await taskAPI.getAll(projectId, filters);
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]); // eslint-disable-line

  // Join socket room and listen for real-time events
  useEffect(() => {
    if (!projectId) return;
    joinProject(projectId);

    const offCreated = on('task:created', ({ task }) => {
      setTasks((prev) => {
        if (prev.find((t) => t._id === task._id)) return prev;
        return [task, ...prev];
      });
    });

    const offUpdated = on('task:updated', ({ task }) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });

    const offMoved = on('task:status_changed', ({ taskId, status, order }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status, order: order ?? t.order } : t))
      );
    });

    const offDeleted = on('task:deleted', ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      leaveProject(projectId);
      offCreated && offCreated();
      offUpdated && offUpdated();
      offMoved && offMoved();
      offDeleted && offDeleted();
    };
  }, [projectId]); // eslint-disable-line

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await taskAPI.create({ ...data, project: projectId });
    // Optimistic: socket will also push it, dedup handled in listener
    setTasks((prev) => {
      if (prev.find((t) => t._id === res.data.task._id)) return prev;
      return [res.data.task, ...prev];
    });
    return res.data.task;
  };

  const updateTask = async (id, data) => {
    const res = await taskAPI.update(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
    return res.data.task;
  };

  const moveTask = async (id, status, order) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status, order } : t)));
    try {
      await taskAPI.updateStatus(id, status, order);
    } catch {
      // Revert on failure
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    await taskAPI.delete(id);
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, moveTask, deleteTask };
};

export default useTasks;
