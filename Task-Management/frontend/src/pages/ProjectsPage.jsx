import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import { Button, Spinner, ErrorMsg } from '../components/ui';
import useProjects from '../hooks/useProjects';

const ProjectsPage = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const openCreate = () => { setEditingProject(null); setModalOpen(true); };
  const openEdit = (p) => { setEditingProject(p); setModalOpen(true); };

  const handleSave = async (data) => {
    if (editingProject) await updateProject(editingProject._id, data);
    else await createProject(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project and all its tasks?')) await deleteProject(id);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f1' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.3px' }}>Projects</h1>
            <p style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="primary" onClick={openCreate}>+ New project</Button>
        </div>

        {/* Content */}
        {loading ? (
          <Spinner center />
        ) : error ? (
          <ErrorMsg message={error} />
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px', background: '#fff',
            borderRadius: 12, border: '0.5px solid #e0dfdb',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◻</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No projects yet</h3>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Create your first project to get started</p>
            <Button variant="primary" onClick={openCreate}>+ Create project</Button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;
