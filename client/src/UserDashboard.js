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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Your Dashboard, {user.email}!</h1>
      <p>Subscription Tier: <strong>{user.subscriptionTier}</strong></p>
      
      {/* Priority Support Indicator for Pro Users */}
      {user.subscriptionTier === 'pro' && (
        <div style={{ 
          border: '2px solid #dc3545', 
          padding: '15px', 
          marginTop: '15px',
          borderRadius: '8px',
          backgroundColor: '#fff8f8'
        }}>
          <p style={{ color: '#dc3545', fontWeight: 'bold', margin: 0 }}>
            🚨 Priority Support: Active - You have dedicated Pro support
          </p>
        </div>
      )}
      
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
        <h3>Your AI Chat Status</h3>
        <p>Prompts used: {user.promptsUsed || 0}/6</p>
        <p>Status: {user.subscriptionTier === 'free' ? 'Free Tier' : 'Premium Access'}</p>
        
        {/* Show upgrade button if free user reaches limit */}
        {user.subscriptionTier === 'free' && user.promptsUsed >= 6 && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
              You've reached your free limit! Upgrade to continue using the AI assistant.
            </p>
            <button 
              onClick={() => setShowUpgrade(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Upgrade to Premium
            </button>
          </div>
        )}

        {/* Show upgrade option even if not at limit */}
        {user.subscriptionTier === 'free' && user.promptsUsed < 6 && (
          <button 
            onClick={() => setShowUpgrade(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Upgrade Early
          </button>
        )}

        {/* Tools Section */}
        <div style={{ marginTop: '15px' }}>
          <h4>Additional Tools:</h4>
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setShowFarmerTools(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🌾 Farmer Tools
            </button>
            <button 
              onClick={() => setShowConsumerTools(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🛒 Consumer Tools
            </button>
          </div>

          {/* Premium Features Button */}
          {(user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro') && (
            <button 
              onClick={() => setShowPremiumDashboard(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🚀 Premium Features Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Only show chat interface if user hasn't reached limit or is premium */}
      {(user.subscriptionTier !== 'free' || user.promptsUsed < 6) && (
        <ChatInterface user={user} setUser={setUser} />
      )}
    </div>
  );
}

export default UserDashboard;