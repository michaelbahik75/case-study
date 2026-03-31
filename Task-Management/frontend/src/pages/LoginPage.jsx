import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormField, Input, Button, ErrorMsg } from '../components/ui';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D9E75' }} />
            <span style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a', letterSpacing: '-0.5px' }}>TaskFlow</span>
          </div>
          <p style={{ fontSize: 13, color: '#888' }}>Sign in to your account</p>
        </div>

        {error && <div style={{ marginBottom: 16 }}><ErrorMsg message={error} /></div>}

        <form onSubmit={handleSubmit}>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required autoFocus />
          </FormField>
          <FormField label="Password">
            <Input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
          </FormField>
          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: 500 }}>Register</Link>
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
  padding: '32px 28px', width: '100%', maxWidth: 380,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
};

export default LoginPage;
