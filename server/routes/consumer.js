const express = require('express');
const ConsumerData = require('../models/ConsumerData');
const router = express.Router();

// Get consumer data
router.get('/:userId', async (req, res) => {
  try {
    const consumerData = await ConsumerData.findOne({ userId: req.params.userId });
    res.json(consumerData || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch consumer data' });
  }
});

// Update consumer data
router.post('/:userId', async (req, res) => {
  try {
    const consumerData = await ConsumerData.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(consumerData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update consumer data' });
  }
});

// Log food waste
router.post('/:userId/food-waste', async (req, res) => {
  try {
    const { foodType, amount, reason, cost } = req.body;
    const consumerData = await ConsumerData.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          foodWasteLog: {
            date: new Date(),
            foodType,
            amount,
            reason,
            cost
          }
        }
      },
      { new: true, upsert: true }
    );
    res.json(consumerData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log food waste' });
  }
});

// Calculate carbon footprint
router.post('/:userId/carbon-footprint', async (req, res) => {
  try {
    const { dietType, weeklyMeals, transportation } = req.body;
    
    // Simplified carbon footprint calculation
    const dietFactors = {
      vegan: 1.5,
      vegetarian: 2.0,
      omnivore: 3.5
    };
    
    const transportFactors = {
      bike: 0,
      public: 50,
      car: 200
    };
    
    const estimatedCO2 = (dietFactors[dietType] || 2.5) * weeklyMeals * 4 + 
                         (transportFactors[transportation] || 100);

    const consumerData = await ConsumerData.findOneAndUpdate(
      { userId: req.params.userId },
      {
        carbonFootprint: {
          dietType,
          weeklyMeals,
          transportation,
          estimatedCO2
        }
      },
      { new: true, upsert: true }
    );
    
    res.json(consumerData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate carbon footprint' });
  }
});

module.exports = router;