const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['posts', 'comments', 'reactions', 'views'],
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);