const mongoose = require('mongoose');

const consumerDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodWasteLog: [{
    date: Date,
    foodType: String,
    amount: Number, // in kg
    reason: String, // spoiled, leftovers, etc.
    cost: Number
  }],
  shoppingPreferences: {
    organic: Boolean,
    localProduce: Boolean,
    seasonal: Boolean,
    packaging: String // minimal, recyclable, etc.
  },
  carbonFootprint: {
    dietType: String, // vegetarian, vegan, omnivore, etc.
    weeklyMeals: Number,
    transportation: String, // car, public, bike, etc.
    estimatedCO2: Number // kg CO2 per month
  },
  sustainabilityGoals: [{
    goal: String,
    target: Number,
    current: Number,
    deadline: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('ConsumerData', consumerDataSchema);