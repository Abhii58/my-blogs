const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { protect } = require('../middleware/authMiddleware');

// Get user profile
router.get('/me', protect, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user.id })
      .populate('bookmarks')
      .populate('readingList.post');
    
    if (!profile) {
      profile = await UserProfile.create({ user: req.user.id });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const { bio, socialLinks } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      { bio, socialLinks },
      { new: true, runValidators: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add bookmark
router.post('/bookmarks/:postId', protect, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { bookmarks: req.params.postId } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add to reading list
router.post('/reading-list/:postId', protect, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      { 
        $addToSet: { 
          readingList: { 
            post: req.params.postId 
          } 
        } 
      },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;