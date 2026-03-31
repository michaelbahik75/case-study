import { useState, useEffect } from 'react';
import { Modal, FormField, Input, Textarea, Button } from '../ui';

const ProjectFormModal = ({ open, onClose, onSave, initialData }) => {
  const isEdit = !!initialData?._id;
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ name: initialData?.name || '', description: initialData?.description || '' });
    setErrors({});
  }, [open, initialData]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setErrors({ name: 'Project name is required' }); return; }
    setSaving(true);
    try {
      await onSave({ name: form.name.trim(), description: form.description.trim() });
      onClose();
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to save project' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit project' : 'New project'} width={420}>
      {errors.general && (
        <div style={{ background: '#FCEBEB', color: '#791F1F', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
          {errors.general}
        </div>
      )}
      <FormField label="Project name *" error={errors.name}>
        <Input value={form.name} onChange={set('name')} placeholder="e.g. AblanQ Platform" autoFocus />
      </FormField>
      <FormField label="Description">
        <Textarea value={form.description} onChange={set('description')} placeholder="What is this project about?" rows={3} />
      </FormField>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </Modal>
  );
};

export default ProjectFormModal;
