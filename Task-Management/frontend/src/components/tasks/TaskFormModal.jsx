import { useState, useEffect } from 'react';
import { Modal, FormField, Input, Textarea, Select, Button } from '../ui';
import { STATUSES, PRIORITIES } from '../../utils/constants';

const TaskFormModal = ({ open, onClose, onSave, initialData, projectMembers = [], defaultStatus = 'todo' }) => {
  const isEdit = !!initialData?._id;

  const blank = { title: '', description: '', status: defaultStatus, priority: 'medium', assignee: '', dueDate: '', tags: '' };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || defaultStatus,
        priority: initialData.priority || 'medium',
        assignee: initialData.assignee?._id || initialData.assignee || '',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        tags: (initialData.tags || []).join(', '),
      });
    } else {
      setForm({ ...blank, status: defaultStatus });
    }
    setErrors({});
  }, [open, initialData, defaultStatus]); // eslint-disable-line

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        assignee: form.assignee || undefined,
        dueDate: form.dueDate || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      });
      onClose();
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to save task' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit task' : 'New task'} width={460}>
      {errors.general && <div style={{ background: '#FCEBEB', color: '#791F1F', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{errors.general}</div>}

      <FormField label="Title *" error={errors.title}>
        <Input value={form.title} onChange={set('title')} placeholder="What needs to be done?" autoFocus />
      </FormField>

      <FormField label="Description">
        <Textarea value={form.description} onChange={set('description')} placeholder="Add more details..." rows={3} />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Status">
          <Select value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </Select>
        </FormField>

        <FormField label="Priority">
          <Select value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </Select>
        </FormField>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Assignee">
          <Select value={form.assignee} onChange={set('assignee')}>
            <option value="">Unassigned</option>
            {projectMembers.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Due date">
          <Input type="date" value={form.dueDate} onChange={set('dueDate')} />
        </FormField>
      </div>

      <FormField label="Tags (comma separated)">
        <Input value={form.tags} onChange={set('tags')} placeholder="frontend, auth, bug..." />
      </FormField>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </Modal>
  );
};

export default TaskFormModal;
