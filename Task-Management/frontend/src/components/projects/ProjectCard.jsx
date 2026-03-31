import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';

const PROJECT_COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7', '#639922'];

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = project.owner?._id === user?._id || project.owner === user?._id;

  let sum = 0;
  for (const c of (project.name || '')) sum += c.charCodeAt(0);
  const accentColor = PROJECT_COLORS[sum % PROJECT_COLORS.length];

  const allMembers = [project.owner, ...(project.members || [])].filter(Boolean);
  const uniqueMembers = allMembers.filter((m, i, arr) => arr.findIndex((x) => (x._id || x) === (m._id || m)) === i);

  return (
    <div style={{
      background: '#fff', border: '0.5px solid #e0dfdb', borderRadius: 12,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.15s', cursor: 'pointer',
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Color bar */}
      <div style={{ height: 4, background: accentColor }} />

      <div style={{ padding: '16px' }}>
        {/* Name + owner badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>{project.name}</h3>
          {isOwner && (
            <span style={{ fontSize: 10, background: '#E1F5EE', color: '#085041', padding: '2px 7px', borderRadius: 20, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
              Owner
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 14, minHeight: 36,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description || 'No description'}
        </p>

        {/* Members */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex' }}>
              {uniqueMembers.slice(0, 4).map((m, i) => (
                <div key={m._id || i} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: 10 - i }}>
                  <Avatar name={m.name} size={22} />
                </div>
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#888' }}>
              {uniqueMembers.length} member{uniqueMembers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#aaa' }}>
            {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => navigate(`/board/${project._id}`)}
            style={{ flex: 1, background: accentColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
          >
            Open board →
          </button>
          {isOwner && (
            <>
              <Button size="sm" onClick={() => onEdit(project)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(project._id)}>Delete</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
