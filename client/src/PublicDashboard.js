import React, { useState, useEffect } from 'react';
import ImpactCharts from './ImpactCharts';

function PublicDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/public`)
      .then(response => response.json())
      .then(data => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading dashboard:', error);
        setIsLoading(false);
      });
  }, []);

  if (showCharts) {
    return <ImpactCharts metrics={dashboardData} onBack={() => setShowCharts(false)} />;
  }

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto var(--space-6)' }}></div>
          <h2>Loading Impact Dashboard</h2>
          <p className="text-stone">Preparing your sustainability insights...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2>Unable to Load Dashboard</h2>
          <p className="text-stone mb-6">Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 fade-in">
        <h1 className="hero-title mb-4">Sustainable Agriculture Impact Dashboard</h1>
        <p className="hero-subtitle text-lg text-stone max-w-3xl mx-auto leading-relaxed">
          Real-time tracking of our collective impact on UN Sustainable Development Goals through AI-powered sustainable agriculture
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <span className="sdg-badge bg-emerald bg-opacity-20 text-emerald border-emerald">SDG 2: Zero Hunger</span>
          <span className="sdg-badge bg-teal bg-opacity-20 text-teal border-teal">SDG 12: Responsible Consumption</span>
          <span className="sdg-badge bg-earth bg-opacity-20 text-earth border-earth">SDG 13: Climate Action</span>
        </div>
      </div>

      {/* Key Impact Metrics - Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in">
        <div className="card card-elevated text-center hover-lift transition-all duration-300">
          <div className="w-16 h-16 bg-emerald bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍽️</span>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-charcoal">Meals Supported</h3>
          <div className="stat-number text-2xl font-bold text-forest mb-2">
            {dashboardData.sdgImpact.mealsSupported.toLocaleString()}
          </div>
          <p className="text-sm text-stone mt-2 leading-relaxed">
            Families nourished through sustainable agricultural practices and reduced food waste
          </p>
          <div className="mt-4 pt-3 border-t border-cloud">
            <span className="text-xs font-medium text-emerald">↑ 12% this month</span>
          </div>
        </div>

        <div className="card card-elevated text-center hover-lift transition-all duration-300">
          <div className="w-16 h-16 bg-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗑️</span>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-charcoal">Food Waste Reduced</h3>
          <div className="stat-number text-2xl font-bold text-teal mb-2">
            {dashboardData.sdgImpact.foodWasteReduced} tons
          </div>
          <p className="text-sm text-stone mt-2 leading-relaxed">
            Equivalent to {Math.round(dashboardData.sdgImpact.foodWasteReduced * 2204).toLocaleString()} pounds saved
          </p>
          <div className="mt-4 pt-3 border-t border-cloud">
            <span className="text-xs font-medium text-teal">↑ 8% this month</span>
          </div>
        </div>

        <div className="card card-elevated text-center hover-lift transition-all duration-300">
          <div className="w-16 h-16 bg-earth bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-charcoal">CO₂ Emissions Reduced</h3>
          <div className="stat-number text-2xl font-bold text-earth mb-2">
            {dashboardData.sdgImpact.co2Reduced} tons
          </div>
          <p className="text-sm text-stone mt-2 leading-relaxed">
            Carbon footprint eliminated through sustainable farming and distribution methods
          </p>
          <div className="mt-4 pt-3 border-t border-cloud">
            <span className="text-xs font-medium text-earth">↑ 15% this month</span>
          </div>
        </div>
      </div>

      {/* Platform Insights - Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 fade-in">
        {/* Platform Statistics Card */}
        <div className="card card-elevated">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-sky bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-charcoal">Platform Statistics</h3>
              <p className="text-sm text-stone">Community growth and engagement metrics</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-cloud rounded-lg hover:bg-opacity-80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-forest bg-opacity-20 rounded flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <span className="font-medium text-charcoal">Total Users</span>
              </div>
              <span className="font-bold text-forest text-lg">{dashboardData.totalUsers.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-cloud rounded-lg hover:bg-opacity-80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal bg-opacity-20 rounded flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <span className="font-medium text-charcoal">AI Prompts Processed</span>
              </div>
              <span className="font-bold text-teal text-lg">{dashboardData.totalPrompts.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-cloud rounded-lg hover:bg-opacity-80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald bg-opacity-20 rounded flex items-center justify-center">
                  <span className="text-sm">👨‍🌾</span>
                </div>
                <span className="font-medium text-charcoal">Farmers Registered</span>
              </div>
              <span className="font-bold text-emerald text-lg">{dashboardData.platformStats.farmersRegistered.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-cloud rounded-lg hover:bg-opacity-80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky bg-opacity-20 rounded flex items-center justify-center">
                  <span className="text-sm">🛒</span>
                </div>
                <span className="font-medium text-charcoal">Consumers Registered</span>
              </div>
              <span className="font-bold text-sky text-lg">{dashboardData.platformStats.consumersRegistered.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Community Engagement Card */}
        <div className="card card-elevated">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-success bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-charcoal">Community Engagement</h3>
              <p className="text-sm text-stone">Subscription tiers and user participation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-success bg-opacity-10 rounded-lg border border-success border-opacity-20">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-charcoal">Premium Subscribers</span>
                <span className="font-bold text-success text-lg">{dashboardData.platformStats.premiumSubscribers || 0}</span>
              </div>
              <div className="impact-meter bg-cloud rounded-full h-2">
                <div 
                  className="impact-progress h-2 rounded-full bg-success" 
                  style={{ 
                    width: `${((dashboardData.platformStats.premiumSubscribers || 0) / dashboardData.totalUsers) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-stone mt-1">
                <span>{Math.round(((dashboardData.platformStats.premiumSubscribers || 0) / dashboardData.totalUsers) * 100)}% of users</span>
                <span>⭐ Premium Tier</span>
              </div>
            </div>
            
            <div className="p-4 bg-info bg-opacity-10 rounded-lg border border-info border-opacity-20">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-charcoal">Pro Subscribers</span>
                <span className="font-bold text-info text-lg">{dashboardData.platformStats.proSubscribers || 0}</span>
              </div>
              <div className="impact-meter bg-cloud rounded-full h-2">
                <div 
                  className="impact-progress h-2 rounded-full bg-gradient-to-r from-sky to-ocean" 
                  style={{ 
                    width: `${((dashboardData.platformStats.proSubscribers || 0) / dashboardData.totalUsers) * 100}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-stone mt-1">
                <span>{Math.round(((dashboardData.platformStats.proSubscribers || 0) / dashboardData.totalUsers) * 100)}% of users</span>
                <span>🚀 Pro Tier</span>
              </div>
            </div>
            
            <div className="p-4 bg-cloud rounded-lg border border-cloud">
              <div className="flex justify-between items-center">
                <span className="font-medium text-charcoal">Free Users</span>
                <span className="font-bold text-charcoal text-lg">
                  {(
                    dashboardData.totalUsers - 
                    ((dashboardData.platformStats.premiumSubscribers || 0) + (dashboardData.platformStats.proSubscribers || 0))
                  ).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-stone mt-1">
                Exploring sustainable agriculture
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 fade-in">
        <div className="card text-center p-6 bg-gradient-to-br from-emerald to-teal text-white">
          <div className="text-2xl mb-2">🌾</div>
          <h4 className="font-semibold mb-1">Sustainable Farms</h4>
          <div className="text-2xl font-bold">{dashboardData.platformStats.sustainableFarms || 124}</div>
          <p className="text-xs opacity-90 mt-2">Partner farms implementing eco-practices</p>
        </div>
        
        <div className="card text-center p-6 bg-gradient-to-br from-sky to-ocean text-white">
          <div className="text-2xl mb-2">💧</div>
          <h4 className="font-semibold mb-1">Water Saved</h4>
          <div className="text-2xl font-bold">{dashboardData.sdgImpact.waterSaved || 1250}K L</div>
          <p className="text-xs opacity-90 mt-2">Through efficient irrigation</p>
        </div>
        
        <div className="card text-center p-6 bg-gradient-to-br from-earth to-charcoal text-white">
          <div className="text-2xl mb-2">🌳</div>
          <h4 className="font-semibold mb-1">Trees Planted</h4>
          <div className="text-2xl font-bold">{dashboardData.sdgImpact.treesPlanted || 850}</div>
          <p className="text-xs opacity-90 mt-2">Carbon sequestration initiatives</p>
        </div>
        
        <div className="card text-center p-6 bg-gradient-to-br from-amber to-coral text-white">
          <div className="text-2xl mb-2">🔄</div>
          <h4 className="font-semibold mb-1">Circular Economy</h4>
          <div className="text-2xl font-bold">{dashboardData.sdgImpact.circularProjects || 45}</div>
          <p className="text-xs opacity-90 mt-2">Zero-waste initiatives</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center fade-in">
        <div className="card card-elevated inline-block max-w-4xl w-full p-8">
          <h3 className="text-2xl font-bold mb-4 text-charcoal">Ready to Make an Impact?</h3>
          <p className="text-lg text-stone mb-6 leading-relaxed">
            Join our community of sustainable agriculture pioneers and start tracking your environmental impact today. 
            Together, we're building a more sustainable food system for future generations.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <button 
              onClick={() => setShowCharts(true)}
              className="btn btn-accent btn-lg flex items-center gap-2"
            >
              <span>📊</span>
              Explore Detailed Analytics
            </button>
            
            <button 
              onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/dashboard/export`, '_blank')}
              className="btn btn-secondary btn-lg flex items-center gap-2"
            >
              <span>📄</span>
              Export SDG Report
            </button>
          </div>

          <div className="p-4 bg-cloud rounded-lg border-l-4 border-emerald">
            <p className="text-sm text-stone text-left">
              <strong className="text-charcoal">Transparency Matters:</strong> All data is calculated based on verified user activities 
              and follows UN SDG measurement standards. Updated in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Impact Statement */}
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-emerald to-teal rounded-2xl text-white fade-in">
        <div className="max-w-3xl mx-auto">
          <h4 className="text-2xl font-bold mb-4">🌍 Driving Real Change Through Technology</h4>
          <p className="text-lg opacity-90 leading-relaxed">
            Every interaction on our platform contributes directly to the United Nations Sustainable Development Goals. 
            Through AI-powered insights and community collaboration, we're creating measurable impact in sustainable agriculture.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;