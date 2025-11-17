import React, { useState, useEffect } from 'react';

function PremiumDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [climateForecast, setClimateForecast] = useState(null);
  const [supplyChainTips, setSupplyChainTips] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [regionalCrops, setRegionalCrops] = useState(null);
  const [prioritySupport, setPrioritySupport] = useState(null);
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    if (user.subscriptionTier !== 'free') {
      loadAnalytics();
      loadAchievements();
      loadRegionalCrops();
      
      if (user.subscriptionTier === 'pro') {
        loadClimateForecast();
        loadSupplyChainTips();
        loadPrioritySupport();
      }
    }
  }, [user.id, user.subscriptionTier]);

  const setLoading = (key, loading) => {
    setIsLoading(prev => ({ ...prev, [key]: loading }));
  };

  const loadAnalytics = async () => {
    setLoading('analytics', true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/analytics/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading('analytics', false);
    }
  };

  const loadClimateForecast = async () => {
    setLoading('climate', true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/climate-forecast/${user.id}?crop=maize`);
      if (response.ok) {
        const data = await response.json();
        setClimateForecast(data);
      }
    } catch (error) {
      console.error('Failed to load climate forecast:', error);
    } finally {
      setLoading('climate', false);
    }
  };

  const loadSupplyChainTips = async () => {
    setLoading('supply', true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/supply-chain/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSupplyChainTips(data);
      }
    } catch (error) {
      console.error('Failed to load supply chain tips:', error);
    } finally {
      setLoading('supply', false);
    }
  };

  const loadAchievements = async () => {
    setLoading('achievements', true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/achievements/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading('achievements', false);
    }
  };

  const loadRegionalCrops = async () => {
    setLoading('regional', true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/regional-crops/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRegionalCrops(data);
      }
    } catch (error) {
      console.error('Failed to load regional crops:', error);
    } finally {
      setLoading('regional', false);
    }
  };

  const loadPrioritySupport = async () => {
    setLoading('support', true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/priority-support/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPrioritySupport(data);
      }
    } catch (error) {
      console.error('Failed to load priority support:', error);
    } finally {
      setLoading('support', false);
    }
  };

  const awardAchievement = async (type) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/premium/achievements/${user.id}/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementType: type })
      });
      if (response.ok) {
        loadAchievements();
      }
    } catch (error) {
      console.error('Failed to award achievement:', error);
    }
  };

  const premiumTabs = [
    { id: 'analytics', label: '📊 Advanced Analytics', icon: '📊', available: true },
    { id: 'achievements', label: '🏆 Gamification', icon: '🏆', available: true },
    { id: 'regional', label: '🌍 Regional Insights', icon: '🌍', available: true },
  ];

  const proTabs = [
    { id: 'climate', label: '🌤️ Climate Forecast', icon: '🌤️', available: user.subscriptionTier === 'pro' },
    { id: 'supply', label: '🔗 Supply Chain', icon: '🔗', available: user.subscriptionTier === 'pro' },
    { id: 'support', label: '🚨 Priority Support', icon: '🚨', available: user.subscriptionTier === 'pro' },
  ];

  const allTabs = [...premiumTabs, ...proTabs];

  return (
    <div className="container py-8">
      {/* Premium Header */}
      <div className="text-center mb-8 fade-in">
        <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
          <span className="text-4xl">
            {user.subscriptionTier === 'pro' ? '🚀' : '⭐'}
          </span>
        </div>
        <h1>Exclusive {user.subscriptionTier === 'pro' ? 'Pro Premium' : 'Premium'} Features</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto">
          Welcome to your exclusive dashboard! Access advanced tools and insights 
          designed to maximize your sustainable agriculture impact.
        </p>
        {user.subscriptionTier === 'pro' && (
          <div className="mt-4 flex justify-center gap-2">
            <span className="sdg-badge bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              🚀 All Pro Features Unlocked
            </span>
            <span className="sdg-badge bg-red-500 text-white">
              🚨 Priority Support Active
            </span>
          </div>
        )}
      </div>

      {/* Premium Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {allTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={!tab.available}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald to-teal text-white shadow-lg'
                : tab.available
                ? 'bg-cloud text-charcoal hover:bg-cloud-dark hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
            {!tab.available && (
              <span className="text-xs bg-gray-300 text-gray-600 px-1 rounded">Pro</span>
            )}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="fade-in">
          <h2 className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📊</span>
            Advanced Analytics Dashboard
          </h2>
          
          {isLoading.analytics ? (
            <div className="text-center py-12">
              <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
              <p className="text-stone">Loading your premium analytics...</p>
            </div>
          ) : analytics ? (
            <div className="grid grid-3 gap-6">
              {/* Sustainability Score */}
              <div className="card-elevated text-center col-span-1">
                <h4 className="font-semibold mb-4">Sustainability Score</h4>
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-8 border-emerald border-opacity-20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald">{analytics.sustainabilityScore}</div>
                      <div className="text-sm text-stone">/100</div>
                    </div>
                  </div>
                  <div 
                    className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-emerald border-t-transparent border-r-transparent transform -rotate-45"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                      background: `conic-gradient(var(--primary-emerald) ${analytics.sustainabilityScore * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                </div>
                <p className="text-sm text-stone mt-4">Your environmental impact rating</p>
              </div>

              {/* Usage Statistics */}
              <div className="card-elevated col-span-2">
                <h4 className="font-semibold mb-4">Usage Statistics</h4>
                <div className="grid grid-3 gap-4">
                  <div className="text-center p-4 bg-cloud rounded-lg">
                    <div className="text-2xl font-bold text-forest">{analytics.usageStats.totalChats}</div>
                    <div className="text-sm text-stone">Total Chats</div>
                  </div>
                  <div className="text-center p-4 bg-cloud rounded-lg">
                    <div className="text-2xl font-bold text-teal capitalize">{analytics.usageStats.engagementLevel}</div>
                    <div className="text-sm text-stone">Engagement Level</div>
                  </div>
                  <div className="text-center p-4 bg-cloud rounded-lg">
                    <div className="text-2xl font-bold text-emerald">
                      {analytics.usageStats.mostUsedFeatures.length}
                    </div>
                    <div className="text-sm text-stone">Active Features</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Top Features Used:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analytics.usageStats.mostUsedFeatures.map(([feature, count], index) => (
                      <span key={index} className="bg-emerald bg-opacity-10 text-emerald px-3 py-1 rounded-full text-sm">
                        {feature} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card-elevated col-span-3">
                <h4 className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💡</span>
                  Personalized Recommendations
                </h4>
                <div className="grid grid-2 gap-4">
                  {analytics.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-success bg-opacity-10 rounded-lg border border-success border-opacity-30">
                      <div className="flex items-start gap-3">
                        <span className="text-success text-lg">✓</span>
                        <p className="text-sm leading-relaxed">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-elevated text-center py-12">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Analytics Unavailable</h3>
              <p className="text-stone">Unable to load your analytics data at this time.</p>
              <button onClick={loadAnalytics} className="btn btn-primary mt-4">
                Retry Loading
              </button>
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="fade-in">
          <h2 className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🏆</span>
            Gamification & Achievements
          </h2>
          
          {isLoading.achievements ? (
            <div className="text-center py-12">
              <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
              <p className="text-stone">Loading your achievements...</p>
            </div>
          ) : achievements ? (
            <div className="grid grid-2 gap-8">
              {/* Progress Overview */}
              <div className="card-elevated">
                <h4 className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📈</span>
                  Your Progress Overview
                </h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-cloud rounded-lg">
                    <span className="font-medium">Total Points</span>
                    <span className="text-2xl font-bold text-warning">{achievements.totalPoints}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-cloud rounded-lg">
                    <span className="font-medium">Sustainability Score</span>
                    <span className="text-xl font-bold text-success">{achievements.sustainabilityScore}/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-cloud rounded-lg">
                    <span className="font-medium">Achievements Earned</span>
                    <span className="text-xl font-bold text-info">{achievements.achievements.length}</span>
                  </div>
                </div>

                {/* Test Buttons */}
                <div className="mt-6 p-4 bg-warning bg-opacity-10 rounded-lg border border-warning border-opacity-30">
                  <h5 className="font-semibold text-warning mb-3">🎮 Test Achievement System</h5>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => awardAchievement('first_chat')}
                      className="btn btn-outline text-sm"
                    >
                      Test First Chat
                    </button>
                    <button 
                      onClick={() => awardAchievement('sustainability_leader')}
                      className="btn btn-outline text-sm"
                    >
                      Test Sustainability
                    </button>
                    <button 
                      onClick={() => awardAchievement('premium_user')}
                      className="btn btn-outline text-sm"
                    >
                      Test Premium
                    </button>
                  </div>
                </div>
              </div>

              {/* Achievements List */}
              <div className="card-elevated">
                <h4 className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎯</span>
                  Your Achievements
                </h4>
                
                {achievements.achievements.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {achievements.achievements.map((ach, index) => (
                      <div key={index} className="p-4 bg-success bg-opacity-10 rounded-lg border border-success border-opacity-30">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ach.badge}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-charcoal">{ach.description}</div>
                            <div className="text-sm text-success mt-1">+{ach.points} points</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="text-stone">No achievements yet</p>
                    <p className="text-sm text-stone">Keep using the platform to earn badges and points!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-elevated text-center py-12">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Achievements Unavailable</h3>
              <p className="text-stone">Unable to load your achievements data.</p>
            </div>
          )}
        </div>
      )}

      {/* Regional Insights Tab */}
      {activeTab === 'regional' && (
        <div className="fade-in">
          <h2 className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🌍</span>
            Regional Crop Insights
          </h2>
          
          {isLoading.regional ? (
            <div className="text-center py-12">
              <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
              <p className="text-stone">Loading regional insights...</p>
            </div>
          ) : regionalCrops ? (
            <div className="grid grid-2 gap-8">
              <div className="card-elevated">
                <h4 className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🌱</span>
                  Recommended for {regionalCrops.region}
                </h4>
                <div className="space-y-3">
                  {regionalCrops.recommendedCrops.map((crop, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-cloud rounded-lg">
                      <span className="text-success">✓</span>
                      <span className="font-medium">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-elevated">
                <h4 className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💡</span>
                  Climate & Planting Insights
                </h4>
                <div className="p-4 bg-info bg-opacity-10 rounded-lg">
                  <p className="text-sm leading-relaxed">{regionalCrops.plantingTips}</p>
                </div>
                
                <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-lg">
                  <h5 className="font-semibold text-warning mb-2">🌦️ Seasonal Considerations</h5>
                  <p className="text-sm text-stone">
                    Based on current climate patterns and soil conditions in your region.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-elevated text-center py-12">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Regional Data Unavailable</h3>
              <p className="text-stone">Unable to load regional crop recommendations.</p>
            </div>
          )}
        </div>
      )}

      {/* Pro Features */}
      {user.subscriptionTier === 'pro' && (
        <>
          {/* Climate Forecast Tab */}
          {activeTab === 'climate' && (
            <div className="fade-in">
              <h2 className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🌤️</span>
                Climate Forecasting
              </h2>
              
              {isLoading.climate ? (
                <div className="text-center py-12">
                  <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
                  <p className="text-stone">Loading climate forecast...</p>
                </div>
              ) : climateForecast ? (
                <div className="card-elevated max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🌤️</div>
                    <h3 className="text-2xl font-semibold">Climate Forecast for {climateForecast.region}</h3>
                    <p className="text-stone mt-2">Personalized for your agricultural needs</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">📅 Forecast Details</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">{climateForecast.forecast}</p>
                    </div>
                    
                    <div className="mt-4 grid grid-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                        <div className="font-semibold text-blue-800">Target Crop</div>
                        <div className="text-lg text-charcoal">{climateForecast.crop}</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                        <div className="font-semibold text-blue-800">Risk Level</div>
                        <div className="text-lg text-success">Low</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-12">
                  <div className="text-4xl mb-4">🌤️</div>
                  <h3 className="text-xl font-semibold mb-2">Climate Data Unavailable</h3>
                  <p className="text-stone">Unable to load climate forecast at this time.</p>
                </div>
              )}
            </div>
          )}

          {/* Supply Chain Tab */}
          {activeTab === 'supply' && (
            <div className="fade-in">
              <h2 className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🔗</span>
                Supply Chain Optimization
              </h2>
              
              {isLoading.supply ? (
                <div className="text-center py-12">
                  <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
                  <p className="text-stone">Loading supply chain insights...</p>
                </div>
              ) : supplyChainTips ? (
                <div className="card-elevated max-w-4xl mx-auto">
                  <h3 className="flex items-center gap-2 mb-6 text-center justify-center">
                    <span className="text-2xl">🔗</span>
                    Tips for {supplyChainTips.userType}s
                  </h3>
                  
                  <div className="grid grid-2 gap-6">
                    {supplyChainTips.tips.map((tip, index) => (
                      <div key={index} className="p-4 bg-success bg-opacity-10 rounded-lg border border-success border-opacity-30">
                        <div className="flex items-start gap-3">
                          <span className="text-success text-lg mt-1">💡</span>
                          <p className="text-sm leading-relaxed">{tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-warning bg-opacity-10 rounded-lg border border-warning border-opacity-30">
                    <h4 className="font-semibold text-warning mb-2">🎯 Pro Advantage</h4>
                    <p className="text-sm text-stone">
                      As a Pro user, you receive real-time market insights and personalized supply chain 
                      recommendations to maximize your efficiency and sustainability.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-12">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="text-xl font-semibold mb-2">Supply Chain Data Unavailable</h3>
                  <p className="text-stone">Unable to load supply chain insights.</p>
                </div>
              )}
            </div>
          )}

          {/* Priority Support Tab */}
          {activeTab === 'support' && (
            <div className="fade-in">
              <h2 className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🚨</span>
                Priority Support
              </h2>
              
              {isLoading.support ? (
                <div className="text-center py-12">
                  <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
                  <p className="text-stone">Loading support information...</p>
                </div>
              ) : prioritySupport ? (
                <div className="grid grid-2 gap-8 max-w-6xl mx-auto">
                  <div className="card-elevated">
                    <h3 className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🚨</span>
                      Pro Priority Support
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-red-800">Response Time</span>
                          <span className="font-bold text-red-600">{prioritySupport.responseTime}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-blue-800">Primary Contact</span>
                          <span className="font-bold text-blue-600">{prioritySupport.contact}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Premium Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {prioritySupport.features.map((feature, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-elevated bg-red-50 border-red-200">
                    <h3 className="flex items-center gap-2 mb-4 text-red-800">
                      <span className="text-xl">🆘</span>
                      Emergency Hotline
                    </h3>
                    
                    <div className="text-center p-6 bg-white rounded-lg border-2 border-red-300">
                      <div className="text-3xl font-bold text-red-600 mb-2">+1-800-PRO-HELP</div>
                      <p className="text-sm text-red-700 mb-4">
                        24/7 dedicated support line for urgent agricultural issues
                      </p>
                      <div className="text-xs text-red-600">
                        Available exclusively for Pro Premium subscribers
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">📞 When to Use</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Crop emergency or disease outbreak</li>
                        <li>• Supply chain disruption</li>
                        <li>• Urgent climate-related decisions</li>
                        <li>• Technical system emergencies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-12">
                  <div className="text-4xl mb-4">🚨</div>
                  <h3 className="text-xl font-semibold mb-2">Support Information Unavailable</h3>
                  <p className="text-stone">Unable to load priority support details.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Feature Lock for Non-Pro Users */}
      {user.subscriptionTier !== 'pro' && ['climate', 'supply', 'support'].includes(activeTab) && (
        <div className="fade-in">
          <div className="card-elevated text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold mb-4">Pro Premium Feature</h3>
            <p className="text-lg text-stone mb-6">
              This advanced feature is exclusively available for Pro Premium subscribers. 
              Upgrade to unlock climate forecasting, supply chain optimization, and priority support.
            </p>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🚀 What You'll Get with Pro:</h4>
              <ul className="text-sm space-y-1 text-left">
                <li>• Advanced climate forecasting and risk assessment</li>
                <li>• Supply chain optimization and market insights</li>
                <li>• 24/7 priority support with dedicated hotline</li>
                <li>• All Premium features included</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumDashboard;