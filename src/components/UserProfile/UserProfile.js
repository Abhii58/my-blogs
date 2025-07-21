import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile/me');
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={profile?.avatar || '/default-avatar.png'} 
          alt="Profile" 
          className="profile-avatar"
        />
        <h2>{profile?.user?.username}</h2>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Bio</h3>
          <p>{profile?.bio || 'No bio added yet'}</p>
        </div>

        <div className="profile-section">
          <h3>Social Links</h3>
          <div className="social-links">
            {profile?.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
            {profile?.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {profile?.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Reading List</h3>
          <div className="reading-list">
            {profile?.readingList?.map(item => (
              <div key={item._id} className="reading-list-item">
                <h4>{item.post.title}</h4>
                <span>Added: {new Date(item.addedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Badges</h3>
          <div className="badges-list">
            {profile?.badges?.map(badge => (
              <div key={badge._id} className="badge-item">
                <span className="badge-name">{badge.name}</span>
                <span className="badge-description">{badge.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;