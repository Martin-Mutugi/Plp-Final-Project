const User = require('../models/User');
const Chat = require('../models/Chat');
const FarmData = require('../models/FarmData');
const SDGMetrics = require('../models/SDGMetrics');

class SDGCalculator {
  
  static async calculateDailyImpact() {
    try {
      // Get today's date range
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Count total users and prompts
      const totalUsers = await User.countDocuments();
      const totalPrompts = await Chat.countDocuments();

      // If no data exists, return basic metrics
      if (totalUsers === 0 && totalPrompts === 0) {
        return new SDGMetrics({
          totalUsers: 0,
          totalPrompts: 0,
          sdgImpact: {
            mealsSupported: 0,
            foodWasteReduced: 0,
            co2Reduced: 0
          },
          platformStats: {
            farmersRegistered: 0,
            consumersRegistered: 0,
            premiumSubscribers: 0,
            proSubscribers: 0
          }
        });
      }

      // Calculate impact from AI chats (each chat contributes to sustainable practices)
      const todayChats = await Chat.countDocuments({
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      });
      
      // Calculate impact from farmer activities
      const farmDataCount = await FarmData.countDocuments();
      const activeFarmers = await FarmData.distinct('userId').length;

      // Calculate SDG impact (simplified calculations)
      const mealsSupported = Math.floor(totalPrompts * 0.5); // Each AI advice potentially improves yields
      const foodWasteReduced = Math.floor(totalPrompts * 0.01); // Tons reduced through better practices
      const co2Reduced = Math.floor(totalPrompts * 0.005); // Tons CO2 reduced

      // Platform statistics
      const premiumSubscribers = await User.countDocuments({ subscriptionTier: 'premium' });
      const proSubscribers = await User.countDocuments({ subscriptionTier: 'pro' });
      const consumersRegistered = Math.max(0, (totalUsers || 0) - (activeFarmers || 0));

      // Save metrics
      const metrics = new SDGMetrics({
        totalUsers,
        totalPrompts,
        sdgImpact: {
          mealsSupported,
          foodWasteReduced,
          co2Reduced
        },
        platformStats: {
          farmersRegistered: activeFarmers,
          consumersRegistered,
          premiumSubscribers,
          proSubscribers
        }
      });

      await metrics.save();
      return metrics;

    } catch (error) {
      console.error('SDG calculation error:', error);
      throw error;
    }
  }

  static async getLatestMetrics() {
    try {
      const metrics = await SDGMetrics.findOne().sort({ date: -1 });
      return metrics;
    } catch (error) {
      console.error('Error fetching SDG metrics:', error);
      throw error;
    }
  }

  static async initializeMetrics() {
    try {
      // Check if we have any metrics already
      const existingMetrics = await SDGMetrics.countDocuments();
      if (existingMetrics === 0) {
        // Create initial metrics with current data
        await this.calculateDailyImpact();
        console.log('Initial SDG metrics created');
      }
    } catch (error) {
      console.error('SDG initialization error:', error);
    }
  }
}

module.exports = SDGCalculator;