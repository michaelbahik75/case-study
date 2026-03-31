import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Avatar, PriorityBadge } from '../ui';
import { formatDate, isOverdue } from '../../utils/constants';

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const overdue = isOverdue(task.dueDate);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fade-in"
          style={{
            background: '#fff',
            border: `0.5px solid ${snapshot.isDragging ? '#1D9E75' : '#e0dfdb'}`,
            borderRadius: 10,
            padding: '12px',
            marginBottom: 8,
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            opacity: snapshot.isDragging ? 0.85 : 1,
            boxShadow: snapshot.isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : 'none',
            transform: snapshot.isDragging ? 'rotate(1.5deg)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            position: 'relative',
            ...provided.draggableProps.style,
          }}
        >
          {/* Action buttons on hover */}
          {hovered && !snapshot.isDragging && (
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
              <button onClick={() => onEdit(task)} style={btnStyle('#f5f4f1', '#5F5E5A')} title="Edit">✎</button>
              <button onClick={() => onDelete(task._id)} style={btnStyle('#FCEBEB', '#A32D2D')} title="Delete">✕</button>
            </div>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {task.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 20, background: '#f1f0ec', color: '#5F5E5A', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 6, paddingRight: hovered ? 48 : 0 }}>
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 10,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {task.assignee
                ? <Avatar name={task.assignee.name} size={22} />
                : <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1px dashed #ccc', flexShrink: 0 }} />
              }
              {task.assignee && <span style={{ fontSize: 11, color: '#888' }}>{task.assignee.name?.split(' ')[0]}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {task.dueDate && (
                <span style={{ fontSize: 11, color: overdue ? '#A32D2D' : '#888', fontWeight: overdue ? 500 : 400 }}>
                  {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
                </span>
              )}
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const btnStyle = (bg, color) => ({
  width: 22, height: 22, borderRadius: 5, border: '0.5px solid #e0dfdb',
  background: bg, color, cursor: 'pointer', fontSize: 12, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
});

export default TaskCard;
