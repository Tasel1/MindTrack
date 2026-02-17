import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfile(response.data);
        setFormData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card profile-card">
        <h2>Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="form-input"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="form-input"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-info">
              <div className="info-item">
                <strong>Email:</strong>
                <span>{profile.email}</span>
              </div>
              
              <div className="info-item">
                <strong>Name:</strong>
                <span>{profile.first_name} {profile.last_name}</span>
              </div>
              
              <div className="info-item">
                <strong>Role:</strong>
                <span>{profile.role}</span>
              </div>
              
              {user?.role === 'student' && profile.school_id && (
                <div className="info-item">
                  <strong>School ID:</strong>
                  <span>{profile.school_id}</span>
                </div>
              )}
              
              {profile.date_of_birth && (
                <div className="info-item">
                  <strong>Date of Birth:</strong>
                  <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="info-item">
                <strong>Member Since:</strong>
                <span>{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="profile-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;