const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FarmData = require('../models/FarmData');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get farmer's farm data
router.get('/:userId', async (req, res) => {
  try {
    const farmData = await FarmData.findOne({ userId: req.params.userId });
    res.json(farmData || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farm data' });
  }
});

// Update farm data
router.post('/:userId', async (req, res) => {
  try {
    const farmData = await FarmData.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(farmData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update farm data' });
  }
});

// Add crop rotation plan
router.post('/:userId/rotation', async (req, res) => {
  try {
    const { season, year, crops, expectedYield } = req.body;
    const farmData = await FarmData.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          cropRotationHistory: {
            season,
            year,
            crops,
            expectedYield
          }
        }
      },
      { new: true, upsert: true }
    );
    res.json(farmData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add crop rotation' });
  }
});

// Report pest/disease
router.post('/:userId/pests', async (req, res) => {
  try {
    const { crop, pestType, severity, treatment } = req.body;
    const farmData = await FarmData.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          pestReports: {
            crop,
            pestType,
            severity,
            treatment,
            dateReported: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );
    res.json(farmData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to report pest' });
  }
});

// AI-powered pest/disease analysis
router.post('/:userId/pests/analyze', async (req, res) => {
  try {
    const { crop, symptoms, description } = req.body;
    
    // Use Gemini AI to analyze pest/disease
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
    const prompt = `As an agricultural expert, analyze these crop symptoms and provide diagnosis and treatment:
    Crop: ${crop}
    Symptoms: ${symptoms}
    Description: ${description}
    Please provide: 1) Likely pest/disease, 2) Severity assessment, 3) Organic treatment options, 4) Prevention tips`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiAnalysis = response.text();

    // Save the analysis
    const farmData = await FarmData.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          pestReports: {
            crop,
            symptoms,
            description,
            pestType: 'AI Analysis Completed',
            severity: 'analyzed',
            treatment: aiAnalysis,
            dateReported: new Date(),
            aiAnalyzed: true
          }
        }
      },
      { new: true, upsert: true }
    );

    res.json({ analysis: aiAnalysis, farmData });

  } catch (error) {
    res.status(500).json({ error: 'AI analysis failed: ' + error.message });
  }
});

// Climate-smart irrigation scheduling
router.post('/:userId/irrigation/schedule', async (req, res) => {
  try {
    const { crop, soilType, weatherConditions, area } = req.body;
    
    // Use Gemini AI for irrigation recommendations
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
    const prompt = `As an irrigation expert, provide climate-smart irrigation advice:
    Crop: ${crop}
    Soil Type: ${soilType}
    Weather: ${weatherConditions}
    Area: ${area} acres
    Please provide: 1) Optimal irrigation frequency, 2) Water amount per session, 3) Best time of day, 4) Water conservation tips`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const irrigationAdvice = response.text();

    // Save irrigation schedule
    const farmData = await FarmData.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          irrigationSchedule: {
            crop,
            soilType,
            weatherConditions,
            area,
            frequency: 'AI Recommended',
            waterAmount: 0, // Will be determined by AI
            nextIrrigation: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            aiRecommendation: irrigationAdvice
          }
        }
      },
      { new: true, upsert: true }
    );

    res.json({ irrigationAdvice, farmData });

  } catch (error) {
    res.status(500).json({ error: 'Irrigation scheduling failed: ' + error.message });
  }
});

module.exports = router;