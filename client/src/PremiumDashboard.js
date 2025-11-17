import React, { useState, useEffect } from 'react';

function PremiumDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [climateForecast, setClimateForecast] = useState(null);
  const [supplyChainTips, setSupplyChainTips] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [regionalCrops, setRegionalCrops] = useState(null);
  const [prioritySupport, setPrioritySupport] = useState(null);

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

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/premium/analytics/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadClimateForecast = async () => {
    try {
      const response = await fetch(`/api/premium/climate-forecast/${user.id}?crop=maize`);
      if (response.ok) {
        const data = await response.json();
        setClimateForecast(data);
      }
    } catch (error) {
      console.error('Failed to load climate forecast:', error);
    }
  };

  const loadSupplyChainTips = async () => {
    try {
      const response = await fetch(`/api/premium/supply-chain/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSupplyChainTips(data);
      }
    } catch (error) {
      console.error('Failed to load supply chain tips:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const response = await fetch(`/api/premium/achievements/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const loadRegionalCrops = async () => {
    try {
      const response = await fetch(`/api/premium/regional-crops/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRegionalCrops(data);
      }
    } catch (error) {
      console.error('Failed to load regional crops:', error);
    }
  };

  const loadPrioritySupport = async () => {
    try {
      const response = await fetch(`/api/premium/priority-support/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPrioritySupport(data);
      }
    } catch (error) {
      console.error('Failed to load priority support:', error);
    }
  };

  const awardAchievement = async (type) => {
    try {
      const response = await fetch(`/api/premium/achievements/${user.id}/award`, {
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 Premium Features Dashboard</h1>
      <p>Welcome to your exclusive {user.subscriptionTier === 'pro' ? 'Pro' : 'Premium'} features!</p>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('analytics')}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: activeTab === 'analytics' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'analytics' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📊 Advanced Analytics
        </button>
        
        <button 
          onClick={() => setActiveTab('achievements')}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: activeTab === 'achievements' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'achievements' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🏆 Gamification
        </button>

        <button 
          onClick={() => setActiveTab('regional')}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: activeTab === 'regional' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'regional' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🌍 Regional Insights
        </button>

        {user.subscriptionTier === 'pro' && (
          <>
            <button 
              onClick={() => setActiveTab('climate')}
              style={{ 
                marginRight: '10px', 
                padding: '10px 20px',
                backgroundColor: activeTab === 'climate' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'climate' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🌤️ Climate Forecast
            </button>

            <button 
              onClick={() => setActiveTab('supply')}
              style={{ 
                marginRight: '10px', 
                padding: '10px 20px',
                backgroundColor: activeTab === 'supply' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'supply' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🔗 Supply Chain
            </button>

            <button 
              onClick={() => setActiveTab('support')}
              style={{ 
                padding: '10px 20px',
                backgroundColor: activeTab === 'support' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'support' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🚨 Priority Support
            </button>
          </>
        )}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h3>Advanced Analytics</h3>
          {analytics ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Sustainability Score</h4>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745', textAlign: 'center' }}>
                  {analytics.sustainabilityScore}/100
                </div>
                <p style={{ textAlign: 'center', color: '#666' }}>Your environmental impact rating</p>
              </div>

              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Usage Statistics</h4>
                <p><strong>Total Chats:</strong> {analytics.usageStats.totalChats}</p>
                <p><strong>Engagement Level:</strong> {analytics.usageStats.engagementLevel}</p>
                <p><strong>Top Features:</strong> {analytics.usageStats.mostUsedFeatures.map(([feature]) => feature).join(', ')}</p>
              </div>

              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', gridColumn: 'span 2' }}>
                <h4>Personalized Recommendations</h4>
                <ul>
                  {analytics.recommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div>
          <h3>Gamification & Achievements</h3>
          {achievements ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Your Progress</h4>
                <p><strong>Total Points:</strong> {achievements.totalPoints}</p>
                <p><strong>Sustainability Score:</strong> {achievements.sustainabilityScore}</p>
                <p><strong>Achievements Earned:</strong> {achievements.achievements.length}</p>
                
                <div style={{ marginTop: '15px' }}>
                  <button 
                    onClick={() => awardAchievement('first_chat')}
                    style={{ padding: '8px 15px', marginRight: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Test: First Chat
                  </button>
                  <button 
                    onClick={() => awardAchievement('sustainability_leader')}
                    style={{ padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Test: Sustainability
                  </button>
                </div>
              </div>

              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Your Achievements</h4>
                {achievements.achievements.length > 0 ? (
                  achievements.achievements.map((ach, index) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <strong>{ach.badge}</strong> - {ach.description}
                      <br />
                      <small>+{ach.points} points</small>
                    </div>
                  ))
                ) : (
                  <p>No achievements yet. Keep using the platform to earn badges!</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading achievements...</p>
          )}
        </div>
      )}

      {/* Regional Insights Tab */}
      {activeTab === 'regional' && (
        <div>
          <h3>Regional Crop Recommendations</h3>
          {regionalCrops ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Recommended for {regionalCrops.region}</h4>
                <ul>
                  {regionalCrops.recommendedCrops.map((crop, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{crop}</li>
                  ))}
                </ul>
              </div>

              <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Climate Insights</h4>
                <p>{regionalCrops.plantingTips}</p>
              </div>
            </div>
          ) : (
            <p>Loading regional insights...</p>
          )}
        </div>
      )}

      {/* Pro Features */}
      {user.subscriptionTier === 'pro' && (
        <>
          {/* Climate Forecast Tab */}
          {activeTab === 'climate' && (
            <div>
              <h3>Climate Forecasting</h3>
              {climateForecast ? (
                <div style={{ border: '1px solid #17a2b8', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fe' }}>
                  <h4>🌤️ Forecast for {climateForecast.region}</h4>
                  <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{climateForecast.forecast}</p>
                  <p><strong>Crop:</strong> {climateForecast.crop}</p>
                </div>
              ) : (
                <p>Loading climate forecast...</p>
              )}
            </div>
          )}

          {/* Supply Chain Tab */}
          {activeTab === 'supply' && (
            <div>
              <h3>Supply Chain Optimization</h3>
              {supplyChainTips ? (
                <div style={{ border: '1px solid #28a745', padding: '20px', borderRadius: '8px', backgroundColor: '#f8fff9' }}>
                  <h4>🔗 Tips for {supplyChainTips.userType}s</h4>
                  <ul>
                    {supplyChainTips.tips.map((tip, index) => (
                      <li key={index} style={{ marginBottom: '10px', lineHeight: '1.5' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Loading supply chain tips...</p>
              )}
            </div>
          )}

          {/* Priority Support Tab */}
          {activeTab === 'support' && (
            <div>
              <h3>Priority Support</h3>
              {prioritySupport ? (
                <div style={{ border: '1px solid #dc3545', padding: '20px', borderRadius: '8px', backgroundColor: '#fff8f8' }}>
                  <h4>🚨 Pro Priority Support</h4>
                  <p><strong>Response Time:</strong> {prioritySupport.responseTime}</p>
                  <p><strong>Contact:</strong> {prioritySupport.contact}</p>
                  <p><strong>Features:</strong> {prioritySupport.features.join(', ')}</p>
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '5px' }}>
                    <strong>Emergency Hotline:</strong> +1-800-PRO-HELP
                  </div>
                </div>
              ) : (
                <p>Loading support information...</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PremiumDashboard;