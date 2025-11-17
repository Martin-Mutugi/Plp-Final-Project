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
        <h1 className="hero-title">Sustainable Agriculture Impact Dashboard</h1>
        <p className="hero-subtitle">
          Real-time tracking of our collective impact on UN Sustainable Development Goals
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <span className="sdg-badge">SDG 2: Zero Hunger</span>
          <span className="sdg-badge">SDG 12: Responsible Consumption</span>
          <span className="sdg-badge">SDG 13: Climate Action</span>
        </div>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid grid-3 gap-6 mb-12 fade-in">
        <div className="card card-success text-center">
          <div className="text-4xl mb-3">🍽️</div>
          <h3 className="text-lg font-semibold mb-2">Meals Supported</h3>
          <div className="stat-number text-forest">
            {dashboardData.sdgImpact.mealsSupported.toLocaleString()}
          </div>
          <p className="text-sm text-stone mt-2">Families nourished through sustainable practices</p>
        </div>

        <div className="card card-info text-center">
          <div className="text-4xl mb-3">🗑️</div>
          <h3 className="text-lg font-semibold mb-2">Food Waste Reduced</h3>
          <div className="stat-number text-teal">
            {dashboardData.sdgImpact.foodWasteReduced} tons
          </div>
          <p className="text-sm text-stone mt-2">Equivalent to {Math.round(dashboardData.sdgImpact.foodWasteReduced * 2204)} pounds saved</p>
        </div>

        <div className="card card-warning text-center">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="text-lg font-semibold mb-2">CO₂ Emissions Reduced</h3>
          <div className="stat-number text-earth">
            {dashboardData.sdgImpact.co2Reduced} tons
          </div>
          <p className="text-sm text-stone mt-2">Carbon footprint eliminated from atmosphere</p>
        </div>
      </div>

      {/* Platform Insights */}
      <div className="grid grid-2 gap-8 mb-12 fade-in">
        <div className="card-elevated">
          <h3 className="flex items-center gap-2 mb-4">
            <span className="text-xl">👥</span>
            Platform Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-cloud rounded-lg">
              <span className="font-medium">Total Users</span>
              <span className="font-bold text-forest">{dashboardData.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-cloud rounded-lg">
              <span className="font-medium">AI Prompts Processed</span>
              <span className="font-bold text-teal">{dashboardData.totalPrompts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-cloud rounded-lg">
              <span className="font-medium">Farmers Registered</span>
              <span className="font-bold text-emerald">{dashboardData.platformStats.farmersRegistered}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-cloud rounded-lg">
              <span className="font-medium">Consumers Registered</span>
              <span className="font-bold text-sky">{dashboardData.platformStats.consumersRegistered}</span>
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <h3 className="flex items-center gap-2 mb-4">
            <span className="text-xl">💰</span>
            Community Engagement
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-success bg-opacity-10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Premium Subscribers</span>
                <span className="font-bold text-success">{dashboardData.platformStats.premiumSubscribers || 0}</span>
              </div>
              <div className="impact-meter">
                <div 
                  className="impact-progress" 
                  style={{ 
                    width: `${((dashboardData.platformStats.premiumSubscribers || 0) / dashboardData.totalUsers) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-info bg-opacity-10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Pro Subscribers</span>
                <span className="font-bold text-info">{dashboardData.platformStats.proSubscribers || 0}</span>
              </div>
              <div className="impact-meter">
                <div 
                  className="impact-progress" 
                  style={{ 
                    width: `${((dashboardData.platformStats.proSubscribers || 0) / dashboardData.totalUsers) * 100}%`,
                    background: 'linear-gradient(90deg, var(--accent-sky), var(--accent-ocean))'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-cloud rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Free Users</span>
                <span className="font-bold text-charcoal">
                  {dashboardData.totalUsers - ((dashboardData.platformStats.premiumSubscribers || 0) + (dashboardData.platformStats.proSubscribers || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center fade-in">
        <div className="card-elevated inline-block max-w-2xl">
          <h3 className="text-2xl mb-4">Ready to Make an Impact?</h3>
          <p className="text-lg text-stone mb-6">
            Join our community of sustainable agriculture pioneers and start tracking your environmental impact today.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => setShowCharts(true)}
              className="btn btn-accent"
            >
              📊 Explore Detailed Analytics
            </button>
            
            <button 
              onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/dashboard/export`, '_blank')}
              className="btn btn-secondary"
            >
              📄 Export SDG Report
            </button>
          </div>

          <div className="mt-6 p-4 bg-cloud rounded-lg">
            <p className="text-sm text-stone">
              <strong>Transparency Matters:</strong> All data is calculated based on verified user activities and follows UN SDG measurement standards.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Impact Statement */}
      <div className="text-center mt-12 p-6 bg-gradient-to-r from-emerald to-teal rounded-2xl text-white">
        <h4 className="text-xl mb-3">🌍 Driving Real Change Through Technology</h4>
        <p className="opacity-90">
          Every interaction on our platform contributes directly to the United Nations Sustainable Development Goals. 
          Together, we're building a more sustainable and equitable food system for future generations.
        </p>
      </div>
    </div>
  );
}

export default PublicDashboard;