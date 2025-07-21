const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const UserProfile = require('../models/UserProfile');
const { protect } = require('../middleware/authMiddleware');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's achievements
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.params.userId })
      .populate('badges');
    res.json(userProfile.badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check for new achievements
router.post('/check/:userId', protect, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.params.userId });
    const achievements = await Achievement.find();
    const newAchievements = [];

    // Get user stats
    const stats = await getUserStats(req.params.userId);

    // Check each achievement
    for (const achievement of achievements) {
      if (!userProfile.badges.includes(achievement._id)) {
        if (checkAchievementCriteria(achievement, stats)) {
          newAchievements.push(achievement);
          userProfile.badges.push(achievement._id);
        }
      }
    }

    if (newAchievements.length > 0) {
      await userProfile.save();
    }

    res.json({ newAchievements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get user stats
async function getUserStats(userId) {
  // Implement stats gathering logic here
  // This should count posts, comments, reactions, etc.
  return {
    posts: 0, // Count from Posts collection
    comments: 0, // Count from Comments collection
    reactions: 0, // Count from Reactions collection
    views: 0 // Count from PostViews collection
  };
}

// Helper function to check if achievement criteria is met
function checkAchievementCriteria(achievement, stats) {
  const { type, count } = achievement.criteria;
  return stats[type] >= count;
}

module.exports = router;