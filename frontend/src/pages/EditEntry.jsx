import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { entryService } from '../services/entryService';

const EditEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    emotion_id: '',
    intensity: 5,
    note: '',
    tag_ids: []
  });
  const [emotions, setEmotions] = useState([]);
  const [tags, setTags] = useState([]);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Predefined emotions and tags
  const predefinedEmotions = [
    { id: 1, name: 'радость', color_code: '#FFD700' },
    { id: 2, name: 'грусть', color_code: '#4682B4' },
    { id: 3, name: 'гнев', color_code: '#DC143C' },
    { id: 4, name: 'страх', color_code: '#9370DB' },
    { id: 5, name: 'спокойствие', color_code: '#32CD32' },
    { id: 6, name: 'удивление', color_code: '#FFA500' },
    { id: 7, name: 'вина', color_code: '#808080' },
    { id: 8, name: 'стыд', color_code: '#4B0082' }
  ];

  const predefinedTags = [
    { id: 1, name: 'учёба' },
    { id: 2, name: 'друзья' },
    { id: 3, name: 'семья' },
    { id: 4, name: 'здоровье' },
    { id: 5, name: 'хобби' },
    { id: 6, name: 'будущее' },
    { id: 7, name: 'одиночество' }
  ];

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const response = await entryService.getEntryById(id);
        const entryData = response.data;
        
        // Set form data with entry details
        setFormData({
          date: entryData.date.split('T')[0], // Format date as YYYY-MM-DD
          emotion_id: entryData.emotion_id,
          intensity: entryData.intensity,
          note: entryData.note || '',
          tag_ids: entryData.tags ? entryData.tags.map(tag => tag.id) : []
        });
        
        setEntry(entryData);
        setEmotions(predefinedEmotions);
        setTags(predefinedTags);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (tagId) => {
    setFormData(prev => {
      if (prev.tag_ids.includes(tagId)) {
        return {
          ...prev,
          tag_ids: prev.tag_ids.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          tag_ids: [...prev.tag_ids, tagId]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await entryService.updateEntry(id, formData);
      navigate(`/entries/view/${id}`); // Redirect to view page after successful update
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <div className="container">
      <div className="card entry-form-card">
        <h2>Edit Mood Entry</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="emotion_id" className="form-label">Emotion</label>
            <div className="emotion-options">
              {emotions.map(emotion => (
                <label key={emotion.id} className="emotion-option">
                  <input
                    type="radio"
                    name="emotion_id"
                    value={emotion.id}
                    checked={parseInt(formData.emotion_id) === emotion.id}
                    onChange={handleChange}
                    required
                  />
                  <span 
                    className={`emotion-name ${parseInt(formData.emotion_id) === emotion.id ? 'selected' : ''}`}
                    style={{ color: emotion.color_code }}
                  >
                    {emotion.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="intensity" className="form-label">
              Intensity: {formData.intensity}/10
            </label>
            <input
              type="range"
              id="intensity"
              name="intensity"
              min="1"
              max="10"
              value={formData.intensity}
              onChange={handleChange}
              className="intensity-slider"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="note" className="form-label">Note (Optional)</label>
            <textarea
              id="note"
              name="note"
              className="form-input"
              value={formData.note}
              onChange={handleChange}
              rows="4"
              placeholder="How are you feeling? What happened today?"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tag-options">
              {tags.map(tag => (
                <label key={tag.id} className="tag-option">
                  <input
                    type="checkbox"
                    value={tag.id}
                    checked={formData.tag_ids.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  <span className={`tag-name ${formData.tag_ids.includes(tag.id) ? 'selected' : ''}`}>
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Updating Entry...' : 'Update Entry'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => navigate(`/entries/view/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntryPage;