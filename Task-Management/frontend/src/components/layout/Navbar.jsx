import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Avatar } from '../ui';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header style={{
      height: 52, background: '#fff', borderBottom: '0.5px solid #e0dfdb',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/projects" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' }} />
        <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', letterSpacing: '-0.3px' }}>TaskFlow</span>
      </Link>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
          color: connected ? '#0F6E56' : '#888', background: connected ? '#E1F5EE' : '#f1f0ec',
          padding: '3px 10px', borderRadius: 20, transition: 'all 0.3s',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%',
            background: connected ? '#1D9E75' : '#ccc',
            animation: connected ? 'pulse 1.5s infinite' : 'none',
          }} />
          {connected ? 'Live' : 'Offline'}
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={user?.name} size={28} />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>

        <button onClick={handleLogout} style={{
          background: 'none', border: '0.5px solid #ccc', borderRadius: 7,
          padding: '5px 12px', fontSize: 12, color: '#5F5E5A', cursor: 'pointer',
        }}>
          Sign out
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </header>
  );
};

export default Navbar;
