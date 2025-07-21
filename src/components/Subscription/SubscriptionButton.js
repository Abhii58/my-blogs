import React, { useState, useContext } from 'react';
import axios from '../../axiosConfig';
import { UserContext } from '../../contexts/UserContext';
import './SubscriptionButton.css';

const SubscriptionButton = ({ type, targetId, targetName }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: false
  });
  const { user } = useContext(UserContext);

  const handleSubscribe = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await axios.post('/api/subscriptions', {
        type,
        target: targetId,
        notifications: notificationPrefs
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.delete(`/api/subscriptions/${type}/${targetId}`);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const toggleNotificationPref = (type) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="subscription-container">
      <button 
        className={`subscription-button ${isSubscribed ? 'subscribed' : ''}`}
        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
        disabled={!user}
      >
        {isSubscribed ? 'Subscribed' : `Subscribe to ${targetName}`}
      </button>
      
      {isSubscribed && (
        <div className="notification-preferences">
          <label className="notification-option">
            <input
              type="checkbox"
              checked={notificationPrefs.email}
              onChange={() => toggleNotificationPref('email')}
            />
            Email Notifications
          </label>
          <label className="notification-option">
            <input
              type="checkbox"
              checked={notificationPrefs.push}
              onChange={() => toggleNotificationPref('push')}
            />
            Push Notifications
          </label>
        </div>
      )}
    </div>
  );
};

export default SubscriptionButton;