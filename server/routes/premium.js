const express = require('express');
const PremiumFeatures = require('../services/premiumFeatures');
const User = require('../models/User');
const router = express.Router();

// Advanced Analytics for Premium+ users
router.get('/analytics/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || (user.subscriptionTier === 'free')) {
      return res.status(403).json({ error: 'Advanced analytics require Premium subscription' });
    }

    const analytics = await PremiumFeatures.getUserAnalytics(req.params.userId);
    res.json(analytics);

  } catch (error) {
    res.status(500).json({ error: 'Analytics generation failed' });
  }
});

// Climate Forecasting for Pro users
router.get('/climate-forecast/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || user.subscriptionTier !== 'pro') {
      return res.status(403).json({ error: 'Climate forecasting requires Pro subscription' });
    }

    const { crop } = req.query;
    const forecast = await PremiumFeatures.getClimateForecast(user.region, crop);
    res.json({ forecast, region: user.region, crop });

  } catch (error) {
    res.status(500).json({ error: 'Climate forecast failed' });
  }
});

// Supply Chain Optimization for Pro users
router.get('/supply-chain/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || user.subscriptionTier !== 'pro') {
      return res.status(403).json({ error: 'Supply chain optimization requires Pro subscription' });
    }

    const tips = await PremiumFeatures.getSupplyChainTips(user.profile?.userType);
    res.json({ tips, userType: user.profile?.userType });

  } catch (error) {
    res.status(500).json({ error: 'Supply chain analysis failed' });
  }
});

// Gamification: Get user achievements
router.get('/achievements/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({
      achievements: user.achievements || [],
      totalPoints: user.totalPoints || 0,
      sustainabilityScore: user.sustainabilityScore || 0
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Award achievement (triggered by various actions)
router.post('/achievements/:userId/award', async (req, res) => {
  try {
    const { achievementType } = req.body;
    const achievement = await PremiumFeatures.awardAchievement(req.params.userId, achievementType);
    
    if (achievement) {
      res.json({ message: 'Achievement awarded!', achievement });
    } else {
      res.json({ message: 'Achievement already earned or invalid' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to award achievement' });
  }
});

// Priority Support for Pro users
router.get('/priority-support/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || user.subscriptionTier !== 'pro') {
      return res.status(403).json({ error: 'Priority support requires Pro subscription' });
    }

    res.json({
      supportAvailable: true,
      responseTime: 'Within 2 hours',
      contact: 'support@sustainableag.com',
      features: ['Dedicated support line', 'Technical assistance', 'Feature requests']
    });

  } catch (error) {
    res.status(500).json({ error: 'Support system error' });
  }
});

// Regional crop recommendations
router.get('/regional-crops/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const region = user.region || 'global';

    const regionalCrops = {
      'east-africa': ['Maize', 'Coffee', 'Tea', 'Bananas', 'Beans'],
      'west-africa': ['Cassava', 'Yams', 'Millet', 'Sorghum', 'Groundnuts'],
      'southern-africa': ['Maize', 'Wheat', 'Sugarcane', 'Citrus', 'Grapes'],
      'global': ['Tomatoes', 'Potatoes', 'Carrots', 'Lettuce', 'Onions']
    };

    res.json({
      region,
      recommendedCrops: regionalCrops[region] || regionalCrops.global,
      plantingTips: await PremiumFeatures.getClimateInsights(region)
    });

  } catch (error) {
    res.status(500).json({ error: 'Regional analysis failed' });
  }
});

module.exports = router;