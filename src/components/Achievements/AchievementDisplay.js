import React from 'react';
import './Achievements.css';

const AchievementDisplay = ({ achievements }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#000000';
    }
  };

  return (
    <div className="achievements-container">
      <h3>Achievements</h3>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div 
            key={achievement._id} 
            className="achievement-card"
            style={{ borderColor: getTierColor(achievement.tier) }}
          >
            <div className="achievement-icon">
              {achievement.icon}
            </div>
            <div className="achievement-info">
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
              <span className="achievement-tier" style={{ color: getTierColor(achievement.tier) }}>
                {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementDisplay;