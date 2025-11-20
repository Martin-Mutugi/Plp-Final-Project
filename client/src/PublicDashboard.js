import React, { useState, useEffect } from 'react';
import ImpactCharts from './ImpactCharts';
import './App.css';

function PublicDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Temporary mock data while CORS is being fixed
    const mockData = {
      sdgImpact: {
        mealsSupported: 12500,
        foodWasteReduced: 45,
        co2Reduced: 120,
        waterSaved: 1250,
        treesPlanted: 850,
        circularProjects: 45
      },
      totalUsers: 1500,
      totalPrompts: 28900,
      platformStats: {
        farmersRegistered: 450,
        consumersRegistered: 1050,
        premiumSubscribers: 120,
        proSubscribers: 80,
        sustainableFarms: 124
      }
    };
    
    // Simulate API loading delay
    setTimeout(() => {
      setDashboardData(mockData);
      setIsLoading(false);
    }, 1000);
    
    // Keep the original fetch commented until CORS is fixed
    /*
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
    */
  }, []);

  if (showCharts) {
    return <ImpactCharts metrics={dashboardData} onBack={() => setShowCharts(false)} />;
  }

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="text-center fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-emerald rounded-2xl flex items-center justify-center">
              <div className="loading" style={{ width: '32px', height: '32px' }}></div>
            </div>
          </div>
          <h2 className="mb-4">Loading Impact Dashboard</h2>
          <p className="text-lg text-stone">Preparing your sustainability insights...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container py-16">
        <div className="text-center fade-in">
          <div className="w-20 h-20 bg-error-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="mb-4">Unable to Load Dashboard</h2>
          <p className="text-lg text-stone mb-8">Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            🔄 Retry Loading Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🌍</span>
          </div>
        </div>
        <h1 className="hero-title mb-4">Sustainable Agriculture Impact Dashboard</h1>
        <p className="hero-subtitle mb-8">
          Real-time tracking of our collective impact on UN Sustainable Development Goals
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {['SDG 2: Zero Hunger', 'SDG 12: Responsible Consumption', 'SDG 13: Climate Action'].map((badge, index) => (
            <span key={index} className="sdg-badge">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid grid-3 gap-8 mb-12 stagger">
        {[
          {
            icon: '🍽️',
            title: 'Meals Supported',
            value: dashboardData.sdgImpact.mealsSupported.toLocaleString(),
            description: 'Families nourished through sustainable practices',
            type: 'success'
          },
          {
            icon: '🗑️',
            title: 'Food Waste Reduced',
            value: `${dashboardData.sdgImpact.foodWasteReduced} tons`,
            description: `Equivalent to ${Math.round(dashboardData.sdgImpact.foodWasteReduced * 2204).toLocaleString()} pounds saved`,
            type: 'info'
          },
          {
            icon: '🌍',
            title: 'CO₂ Emissions Reduced',
            value: `${dashboardData.sdgImpact.co2Reduced} tons`,
            description: 'Carbon footprint eliminated from atmosphere',
            type: 'warning'
          }
        ].map((metric, index) => (
          <div key={index} className={`card card-${metric.type} text-center card-interactive`}>
            <div className="text-5xl mb-4">{metric.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-charcoal">{metric.title}</h3>
            <div className="stat-number text-forest mb-2">{metric.value}</div>
            <p className="text-sm text-stone leading-relaxed">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 fade-in">
        <div className="card text-center p-6 bg-gradient-to-br from-emerald to-teal text-white">
          <div className="text-2xl mb-2">💧</div>
          <h4 className="font-semibold mb-1">Water Saved</h4>
          <div className="text-2xl font-bold">{dashboardData.sdgImpact.waterSaved}K L</div>
          <p className="text-xs opacity-90 mt-2">Through efficient irrigation</p>
        </div>
        
        <div className="card text-center p-6 bg-gradient-to-br from-sky to-ocean text-white">
          <div className="text-2xl mb-2">🌳</div>
          <h4 className="font-semibold mb-1">Trees Planted</h4>
          <div className="text-2xl font-bold">{dashboardData.sdgImpact.treesPlanted}</div>
          <p className="text-xs opacity-90 mt-2">Carbon sequestration initiatives</p>
        </div>
        
        <div className="card text-center p-6 bg-gradient-to-br from-amber to-coral text-white">
          <div className="text-2xl mb-2">🔄</div>
          <h4 className="font-semibold mb-1">Circular Projects</h4>
          <div className="text-2xl font-bold">{dashboardData.sdgImpact.circularProjects}</div>
          <p className="text-xs opacity-90 mt-2">Zero-waste initiatives</p>
        </div>
      </div>

      {/* Platform Insights */}
      <div className="grid grid-2 gap-8 mb-12 stagger">
        {/* Platform Statistics */}
        <div className="card-elevated">
          <h3 className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">👥</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-charcoal">Platform Statistics</div>
              <div className="text-sm text-stone">Community growth & engagement</div>
            </div>
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Total Users', value: dashboardData.totalUsers.toLocaleString(), color: 'forest' },
              { label: 'AI Prompts Processed', value: dashboardData.totalPrompts.toLocaleString(), color: 'teal' },
              { label: 'Farmers Registered', value: dashboardData.platformStats.farmersRegistered.toLocaleString(), color: 'emerald' },
              { label: 'Consumers Registered', value: dashboardData.platformStats.consumersRegistered.toLocaleString(), color: 'sky' },
              { label: 'Sustainable Farms', value: dashboardData.platformStats.sustainableFarms.toLocaleString(), color: 'earth' }
            ].map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-snow rounded-xl border border-cloud hover:bg-cloud transition-colors">
                <span className="font-medium text-charcoal">{stat.label}</span>
                <span className={`font-bold text-${stat.color} text-lg`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Analytics */}
        <div className="card-elevated">
          <h3 className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald to-teal rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">💰</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-charcoal">Community Engagement</div>
              <div className="text-sm text-stone">Subscription tier distribution</div>
            </div>
          </h3>
          <div className="space-y-4">
            {[
              {
                label: 'Premium Subscribers',
                value: dashboardData.platformStats.premiumSubscribers || 0,
                total: dashboardData.totalUsers,
                gradient: 'gradient-premium',
                color: 'purple',
                icon: '⭐'
              },
              {
                label: 'Pro Subscribers',
                value: dashboardData.platformStats.proSubscribers || 0,
                total: dashboardData.totalUsers,
                gradient: 'gradient-sky',
                color: 'sky',
                icon: '🚀'
              },
              {
                label: 'Free Users',
                value: dashboardData.totalUsers - ((dashboardData.platformStats.premiumSubscribers || 0) + (dashboardData.platformStats.proSubscribers || 0)),
                total: dashboardData.totalUsers,
                gradient: 'gradient-cloud',
                color: 'stone',
                icon: '🌱'
              }
            ].map((tier, index) => (
              <div key={index} className="p-4 bg-snow rounded-xl border border-cloud hover:bg-cloud transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span>{tier.icon}</span>
                    <span className="font-medium text-charcoal">{tier.label}</span>
                  </div>
                  <span className={`font-bold text-${tier.color} text-lg`}>{tier.value.toLocaleString()}</span>
                </div>
                <div className="impact-meter bg-cloud rounded-full h-2">
                  <div 
                    className="impact-progress h-2 rounded-full" 
                    style={{ 
                      width: `${(tier.value / tier.total) * 100}%`,
                      background: `var(--${tier.gradient})`
                    }}
                  ></div>
                </div>
                <div className="text-xs text-stone-light mt-2 text-right">
                  {((tier.value / tier.total) * 100).toFixed(1)}% of total users
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-12 fade-in">
        <div className="card-elevated inline-block max-w-2xl w-full p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-sun to-earth rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-4">Ready to Make an Impact?</h3>
          <p className="text-lg text-stone mb-8 leading-relaxed">
            Join our community of sustainable agriculture pioneers and start tracking your environmental impact today.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <button 
              onClick={() => setShowCharts(true)}
              className="btn btn-accent btn-lg"
            >
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span>Explore Detailed Analytics</span>
              </div>
            </button>
            
            <button 
              onClick={() => alert('Export feature will be available when backend CORS is fixed')}
              className="btn btn-secondary btn-lg"
            >
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>Export SDG Report</span>
              </div>
            </button>
          </div>

          <div className="p-4 bg-snow rounded-xl border border-cloud">
            <p className="text-sm text-stone text-center">
              <strong className="text-charcoal">Transparency Matters:</strong> All data is calculated based on verified user activities and follows UN SDG measurement standards.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Impact Statement */}
      <div className="text-center p-8 bg-gradient-emerald rounded-2xl text-white fade-in">
        <div className="flex justify-center mb-4">
          <span className="text-4xl">🌍</span>
        </div>
        <h4 className="text-2xl font-bold mb-4">Driving Real Change Through Technology</h4>
        <p className="text-lg opacity-90 leading-relaxed max-w-3xl mx-auto">
          Every interaction on our platform contributes directly to the United Nations Sustainable Development Goals. 
          Together, we're building a more sustainable and equitable food system for future generations.
        </p>
        <div className="mt-4 text-sm opacity-80">
          <em>Using mock data temporarily - Real-time data will resume when CORS is resolved</em>
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;