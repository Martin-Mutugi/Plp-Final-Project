const mongoose = require('mongoose');

const farmDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: String,
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  currentCrops: [{
    cropName: String,
    plantingDate: Date,
    expectedHarvest: Date,
    area: Number // in acres/hectares
  }],
  soilHealth: {
    phLevel: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    organicMatter: Number,
    lastTested: Date
  },
  irrigationSchedule: [{
    crop: String,
    frequency: String, // daily, weekly, etc.
    waterAmount: Number, // in liters
    nextIrrigation: Date
  }],
  pestReports: [{
    crop: String,
    pestType: String,
    severity: String, // low, medium, high
    dateReported: Date,
    treatment: String
  }],
  cropRotationHistory: [{
    season: String,
    year: Number,
    crops: [String],
    yield: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('FarmData', farmDataSchema);