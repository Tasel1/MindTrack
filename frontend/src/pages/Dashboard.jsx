import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { entryService } from '../services/entryService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        setLoading(true);
        const response = await entryService.getUserEntries({ limit: 5 });
        setRecentEntries(response.data.entries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, []);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.first_name || user?.email}!</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <Link to="/entries/create" className="btn btn-primary">Create New Entry</Link>
          <Link to="/entries" className="btn btn-outline">View All Entries</Link>
          {user?.role === 'student' && (
            <>
              <Link to="/entries" className="btn btn-outline">View Trends</Link>
              <Link to="/entries" className="btn btn-outline">View Calendar</Link>
            </>
          )}
          {user?.role === 'psychologist' && (
            <Link to="/statistics" className="btn btn-outline">View Statistics</Link>
          )}
        </div>

        <div className="dashboard-widgets">
          <div className="card">
            <h2>Recent Entries</h2>
            {loading ? (
              <p>Loading recent entries...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : recentEntries.length > 0 ? (
              <ul className="entries-list">
                {recentEntries.map(entry => (
                  <li key={entry.id} className="entry-item">
                    <div className="entry-date">{new Date(entry.date).toLocaleDateString()}</div>
                    <div className="entry-emotion" style={{ color: entry.emotion_color }}>
                      {entry.emotion_name}
                    </div>
                    <div className="entry-intensity">Intensity: {entry.intensity}/10</div>
                    <Link to={`/entries/view/${entry.id}`} className="view-entry-link">View</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent entries. <Link to="/entries/create">Create your first entry!</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;