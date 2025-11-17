import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import FarmerTools from './FarmerTools';
import ConsumerTools from './ConsumerTools';
import PremiumDashboard from './PremiumDashboard';

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
      case 'pro': return 'linear-gradient(135deg, var(--accent-ocean) 0%, var(--accent-sky) 100%)';
      case 'premium': return 'linear-gradient(135deg, var(--primary-forest) 0%, var(--primary-emerald) 100%)';
      default: return 'var(--neutral-cloud)';
    }
  };

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'pro': return '🚀 Pro Premium';
      case 'premium': return '⭐ Premium';
      default: return '🌱 Free Tier';
    }
  };

  return (
    <div className="container py-8">
      {/* Welcome Header */}
      <div className="text-center mb-8 fade-in">
        <h1>Welcome back, {user.email}!</h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span 
            className="sdg-badge"
            style={{ 
              background: getTierColor(user.subscriptionTier),
              color: user.subscriptionTier === 'free' ? 'var(--neutral-charcoal)' : 'var(--neutral-white)'
            }}
          >
            {getTierBadge(user.subscriptionTier)}
          </span>
          {user.subscriptionTier === 'pro' && (
            <span className="sdg-badge" style={{ background: 'var(--error)', color: 'var(--neutral-white)' }}>
              🚨 Priority Support Active
            </span>
          )}
        </div>
      </div>

      {/* Priority Support Banner for Pro Users */}
      {user.subscriptionTier === 'pro' && (
        <div className="card card-error mb-6 fade-in">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚨</div>
            <div>
              <h4 className="font-semibold mb-1">Priority Support Active</h4>
              <p className="text-sm opacity-90">You have dedicated Pro support with 24/7 emergency assistance</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-cloud pb-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'bg-emerald text-white' 
              : 'text-charcoal hover:bg-cloud'
          }`}
        >
          📊 Overview
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tools' 
              ? 'bg-emerald text-white' 
              : 'text-charcoal hover:bg-cloud'
          }`}
        >
          🛠️ Tools
        </button>
      </div>

      {/* AI Chat Status Card */}
      <div className="card-elevated mb-8 fade-in">
        <div className="grid grid-2 gap-6">
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <span className="text-xl">🤖</span>
              AI Assistant Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cloud rounded-lg">
                <span className="font-medium">Prompts Used</span>
                <div className="text-right">
                  <span className="font-bold text-forest">{user.promptsUsed || 0}/6</span>
                  <div className="w-24 h-2 bg-cloud rounded-full mt-1">
                    <div 
                      className="h-full bg-emerald rounded-full transition-all"
                      style={{ width: `${Math.min(((user.promptsUsed || 0) / 6) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cloud rounded-lg">
                <span className="font-medium">Access Level</span>
                <span className={`font-bold ${
                  user.subscriptionTier === 'free' ? 'text-warning' : 'text-success'
                }`}>
                  {user.subscriptionTier === 'free' ? 'Limited Access' : 'Full Access'}
                </span>
              </div>
            </div>

            {/* Upgrade Options */}
            {user.subscriptionTier === 'free' && (
              <div className="mt-6 p-4 bg-warning bg-opacity-10 rounded-lg border border-warning border-opacity-30">
                {user.promptsUsed >= 6 ? (
                  <div className="text-center">
                    <div className="text-warning text-lg font-semibold mb-2">
                      🚫 Free Limit Reached
                    </div>
                    <p className="text-sm text-stone mb-4">
                      You've used all your free prompts. Upgrade to continue using the AI assistant.
                    </p>
                    <button 
                      onClick={() => setShowUpgrade(true)}
                      className="btn btn-warning w-full"
                    >
                      Upgrade to Continue
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-stone mb-3">
                      Upgrade now to unlock unlimited AI access and premium features
                    </p>
                    <button 
                      onClick={() => setShowUpgrade(true)}
                      className="btn btn-primary"
                    >
                      Upgrade Early & Save
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚡</span>
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowFarmerTools(true)}
                className="btn btn-secondary w-full justify-start text-left"
              >
                <span className="text-lg mr-3">🌾</span>
                <div>
                  <div className="font-semibold">Farmer Tools</div>
                  <div className="text-xs text-stone">Crop planning, soil analysis, pest detection</div>
                </div>
              </button>
              
              <button 
                onClick={() => setShowConsumerTools(true)}
                className="btn btn-secondary w-full justify-start text-left"
              >
                <span className="text-lg mr-3">🛒</span>
                <div>
                  <div className="font-semibold">Consumer Tools</div>
                  <div className="text-xs text-stone">Food waste tracking, carbon footprint</div>
                </div>
              </button>

              {(user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro') && (
                <button 
                  onClick={() => setShowPremiumDashboard(true)}
                  className="btn btn-accent w-full justify-start text-left"
                >
                  <span className="text-lg mr-3">🚀</span>
                  <div>
                    <div className="font-semibold">Premium Features</div>
                    <div className="text-xs text-stone">Advanced analytics & exclusive tools</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights based on Tier */}
      <div className="grid grid-3 gap-6 mb-8 fade-in">
        <div className="card text-center">
          <div className="text-3xl mb-3">🌍</div>
          <h4 className="font-semibold mb-2">SDG Impact</h4>
          <p className="text-sm text-stone">Track your contribution to sustainable development goals</p>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-3">📈</div>
          <h4 className="font-semibold mb-2">AI Insights</h4>
          <p className="text-sm text-stone">Get personalized recommendations for sustainable practices</p>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-3">🤝</div>
          <h4 className="font-semibold mb-2">Community</h4>
          <p className="text-sm text-stone">Join {user.subscriptionTier === 'free' ? '1,500+' : '500+'} sustainable pioneers</p>
        </div>
      </div>

      {/* AI Chat Interface */}
      {(user.subscriptionTier !== 'free' || (user.promptsUsed || 0) < 6) && (
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl">💬 AI Agriculture Assistant</h2>
            {user.subscriptionTier === 'free' && (
              <span className="sdg-badge bg-warning text-charcoal">
                {6 - (user.promptsUsed || 0)} prompts remaining
              </span>
            )}
          </div>
          <ChatInterface user={user} setUser={setUser} />
        </div>
      )}

      {/* Upgrade Reminder for Free Users */}
      {user.subscriptionTier === 'free' && (user.promptsUsed || 0) >= 4 && (
        <div className="card card-warning mt-8 text-center">
          <h4 className="flex items-center justify-center gap-2 mb-2">
            <span>⚡</span>
            Limited Prompts Remaining
          </h4>
          <p className="text-sm text-stone mb-3">
            You have {6 - (user.promptsUsed || 0)} free prompts left. Upgrade to unlock unlimited access.
          </p>
          <button 
            onClick={() => setShowUpgrade(true)}
            className="btn btn-warning"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;