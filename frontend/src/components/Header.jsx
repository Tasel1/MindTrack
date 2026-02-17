import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="nav-link" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            MindTrack
          </Link>
          
          <div className="nav-links">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            ) : (
              <>
                {user?.role === 'student' && (
                  <>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/entries" className="nav-link">My Entries</Link>
                  </>
                )}
                
                {user?.role === 'psychologist' && (
                  <>
                    <Link to="/statistics" className="nav-link">Statistics</Link>
                  </>
                )}
                
                <Link to="/profile" className="nav-link">
                  {user?.first_name || 'Profile'}
                </Link>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;