export const STATUSES = [
  { id: 'todo',        label: 'To Do',       color: '#888780' },
  { id: 'in-progress', label: 'In Progress', color: '#1D9E75' },
  { id: 'in-review',   label: 'In Review',   color: '#BA7517' },
  { id: 'done',        label: 'Done',        color: '#185FA5' },
];

export const PRIORITIES = [
  { id: 'low',    label: 'Low',    bg: '#EAF3DE', color: '#3B6D11' },
  { id: 'medium', label: 'Medium', bg: '#FAEEDA', color: '#633806' },
  { id: 'high',   label: 'High',   bg: '#FCEBEB', color: '#791F1F' },
  { id: 'urgent', label: 'Urgent', bg: '#F7C1C1', color: '#501313' },
];

export const getStatusMeta = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];
export const getPriorityMeta = (id) => PRIORITIES.find((p) => p.id === id) || PRIORITIES[1];

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const AVATAR_COLORS = [
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#FBEAF0', color: '#72243E' },
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#FAEEDA', color: '#633806' },
];

export const getAvatarColor = (name = '') => {
  let sum = 0;
  for (const c of name) sum += c.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

export const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isOverdue = (d) => {
  if (!d) return false;
  return new Date(d) < new Date(new Date().toDateString());
};
