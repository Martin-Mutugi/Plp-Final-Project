const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionTier: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
  promptsUsed: { type: Number, default: 0 },
  region: { type: String, default: 'global' },
  preferredLanguage: { type: String, default: 'english' },
  achievements: [{
    badge: String,
    earnedAt: { type: Date, default: Date.now },
    description: String,
    points: Number
  }],
  totalPoints: { type: Number, default: 0 },
  sustainabilityScore: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  profile: {
    userType: { type: String, enum: ['farmer', 'consumer', 'both'], default: 'consumer' },
    farmSize: Number,
    crops: [String],
    sustainabilityGoals: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);