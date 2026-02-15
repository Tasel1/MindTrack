import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { entryService } from '../services/entryService';

const ViewEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const response = await entryService.getEntryById(id);
        setEntry(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await entryService.deleteEntry(id);
        navigate('/entries'); // Redirect to entries list after successful deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading entry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <p className="error-message">Error: {error}</p>
          <Link to="/entries" className="btn btn-outline">Back to Entries</Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container">
        <div className="card">
          <p>Entry not found</p>
          <Link to="/entries" className="btn btn-outline">Back to Entries</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card entry-view-card">
        <div className="entry-header">
          <h2>Mood Entry Details</h2>
          <div className="entry-actions">
            <Link to={`/entries/edit/${entry.id}`} className="btn btn-primary">Edit</Link>
            <button 
              onClick={handleDelete}
              className="btn btn-outline"
              style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              Delete
            </button>
            <Link to="/entries" className="btn btn-outline">Back to Entries</Link>
          </div>
        </div>
        
        <div className="entry-details">
          <div className="detail-item">
            <strong>Date:</strong>
            <span>{new Date(entry.date).toLocaleDateString()}</span>
          </div>
          
          <div className="detail-item">
            <strong>Emotion:</strong>
            <span style={{ color: entry.emotion_color || '#4361ee', fontWeight: 'bold' }}>
              {entry.emotion_name}
            </span>
          </div>
          
          <div className="detail-item">
            <strong>Intensity:</strong>
            <span>{entry.intensity}/10</span>
          </div>
          
          {entry.note && (
            <div className="detail-item">
              <strong>Note:</strong>
              <p className="entry-note">{entry.note}</p>
            </div>
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="detail-item">
              <strong>Tags:</strong>
              <div className="entry-tags">
                {entry.tags.map(tag => (
                  <span key={tag.id} className="tag-badge">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="detail-item">
            <strong>Created:</strong>
            <span>{new Date(entry.created_at).toLocaleString()}</span>
          </div>
          
          {entry.updated_at && entry.updated_at !== entry.created_at && (
            <div className="detail-item">
              <strong>Last Updated:</strong>
              <span>{new Date(entry.updated_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEntryPage;