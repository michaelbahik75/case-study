import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { StatusDot } from '../ui';

const KanbanColumn = ({ status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  return (
    <div style={{ width: 272, minWidth: 252, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Column header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <StatusDot color={status.color} size={9} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{status.label}</span>
          <span style={{
            fontSize: 11, background: '#f1f0ec', color: '#888', borderRadius: 20,
            padding: '1px 8px', fontWeight: 500,
          }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status.id)}
          title="Add task"
          style={{
            width: 24, height: 24, borderRadius: 6, border: '0.5px solid #e0dfdb',
            background: 'transparent', color: '#888', fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: snapshot.isDraggingOver ? '#e8f6f1' : '#ededea',
              border: `1.5px dashed ${snapshot.isDraggingOver ? '#1D9E75' : 'transparent'}`,
              borderRadius: 12,
              padding: '8px',
              minHeight: 120,
              flex: 1,
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div style={{ textAlign: 'center', padding: '24px 8px', color: '#bbb', fontSize: 12 }}>
                No tasks
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
