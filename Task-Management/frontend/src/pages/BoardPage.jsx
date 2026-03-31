import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import KanbanBoard from '../components/board/KanbanBoard';
import { Spinner, ErrorMsg } from '../components/ui';
import { projectAPI, userAPI } from '../api/services';

const BoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [projRes, usersRes] = await Promise.all([
          projectAPI.getById(projectId),
          userAPI.getAll().catch(() => ({ data: { users: [] } })),
        ]);
        const proj = projRes.data.project;
        setProject(proj);

        // Build members list: owner + project members + all users (for assignment)
        const projectUserIds = new Set([
          proj.owner?._id || proj.owner,
          ...(proj.members || []).map((m) => m._id || m),
        ]);

        // Use project members directly (already populated)
        const projMembers = [proj.owner, ...(proj.members || [])].filter(Boolean);
        const uniqueMap = new Map();
        projMembers.forEach((m) => { if (m._id) uniqueMap.set(m._id, m); });

        // Supplement with all users if admin fetched them
        const allUsers = usersRes.data.users || [];
        allUsers.forEach((u) => { if (!uniqueMap.has(u._id)) uniqueMap.set(u._id, u); });

        setMembers([...uniqueMap.values()]);
      } catch (err) {
        if (err.response?.status === 404) navigate('/projects');
        setError(err.response?.data?.message || 'Failed to load board');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f1', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{
        padding: '10px 20px', background: '#fff', borderBottom: '0.5px solid #e0dfdb',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
      }}>
        <Link to="/projects" style={{ color: '#888', textDecoration: 'none' }}>Projects</Link>
        <span style={{ color: '#ccc' }}>›</span>
        <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{project?.name || '...'}</span>
        {project?.description && (
          <>
            <span style={{ color: '#ccc', marginLeft: 4 }}>—</span>
            <span style={{ color: '#aaa', fontSize: 12 }}>{project.description}</span>
          </>
        )}
      </div>

      {/* Board */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {loading ? (
          <Spinner center />
        ) : error ? (
          <div style={{ padding: 24 }}><ErrorMsg message={error} /></div>
        ) : (
          <KanbanBoard project={project} members={members} />
        )}
      </div>
    </div>
  );
};

export default BoardPage;
