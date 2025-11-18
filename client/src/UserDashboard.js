import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import FarmerTools from './FarmerTools';
import ConsumerTools from './ConsumerTools';
import PremiumDashboard from './PremiumDashboard';
import './App.css';

function UserDashboard({ user, setUser }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showFarmerTools, setShowFarmerTools] = useState(false);
  const [showConsumerTools, setShowConsumerTools] = useState(false);
  const [showPremiumDashboard, setShowPremiumDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Show upgrade interface if user clicks upgrade
  if (showUpgrade) {
    return <SubscriptionUpgrade user={user} setUser={setUser} />;
  }

  // Show farmer tools if user clicks farmer tools
  if (showFarmerTools) {
    return <FarmerTools user={user} />;
  }

  // Show consumer tools if user clicks consumer tools
  if (showConsumerTools) {
    return <ConsumerTools user={user} />;
  }

  // Show premium dashboard if user clicks premium features
  if (showPremiumDashboard) {
    return <PremiumDashboard user={user} />;
  }

  const getTierColor = (tier) => {
    switch(tier) {
      case 'pro': return 'var(--gradient-sky)';
      case 'premium': return 'var(--gradient-emerald)';
      default: return 'var(--neutral-cloud)';
    }
  };

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'pro': return '🚀 Pro Plan';
      case 'premium': return '⭐ Premium Plan';
      default: return '🌱 Free Plan';
    }
  };

  return (
    <div className="container py-8">
      {/* Welcome Header */}
      <div className="text-center mb-8 fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">👋</span>
          </div>
        </div>
        <h1 className="mb-4">Welcome back, {user.email}!</h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span 
            className="sdg-badge"
            style={{ background: getTierColor(user.subscriptionTier) }}
          >
            {getTierBadge(user.subscriptionTier)}
          </span>
          {user.subscriptionTier === 'pro' && (
            <span className="sdg-badge sdg-badge-premium">
              🚨 Priority Support Active
            </span>
          )}
        </div>
      </div>

      {/* Priority Support Banner for Pro Users */}
      {user.subscriptionTier === 'pro' && (
        <div className="card card-info mb-8 fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-sky rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">🚨</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-charcoal mb-1">Priority Support Active</h4>
              <p className="text-sm text-stone">You have dedicated Pro support with 24/7 emergency assistance and faster response times</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-cloud pb-2">
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'tools', label: '🛠️ Tools', icon: '🛠️' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.id 
                ? 'bg-gradient-emerald text-white shadow-lg' 
                : 'text-charcoal hover:bg-cloud hover:scale-105'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="space-y-8">
        {/* AI Chat Status & Quick Actions */}
        <div className="card-elevated fade-in">
          <div className="grid grid-2 gap-8">
            {/* AI Assistant Status */}
            <div>
              <h3 className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🤖</span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-charcoal">AI Assistant Status</div>
                  <div className="text-sm text-stone">Your usage and access level</div>
                </div>
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-snow rounded-xl border border-cloud">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-charcoal">Prompts Used</span>
                    <span className="font-bold text-forest text-lg">{user.promptsUsed || 0}/6</span>
                  </div>
                  <div className="impact-meter">
                    <div 
                      className="impact-progress" 
                      style={{ 
                        width: `${Math.min(((user.promptsUsed || 0) / 6) * 100, 100)}%`,
                        background: 'var(--gradient-emerald)'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-4 bg-snow rounded-xl border border-cloud">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-charcoal">Access Level</span>
                    <span className={`font-bold text-lg ${
                      user.subscriptionTier === 'free' ? 'text-warning' : 'text-success'
                    }`}>
                      {user.subscriptionTier === 'free' ? 'Limited Access' : 'Full Access'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upgrade Options */}
              {user.subscriptionTier === 'free' && (
                <div className="mt-6 p-6 bg-gradient-to-r from-warning-light to-orange-50 rounded-xl border border-warning border-opacity-30">
                  {user.promptsUsed >= 6 ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-warning rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚫</span>
                      </div>
                      <h4 className="text-warning font-semibold mb-2">Free Limit Reached</h4>
                      <p className="text-sm text-stone mb-6">
                        You've used all your free prompts. Upgrade to continue using the AI assistant.
                      </p>
                      <button 
                        onClick={() => setShowUpgrade(true)}
                        className="btn btn-warning w-full btn-lg"
                      >
                        Upgrade to Continue
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-sun to-earth rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <p className="text-sm text-stone mb-6">
                        Upgrade now to unlock unlimited AI access and premium features
                      </p>
                      <button 
                        onClick={() => setShowUpgrade(true)}
                        className="btn btn-primary btn-lg"
                      >
                        Upgrade Early & Save
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald to-teal rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">⚡</span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-charcoal">Quick Actions</div>
                  <div className="text-sm text-stone">Access your tools and features</div>
                </div>
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    icon: '🌾',
                    title: 'Farmer Tools',
                    description: 'Crop planning, soil analysis, pest detection',
                    onClick: () => setShowFarmerTools(true),
                    variant: 'secondary'
                  },
                  {
                    icon: '🛒',
                    title: 'Consumer Tools',
                    description: 'Food waste tracking, carbon footprint analysis',
                    onClick: () => setShowConsumerTools(true),
                    variant: 'secondary'
                  },
                  ...(user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro' ? [{
                    icon: '🚀',
                    title: 'Premium Features',
                    description: 'Advanced analytics & exclusive tools',
                    onClick: () => setShowPremiumDashboard(true),
                    variant: 'accent'
                  }] : [])
                ].map((action, index) => (
                  <button 
                    key={index}
                    onClick={action.onClick}
                    className={`btn btn-${action.variant} w-full justify-start text-left p-4`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-snow rounded-xl flex items-center justify-center">
                        <span className="text-xl">{action.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-charcoal">{action.title}</div>
                        <div className="text-sm text-stone mt-1">{action.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-3 gap-6 stagger">
          {[
            {
              icon: '🌍',
              title: 'SDG Impact',
              description: 'Track your contribution to sustainable development goals',
              gradient: 'from-emerald to-teal'
            },
            {
              icon: '📈',
              title: 'AI Insights',
              description: 'Get personalized recommendations for sustainable practices',
              gradient: 'from-sky to-ocean'
            },
            {
              icon: '🤝',
              title: 'Community',
              description: `Join ${user.subscriptionTier === 'free' ? '1,500+' : '500+'} sustainable pioneers`,
              gradient: 'from-sun to-earth'
            }
          ].map((feature, index) => (
            <div key={index} className="card card-interactive text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl text-white">{feature.icon}</span>
                </div>
              </div>
              <h4 className="font-semibold text-charcoal mb-3">{feature.title}</h4>
              <p className="text-sm text-stone leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* AI Chat Interface */}
        {(user.subscriptionTier !== 'free' || (user.promptsUsed || 0) < 6) && (
          <div className="fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl text-white">💬</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-charcoal">AI Agriculture Assistant</h2>
                {user.subscriptionTier === 'free' && (
                  <p className="text-sm text-stone mt-1">
                    {6 - (user.promptsUsed || 0)} free prompts remaining
                  </p>
                )}
              </div>
            </div>
            <ChatInterface user={user} setUser={setUser} />
          </div>
        )}

        {/* Upgrade Reminder for Free Users */}
        {user.subscriptionTier === 'free' && (user.promptsUsed || 0) >= 4 && (
          <div className="card card-warning text-center fade-in">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-sun to-earth rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal mb-1">Limited Prompts Remaining</h4>
                <p className="text-sm text-stone">
                  You have {6 - (user.promptsUsed || 0)} free prompts left. Upgrade to unlock unlimited access.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowUpgrade(true)}
              className="btn btn-warning btn-lg"
            >
              Upgrade to Unlimited Access
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;