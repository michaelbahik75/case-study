import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-600">Blogify</Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user.username}</span>
            <Button size="xs" variant="light" component={Link} to="/create">
              New Post
            </Button>
            <Button size="xs" variant="subtle" color="red" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button size="xs" variant="subtle" component={Link} to="/login">
              Login
            </Button>
            <Button size="xs" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}