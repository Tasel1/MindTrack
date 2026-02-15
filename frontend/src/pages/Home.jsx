import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      <div className="hero-section">
        <div className="card">
          <h1>Welcome to MindTrack</h1>
          <p>Your personal emotion diary and mental wellness companion</p>
          
          {!isAuthenticated ? (
            <div className="auth-options">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-outline">Register</Link>
            </div>
          ) : (
            <div className="dashboard-access">
              <p>Hello, {user?.first_name || user?.email}!</p>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
          )}
        </div>
        
        <div className="features-grid">
          <div className="feature-card card">
            <h3>Track Your Emotions</h3>
            <p>Record your daily emotions with our simple interface. Choose from a variety of emotions and tag your feelings.</p>
          </div>
          
          <div className="feature-card card">
            <h3>Visualize Trends</h3>
            <p>See your emotional patterns over time with beautiful charts and calendar views.</p>
          </div>
          
          <div className="feature-card card">
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and only you have access to your personal entries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;