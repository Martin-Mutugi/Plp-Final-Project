const mongoose = require('mongoose');

const sdgMetricsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalUsers: Number,
  totalPrompts: Number,
  sdgImpact: {
    mealsSupported: Number,
    foodWasteReduced: Number, // in tons
    co2Reduced: Number // in tons
  },
  platformStats: {
    farmersRegistered: Number,
    consumersRegistered: Number,
    premiumSubscribers: Number,
    proSubscribers: Number
  },
  userActivities: [{
    userId: mongoose.Schema.Types.ObjectId,
    activityType: String, // 'chat', 'crop_added', 'subscription'
    impactValue: Number,
    timestamp: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('SDGMetrics', sdgMetricsSchema);