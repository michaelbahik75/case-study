import { useState, useEffect, useCallback } from 'react';
import { projectAPI } from '../api/services';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectAPI.getAll();
      setProjects(res.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (data) => {
    const res = await projectAPI.create(data);
    setProjects((prev) => [res.data.project, ...prev]);
    return res.data.project;
  };

  const updateProject = async (id, data) => {
    const res = await projectAPI.update(id, data);
    setProjects((prev) => prev.map((p) => (p._id === id ? res.data.project : p)));
    return res.data.project;
  };

  const deleteProject = async (id) => {
    await projectAPI.delete(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject };
};

export default useProjects;
