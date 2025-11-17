const User = require('../models/User');
const Chat = require('../models/Chat');
const FarmData = require('../models/FarmData');

class PremiumFeatures {
  
  // Advanced Analytics for Premium Users
  static async getUserAnalytics(userId) {
    try {
      const user = await User.findById(userId);
      const chatHistory = await Chat.find({ userId }).sort({ timestamp: -1 }).limit(100);
      const farmData = await FarmData.findOne({ userId });

      // Calculate sustainability score
      const sustainabilityScore = await this.calculateSustainabilityScore(userId);
      
      // Generate personalized recommendations
      const recommendations = await this.generateRecommendations(userId, chatHistory, farmData);
      
      // Climate insights based on user region
      const climateInsights = await this.getClimateInsights(user.region);
      
      // Supply chain optimization (simplified)
      const supplyChainTips = await this.getSupplyChainTips(user.profile?.userType);

      return {
        sustainabilityScore,
        recommendations,
        climateInsights,
        supplyChainTips,
        usageStats: {
          totalChats: chatHistory.length,
          mostUsedFeatures: this.analyzeFeatureUsage(chatHistory),
          engagementLevel: this.calculateEngagement(chatHistory)
        }
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }

  // Climate Forecasting for Pro Users
  static async getClimateForecast(region, cropType) {
    // Simplified climate forecasting based on region and crop
    const forecasts = {
      'east-africa': {
        'maize': 'Moderate rainfall expected. Optimal planting window: next 2 weeks.',
        'coffee': 'Cool temperatures favorable for flowering. Watch for fungal diseases.',
        'vegetables': 'Good growing conditions. Consider drip irrigation for water efficiency.'
      },
      'west-africa': {
        'maize': 'Dry spell expected. Consider drought-resistant varieties.',
        'cassava': 'Optimal conditions. Monitor for mosaic virus.',
        'vegetables': 'High humidity expected. Increase spacing for air circulation.'
      },
      'global': {
        'default': 'Monitor local weather reports for precise planning.'
      }
    };

    return forecasts[region]?.[cropType] || forecasts[region]?.default || forecasts.global.default;
  }

  // Supply Chain Optimization
  static async getSupplyChainTips(userType) {
    const tips = {
      farmer: [
        'Connect with local farmer cooperatives for better market access',
        'Consider direct-to-consumer sales through digital platforms',
        'Explore contract farming with food processors',
        'Implement harvest planning to reduce post-harvest losses'
      ],
      consumer: [
        'Buy directly from local farmers through community-supported agriculture',
        'Choose products with transparent supply chain information',
        'Support brands with sustainable packaging and logistics',
        'Plan purchases to reduce food miles and transportation emissions'
      ],
      both: [
        'Participate in farm-to-table initiatives',
        'Use digital platforms to connect producers and consumers directly',
        'Advocate for local food systems in your community'
      ]
    };

    return tips[userType] || tips.both;
  }

  // Gamification: Award achievements
  static async awardAchievement(userId, achievementType) {
    const achievements = {
      'first_chat': { badge: '🌱 Beginner', description: 'Sent first AI message', points: 10 },
      'crop_planned': { badge: '📅 Planner', description: 'Created first crop plan', points: 20 },
      'waste_reduced': { badge: '♻️ Saver', description: 'Reduced food waste', points: 30 },
      'premium_upgrade': { badge: '⭐ Supporter', description: 'Upgraded to Premium', points: 50 },
      'pro_upgrade': { badge: '🏆 Champion', description: 'Upgraded to Pro', points: 100 },
      'sustainability_leader': { badge: '🌍 Leader', description: 'High sustainability score', points: 75 }
    };

    const achievement = achievements[achievementType];
    if (achievement && !await this.hasAchievement(userId, achievementType)) {
      await User.findByIdAndUpdate(userId, {
        $push: { achievements: achievement },
        $inc: { totalPoints: achievement.points }
      });
      return achievement;
    }
    return null;
  }

  // Helper methods
  static async calculateSustainabilityScore(userId) {
    // Simplified sustainability scoring
    const user = await User.findById(userId);
    const farmData = await FarmData.findOne({ userId });
    const chatHistory = await Chat.find({ userId });

    let score = 50; // Base score

    // Add points for sustainable actions
    if (farmData?.cropRotationHistory?.length > 0) score += 10;
    if (farmData?.pestReports?.some(report => report.treatment?.includes('organic'))) score += 15;
    if (chatHistory.some(chat => chat.message?.includes('sustainable'))) score += 5;
    if (user.subscriptionTier !== 'free') score += 20;

    return Math.min(score, 100);
  }

  static async generateRecommendations(userId, chatHistory, farmData) {
    const recommendations = [];
    
    // Based on chat history
    const recentTopics = chatHistory.slice(0, 10).map(chat => chat.message);
    
    if (recentTopics.some(topic => topic?.includes('pest'))) {
      recommendations.push('Consider integrated pest management for long-term control');
    }
    
    if (recentTopics.some(topic => topic?.includes('soil'))) {
      recommendations.push('Regular soil testing can optimize fertilizer use');
    }

    // Based on farm data
    if (farmData?.currentCrops?.length > 2) {
      recommendations.push('Diversified cropping detected - excellent for soil health!');
    }

    return recommendations.length > 0 ? recommendations : ['Continue your sustainable practices!'];
  }

  static analyzeFeatureUsage(chatHistory) {
    const features = {};
    chatHistory.forEach(chat => {
      const message = chat.message?.toLowerCase();
      if (message?.includes('pest')) features.pestAnalysis = (features.pestAnalysis || 0) + 1;
      if (message?.includes('irrigation')) features.irrigation = (features.irrigation || 0) + 1;
      if (message?.includes('soil')) features.soil = (features.soil || 0) + 1;
      if (message?.includes('crop')) features.crops = (features.crops || 0) + 1;
    });
    return Object.entries(features).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }

  static calculateEngagement(chatHistory) {
    const recentChats = chatHistory.filter(chat => 
      new Date(chat.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    return recentChats.length > 20 ? 'high' : recentChats.length > 5 ? 'medium' : 'low';
  }

  static async hasAchievement(userId, achievementType) {
    const user = await User.findById(userId);
    return user.achievements.some(ach => ach.badge === achievements[achievementType]?.badge);
  }

  static async getClimateInsights(region) {
    const insights = {
      'east-africa': 'Seasonal rains expected. Good for maize and coffee.',
      'west-africa': 'Harmattan season approaching. Protect sensitive crops.',
      'southern-africa': 'Cyclone season alert. Secure infrastructure.',
      'global': 'Monitor local climate patterns for optimal planning.'
    };
    return insights[region] || insights.global;
  }
}

module.exports = PremiumFeatures;