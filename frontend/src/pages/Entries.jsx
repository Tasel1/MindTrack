import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { entryService } from '../services/entryService';

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    totalCount: 0
  });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await entryService.getUserEntries({
          limit: pagination.limit,
          offset: pagination.offset
        });
        
        setEntries(response.data.entries);
        setPagination(prev => ({
          ...prev,
          totalCount: response.data.count
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [pagination.limit, pagination.offset]);

  const handleDelete = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await entryService.deleteEntry(entryId);
        // Refresh entries list
        const response = await entryService.getUserEntries({
          limit: pagination.limit,
          offset: pagination.offset
        });
        setEntries(response.data.entries);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  const goToPage = (page) => {
    const newOffset = (page - 1) * pagination.limit;
    setPagination(prev => ({
      ...prev,
      offset: newOffset
    }));
  };

  return (
    <div className="container">
      <div className="entries-header">
        <h1>Your Mood Entries</h1>
        <Link to="/entries/create" className="btn btn-primary">Create New Entry</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading entries...</p>
      ) : (
        <>
          <div className="entries-list">
            {entries.length > 0 ? (
              entries.map(entry => (
                <div key={entry.id} className="entry-card card">
                  <div className="entry-header">
                    <h3>{new Date(entry.date).toLocaleDateString()}</h3>
                    <div className="entry-actions">
                      <Link to={`/entries/edit/${entry.id}`} className="btn btn-outline">Edit</Link>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="btn btn-outline"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="entry-content">
                    <div className="entry-emotion">
                      <span style={{ color: entry.emotion_color || '#4361ee' }}>
                        <strong>Emotion:</strong> {entry.emotion_name}
                      </span>
                    </div>
                    
                    <div className="entry-intensity">
                      <strong>Intensity:</strong> {entry.intensity}/10
                    </div>
                    
                    {entry.note && (
                      <div className="entry-note">
                        <strong>Note:</strong> {entry.note}
                      </div>
                    )}
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="entry-tags">
                        <strong>Tags:</strong> {entry.tags.map(tag => tag.name).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <Link to={`/entries/view/${entry.id}`} className="view-details-link">View Details</Link>
                </div>
              ))
            ) : (
              <div className="no-entries">
                <p>You haven't created any mood entries yet.</p>
                <Link to="/entries/create" className="btn btn-primary">Create Your First Entry</Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EntriesPage;