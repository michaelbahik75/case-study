import { getInitials, getAvatarColor } from '../../utils/constants';

// ── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ name = '', size = 28, style = {} }) => {
  const { bg, color } = getAvatarColor(name);
  const initials = getInitials(name);
  return (
    <div title={name} style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, fontSize: size * 0.38,
      fontWeight: 600, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, ...style,
    }}>
      {initials}
    </div>
  );
};

// ── PriorityBadge ─────────────────────────────────────────────────────────────
export const PriorityBadge = ({ priority }) => {
  const map = { low: ['#EAF3DE','#3B6D11'], medium: ['#FAEEDA','#633806'], high: ['#FCEBEB','#791F1F'], urgent: ['#F7C1C1','#501313'] };
  const [bg, color] = map[priority] || map.medium;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: bg, color }}>
      {priority}
    </span>
  );
};

// ── StatusDot ─────────────────────────────────────────────────────────────────
export const StatusDot = ({ color, size = 8 }) => (
  <span style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
);

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = 'default', size = 'md', disabled, onClick, type = 'button', style = {} }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, border: '0.5px solid',
    borderRadius: 8, fontWeight: 500, transition: 'all 0.15s', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1, ...style,
  };
  const sizes = { sm: { padding: '4px 10px', fontSize: 12 }, md: { padding: '7px 14px', fontSize: 13 }, lg: { padding: '10px 20px', fontSize: 14 } };
  const variants = {
    default: { background: '#fff', borderColor: '#ccc', color: '#1a1a1a' },
    primary: { background: '#1D9E75', borderColor: '#1D9E75', color: '#fff' },
    danger:  { background: '#fff', borderColor: '#E24B4A', color: '#A32D2D' },
    ghost:   { background: 'transparent', borderColor: 'transparent', color: '#5F5E5A' },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
};

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = 440 }) => {
  if (!open) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div className="fade-in" style={{ background: '#fff', borderRadius: 12, width, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#888', lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
};

// ── FormField ─────────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '8px 10px', border: '0.5px solid #ccc', borderRadius: 8,
  fontSize: 13, background: '#fff', color: '#1a1a1a', outline: 'none',
};

export const FormField = ({ label, error, children }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: 'block', fontSize: 12, color: '#5F5E5A', marginBottom: 5, fontWeight: 500 }}>{label}</label>}
    {children}
    {error && <p style={{ color: '#A32D2D', fontSize: 11, marginTop: 4 }}>{error}</p>}
  </div>
);

export const Input = ({ ...props }) => <input style={inputStyle} {...props} />;
export const Textarea = ({ ...props }) => <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} {...props} />;
export const Select = ({ children, ...props }) => (
  <select style={{ ...inputStyle, cursor: 'pointer' }} {...props}>{children}</select>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ center = false }) => (
  <div style={center ? { display: 'flex', justifyContent: 'center', padding: '40px 0' } : {}}>
    <div className="spinner" />
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
export const Empty = ({ message = 'Nothing here yet' }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888' }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>○</div>
    <p style={{ fontSize: 13 }}>{message}</p>
  </div>
);

// ── Error message ─────────────────────────────────────────────────────────────
export const ErrorMsg = ({ message }) => (
  <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: 8, padding: '10px 14px', color: '#791F1F', fontSize: 13 }}>
    {message}
  </div>
);
