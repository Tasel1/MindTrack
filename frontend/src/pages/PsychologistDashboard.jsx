import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PsychologistDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Psychologist Dashboard</h1>
        <p>Welcome back, {user?.first_name || user?.email}!</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <Link to="/statistics" className="btn btn-primary">View Statistics</Link>
        </div>

        <div className="dashboard-widgets">
          <div className="card">
            <h2>Quick Access</h2>
            <p>Access anonymized statistics about student emotional wellbeing.</p>
            <ul>
              <li>Active students count</li>
              <li>Average mood intensity</li>
              <li>Emotion distribution</li>
              <li>Popular tags</li>
            </ul>
            <Link to="/statistics" className="btn btn-primary">Go to Statistics</Link>
          </div>

          <div className="card">
            <h2>Export Reports</h2>
            <p>Download anonymized statistics in PDF or Excel format.</p>
            <Link to="/statistics" className="btn btn-outline">Export Statistics</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;