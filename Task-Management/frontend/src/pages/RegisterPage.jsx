import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormField, Input, Select, Button, ErrorMsg } from '../components/ui';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D9E75' }} />
            <span style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a', letterSpacing: '-0.5px' }}>TaskFlow</span>
          </div>
          <p style={{ fontSize: 13, color: '#888' }}>Create your account</p>
        </div>

        {error && <div style={{ marginBottom: 16 }}><ErrorMsg message={error} /></div>}

        <form onSubmit={handleSubmit}>
          <FormField label="Full name">
            <Input value={form.name} onChange={set('name')} placeholder="Alex Kim" required autoFocus />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          </FormField>
          <FormField label="Password">
            <Input type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required />
          </FormField>
          <FormField label="Role">
            <Select value={form.role} onChange={set('role')}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </Select>
          </FormField>
          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f5f4f1', padding: 16,
};
const cardStyle = {
  background: '#fff', borderRadius: 14, border: '0.5px solid #e0dfdb',
  padding: '32px 28px', width: '100%', maxWidth: 400,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
};

export default RegisterPage;
