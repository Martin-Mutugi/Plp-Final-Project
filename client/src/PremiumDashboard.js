import React, { useState, useEffect } from 'react';
import './App.css';

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
    { id: 'analytics', label: 'Advanced Analytics', icon: '📊', color: 'info', available: true },
    { id: 'achievements', label: 'Gamification', icon: '🏆', color: 'warning', available: true },
    { id: 'regional', label: 'Regional Insights', icon: '🌍', color: 'success', available: true },
  ];

  const proTabs = [
    { id: 'climate', label: 'Climate Forecast', icon: '🌤️', color: 'accent', available: user.subscriptionTier === 'pro' },
    { id: 'supply', label: 'Supply Chain', icon: '🔗', color: 'purple', available: user.subscriptionTier === 'pro' },
    { id: 'support', label: 'Priority Support', icon: '🚨', color: 'error', available: user.subscriptionTier === 'pro' },
  ];

  const allTabs = [...premiumTabs, ...proTabs];

  return (
    <div className="container py-8">
      {/* Premium Header */}
      <div className="text-center mb-8 fade-in">
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl ${
            user.subscriptionTier === 'pro' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-emerald to-teal'
          }`}>
            <span className="text-4xl text-white">
              {user.subscriptionTier === 'pro' ? '🚀' : '⭐'}
            </span>
          </div>
        </div>
        <h1 className="mb-4">Exclusive {user.subscriptionTier === 'pro' ? 'Pro Premium' : 'Premium'} Features</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
          Welcome to your exclusive dashboard! Access advanced tools and insights 
          designed to maximize your sustainable agriculture impact and drive real change.
        </p>
        {user.subscriptionTier === 'pro' && (
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <span className="sdg-badge sdg-badge-premium">
              🚀 All Pro Features Unlocked
            </span>
            <span className="sdg-badge bg-gradient-to-r from-red-500 to-pink-600 text-white">
              🚨 Priority Support Active
            </span>
          </div>
        )}
      </div>

      {/* Premium Navigation Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {allTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={!tab.available}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? `bg-gradient-to-r from-${tab.color} to-${tab.color}-dark text-white shadow-lg scale-105`
                : tab.available
                ? 'bg-snow text-charcoal hover:bg-cloud hover:scale-102 border border-cloud'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
            {!tab.available && (
              <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-lg font-medium">Pro</span>
            )}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-info to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal">Advanced Analytics Dashboard</h2>
              <p className="text-sm text-stone">Comprehensive insights into your sustainability impact</p>
            </div>
          </div>
          
          {isLoading.analytics ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                  <div className="loading" style={{ width: '32px', height: '32px' }}></div>
                </div>
              </div>
              <p className="text-lg text-stone">Loading your premium analytics...</p>
            </div>
          ) : analytics ? (
            <div className="grid grid-3 gap-8">
              {/* Sustainability Score */}
              <div className="card-elevated text-center">
                <h4 className="font-semibold text-charcoal mb-6">Sustainability Score</h4>
                <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-full border-8 border-emerald border-opacity-20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald">{analytics.sustainabilityScore}</div>
                      <div className="text-sm text-stone">/100</div>
                    </div>
                  </div>
                  <div 
                    className="absolute top-0 left-0 w-40 h-40 rounded-full border-8 border-emerald border-t-transparent border-r-transparent transform -rotate-45"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                      background: `conic-gradient(var(--primary-emerald) ${analytics.sustainabilityScore * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                </div>
                <p className="text-sm text-stone">Your environmental impact rating across all activities</p>
              </div>

              {/* Usage Statistics */}
              <div className="card-elevated col-span-2">
                <h4 className="font-semibold text-charcoal mb-6">Usage Statistics</h4>
                <div className="grid grid-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-snow rounded-xl border border-cloud">
                    <div className="text-3xl font-bold text-forest mb-2">{analytics.usageStats.totalChats}</div>
                    <div className="text-sm text-stone">Total Chats</div>
                  </div>
                  <div className="text-center p-6 bg-snow rounded-xl border border-cloud">
                    <div className="text-2xl font-bold text-teal capitalize mb-2">{analytics.usageStats.engagementLevel}</div>
                    <div className="text-sm text-stone">Engagement Level</div>
                  </div>
                  <div className="text-center p-6 bg-snow rounded-xl border border-cloud">
                    <div className="text-3xl font-bold text-emerald mb-2">
                      {analytics.usageStats.mostUsedFeatures.length}
                    </div>
                    <div className="text-sm text-stone">Active Features</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-charcoal mb-4">Top Features Used:</h5>
                  <div className="flex flex-wrap gap-3">
                    {analytics.usageStats.mostUsedFeatures.map(([feature, count], index) => (
                      <span key={index} className="bg-emerald-light text-emerald px-4 py-2 rounded-full text-sm font-medium">
                        {feature} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card-elevated col-span-3">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-success to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-lg text-white">💡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-charcoal">Personalized Recommendations</h4>
                </div>
                <div className="grid grid-2 gap-6">
                  {analytics.recommendations.map((rec, index) => (
                    <div key={index} className="p-6 bg-success-light rounded-xl border border-success border-opacity-30">
                      <div className="flex items-start gap-4">
                        <span className="text-success text-xl mt-1">✓</span>
                        <p className="text-sm leading-relaxed text-charcoal">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-elevated text-center py-16">
              <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Analytics Unavailable</h3>
              <p className="text-stone mb-6">Unable to load your analytics data at this time.</p>
              <button onClick={loadAnalytics} className="btn btn-primary">
                Retry Loading Analytics
              </button>
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">🏆</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal">Gamification & Achievements</h2>
              <p className="text-sm text-stone">Track your progress and earn rewards for sustainable actions</p>
            </div>
          </div>
          
          {isLoading.achievements ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                  <div className="loading" style={{ width: '32px', height: '32px' }}></div>
                </div>
              </div>
              <p className="text-lg text-stone">Loading your achievements...</p>
            </div>
          ) : achievements ? (
            <div className="grid grid-2 gap-8">
              {/* Progress Overview */}
              <div className="card-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
                    <span className="text-lg text-white">📈</span>
                  </div>
                  <h4 className="text-lg font-semibold text-charcoal">Your Progress Overview</h4>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 bg-snow rounded-xl border border-cloud">
                    <span className="font-medium text-charcoal">Total Points</span>
                    <span className="text-3xl font-bold text-warning">{achievements.totalPoints}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-6 bg-snow rounded-xl border border-cloud">
                    <span className="font-medium text-charcoal">Sustainability Score</span>
                    <span className="text-2xl font-bold text-success">{achievements.sustainabilityScore}/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-6 bg-snow rounded-xl border border-cloud">
                    <span className="font-medium text-charcoal">Achievements Earned</span>
                    <span className="text-2xl font-bold text-info">{achievements.achievements.length}</span>
                  </div>
                </div>

                {/* Test Buttons */}
                <div className="mt-8 p-6 bg-warning-light rounded-xl border border-warning border-opacity-30">
                  <h5 className="font-semibold text-warning mb-4 flex items-center gap-2">
                    <span>🎮</span>
                    Test Achievement System
                  </h5>
                  <div className="flex gap-3 flex-wrap">
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
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-success to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-lg text-white">🎯</span>
                  </div>
                  <h4 className="text-lg font-semibold text-charcoal">Your Achievements</h4>
                </div>
                
                {achievements.achievements.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {achievements.achievements.map((ach, index) => (
                      <div key={index} className="p-6 bg-success-light rounded-xl border border-success border-opacity-30">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{ach.badge}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-charcoal text-lg">{ach.description}</div>
                            <div className="text-sm text-success mt-2 font-medium">+{ach.points} points</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <p className="text-stone mb-2">No achievements yet</p>
                    <p className="text-sm text-stone">Keep using the platform to earn badges and points!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-elevated text-center py-16">
              <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Achievements Unavailable</h3>
              <p className="text-stone">Unable to load your achievements data.</p>
            </div>
          )}
        </div>
      )}

      {/* Regional Insights Tab */}
      {activeTab === 'regional' && (
        <div className="fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">🌍</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal">Regional Crop Insights</h2>
              <p className="text-sm text-stone">Personalized recommendations based on your location</p>
            </div>
          </div>
          
          {isLoading.regional ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                  <div className="loading" style={{ width: '32px', height: '32px' }}></div>
                </div>
              </div>
              <p className="text-lg text-stone">Loading regional insights...</p>
            </div>
          ) : regionalCrops ? (
            <div className="grid grid-2 gap-8">
              <div className="card-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald to-teal rounded-xl flex items-center justify-center">
                    <span className="text-lg text-white">🌱</span>
                  </div>
                  <h4 className="text-lg font-semibold text-charcoal">Recommended for {regionalCrops.region}</h4>
                </div>
                <div className="space-y-4">
                  {regionalCrops.recommendedCrops.map((crop, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-snow rounded-xl border border-cloud">
                      <span className="text-success text-xl">✓</span>
                      <span className="font-medium text-charcoal">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-info to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-lg text-white">💡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-charcoal">Climate & Planting Insights</h4>
                </div>
                <div className="p-6 bg-info-light rounded-xl border border-info border-opacity-30 mb-6">
                  <p className="text-sm leading-relaxed text-charcoal">{regionalCrops.plantingTips}</p>
                </div>
                
                <div className="p-4 bg-warning-light rounded-xl border border-warning border-opacity-30">
                  <h5 className="font-semibold text-warning mb-3 flex items-center gap-2">
                    <span>🌦️</span>
                    Seasonal Considerations
                  </h5>
                  <p className="text-sm text-stone">
                    Based on current climate patterns and soil conditions in your region.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-elevated text-center py-16">
              <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Regional Data Unavailable</h3>
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
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🌤️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">Climate Forecasting</h2>
                  <p className="text-sm text-stone">Advanced weather predictions for optimal farming decisions</p>
                </div>
              </div>
              
              {isLoading.climate ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                      <div className="loading" style={{ width: '32px', height: '32px' }}></div>
                    </div>
                  </div>
                  <p className="text-lg text-stone">Loading climate forecast...</p>
                </div>
              ) : climateForecast ? (
                <div className="card-elevated max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-3xl text-white">🌤️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-2">Climate Forecast for {climateForecast.region}</h3>
                    <p className="text-stone">Personalized for your agricultural needs and crop selection</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <span>📅</span>
                      Forecast Details
                    </h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">{climateForecast.forecast}</p>
                    </div>
                    
                    <div className="mt-6 grid grid-2 gap-6">
                      <div className="text-center p-4 bg-white rounded-xl border border-blue-100">
                        <div className="font-semibold text-blue-800 mb-2">Target Crop</div>
                        <div className="text-xl font-bold text-charcoal">{climateForecast.crop}</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-blue-100">
                        <div className="font-semibold text-blue-800 mb-2">Risk Level</div>
                        <div className="text-xl font-bold text-success">Low</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-16">
                  <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🌤️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-4">Climate Data Unavailable</h3>
                  <p className="text-stone">Unable to load climate forecast at this time.</p>
                </div>
              )}
            </div>
          )}

          {/* Supply Chain Tab */}
          {activeTab === 'supply' && (
            <div className="fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🔗</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">Supply Chain Optimization</h2>
                  <p className="text-sm text-stone">Streamline your agricultural supply chain for maximum efficiency</p>
                </div>
              </div>
              
              {isLoading.supply ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                      <div className="loading" style={{ width: '32px', height: '32px' }}></div>
                    </div>
                  </div>
                  <p className="text-lg text-stone">Loading supply chain insights...</p>
                </div>
              ) : supplyChainTips ? (
                <div className="card-elevated max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl text-white">🔗</span>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-2">Tips for {supplyChainTips.userType}s</h3>
                    <p className="text-stone">Optimize your supply chain for better sustainability and profitability</p>
                  </div>
                  
                  <div className="grid grid-2 gap-6 mb-8">
                    {supplyChainTips.tips.map((tip, index) => (
                      <div key={index} className="p-6 bg-success-light rounded-xl border border-success border-opacity-30">
                        <div className="flex items-start gap-4">
                          <span className="text-success text-xl mt-1">💡</span>
                          <p className="text-sm leading-relaxed text-charcoal">{tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-warning-light rounded-xl border border-warning border-opacity-30">
                    <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                      <span>🎯</span>
                      Pro Advantage
                    </h4>
                    <p className="text-sm text-stone leading-relaxed">
                      As a Pro user, you receive real-time market insights and personalized supply chain 
                      recommendations to maximize your efficiency and sustainability impact.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-16">
                  <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-4">Supply Chain Data Unavailable</h3>
                  <p className="text-stone">Unable to load supply chain insights.</p>
                </div>
              )}
            </div>
          )}

          {/* Priority Support Tab */}
          {activeTab === 'support' && (
            <div className="fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🚨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">Priority Support</h2>
                  <p className="text-sm text-stone">24/7 dedicated assistance for your agricultural needs</p>
                </div>
              </div>
              
              {isLoading.support ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                      <div className="loading" style={{ width: '32px', height: '32px' }}></div>
                    </div>
                  </div>
                  <p className="text-lg text-stone">Loading support information...</p>
                </div>
              ) : prioritySupport ? (
                <div className="grid grid-2 gap-8 max-w-6xl mx-auto">
                  <div className="card-elevated">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <span className="text-lg text-white">🚨</span>
                      </div>
                      <h3 className="text-lg font-semibold text-charcoal">Pro Priority Support</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-red-800">Response Time</span>
                          <span className="text-xl font-bold text-red-600">{prioritySupport.responseTime}</span>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-blue-800">Primary Contact</span>
                          <span className="text-xl font-bold text-blue-600">{prioritySupport.contact}</span>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-4">Premium Features</h4>
                        <div className="flex flex-wrap gap-3">
                          {prioritySupport.features.map((feature, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-elevated bg-red-50 border-red-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                        <span className="text-lg text-white">🆘</span>
                      </div>
                      <h3 className="text-lg font-semibold text-red-800">Emergency Hotline</h3>
                    </div>
                    
                    <div className="text-center p-8 bg-white rounded-xl border-2 border-red-300 mb-6">
                      <div className="text-4xl font-bold text-red-600 mb-4">+1-800-PRO-HELP</div>
                      <p className="text-lg text-red-700 mb-4 leading-relaxed">
                        24/7 dedicated support line for urgent agricultural issues
                      </p>
                      <div className="text-sm text-red-600 font-medium">
                        Available exclusively for Pro Premium subscribers
                      </div>
                    </div>
                    
                    <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                        <span>📞</span>
                        When to Use
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-3">
                        <li className="flex items-center gap-2">• Crop emergency or disease outbreak</li>
                        <li className="flex items-center gap-2">• Supply chain disruption</li>
                        <li className="flex items-center gap-2">• Urgent climate-related decisions</li>
                        <li className="flex items-center gap-2">• Technical system emergencies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-16">
                  <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-4">Support Information Unavailable</h3>
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
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl text-white">🔒</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-4">Pro Premium Feature</h3>
            <p className="text-lg text-stone mb-8 leading-relaxed">
              This advanced feature is exclusively available for Pro Premium subscribers. 
              Upgrade to unlock climate forecasting, supply chain optimization, and priority support.
            </p>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
              <h4 className="font-semibold text-lg mb-4">🚀 What You'll Get with Pro:</h4>
              <ul className="text-sm space-y-3 text-left">
                <li className="flex items-center gap-2">• Advanced climate forecasting and risk assessment</li>
                <li className="flex items-center gap-2">• Supply chain optimization and market insights</li>
                <li className="flex items-center gap-2">• 24/7 priority support with dedicated hotline</li>
                <li className="flex items-center gap-2">• All Premium features included</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumDashboard;