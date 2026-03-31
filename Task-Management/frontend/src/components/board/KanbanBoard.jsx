import { useState, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import TaskFormModal from '../tasks/TaskFormModal';
import { Spinner, ErrorMsg } from '../ui';
import { STATUSES } from '../../utils/constants';
import { useSocket } from '../../context/SocketContext';
import useTasks from '../../hooks/useTasks';

const KanbanBoard = ({ project, members }) => {
  const { connected } = useSocket();
  const { tasks, loading, error, createTask, updateTask, moveTask, deleteTask } = useTasks(project._id);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  // Filters
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Apply filters client-side (tasks already loaded for this project)
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterAssignee && t.assignee?._id !== filterAssignee) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterAssignee, filterPriority]);

  const tasksByStatus = useMemo(() => {
    const map = {};
    STATUSES.forEach((s) => { map[s.id] = []; });
    filteredTasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
      else map['todo'].push(t);
    });
    // sort by order within each column
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.order - b.order));
    return map;
  }, [filteredTasks]);

  // Drag end handler
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    await moveTask(draggableId, destination.droppableId, destination.index);
  };

  const openCreate = (status = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) await deleteTask(id);
  };

  if (loading) return <Spinner center />;
  if (error) return <div style={{ padding: 20 }}><ErrorMsg message={error} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Board toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: '#fff', borderBottom: '0.5px solid #e0dfdb',
        flexWrap: 'wrap', gap: 10,
      }}>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>Filter:</span>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            style={selectStyle}
          >
            <option value="">All assignees</option>
            {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={selectStyle}
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {(filterAssignee || filterPriority) && (
            <button
              onClick={() => { setFilterAssignee(''); setFilterPriority(''); }}
              style={{ fontSize: 11, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear
            </button>
          )}
          <span style={{ fontSize: 12, color: '#aaa' }}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Members */}
          <div style={{ display: 'flex' }}>
            {members.slice(0, 5).map((m, i) => (
              <div key={m._id} title={m.name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: members.length - i }}>
                <MiniAvatar name={m.name} />
              </div>
            ))}
            {members.length > 5 && (
              <div style={{ ...miniAvatarStyle, background: '#f1f0ec', color: '#888', marginLeft: -6 }}>
                +{members.length - 5}
              </div>
            )}
          </div>

          {/* Socket status */}
          <div style={{
            fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
            color: connected ? '#0F6E56' : '#aaa',
            background: connected ? '#E1F5EE' : '#f1f0ec',
            padding: '3px 9px', borderRadius: 20,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: connected ? '#1D9E75' : '#ccc',
              animation: connected ? 'pulse 1.5s infinite' : 'none',
            }} />
            {connected ? 'Live sync' : 'Offline'}
          </div>

          <button
            onClick={() => openCreate()}
            style={{
              background: '#1D9E75', color: '#fff', border: 'none',
              borderRadius: 8, padding: '7px 14px', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            + New task
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'flex', gap: 14, padding: '16px 20px', overflowX: 'auto', flex: 1, alignItems: 'flex-start' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              tasks={tasksByStatus[status.id] || []}
              onAddTask={openCreate}
              onEditTask={openEdit}
              onDeleteTask={handleDelete}
            />
          ))}
        </DragDropContext>
      </div>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
        projectMembers={members}
        defaultStatus={defaultStatus}
      />

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
};

const miniAvatarStyle = {
  width: 26, height: 26, borderRadius: '50%', fontSize: 10, fontWeight: 600,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1.5px solid #fff',
};

const AVATAR_COLORS = [
  ['#EEEDFE','#3C3489'], ['#E1F5EE','#085041'], ['#FAECE7','#712B13'],
  ['#FBEAF0','#72243E'], ['#E6F1FB','#0C447C'], ['#FAEEDA','#633806'],
];

const MiniAvatar = ({ name = '' }) => {
  let sum = 0;
  for (const c of name) sum += c.charCodeAt(0);
  const [bg, color] = AVATAR_COLORS[sum % AVATAR_COLORS.length];
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return <div title={name} style={{ ...miniAvatarStyle, background: bg, color }}>{initials}</div>;
};

const selectStyle = {
  fontSize: 12, padding: '5px 8px', border: '0.5px solid #e0dfdb',
  borderRadius: 7, background: '#fff', color: '#1a1a1a', cursor: 'pointer',
};

export default KanbanBoard;
