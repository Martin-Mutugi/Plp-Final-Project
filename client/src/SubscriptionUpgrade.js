import React, { useState } from 'react';

function SubscriptionUpgrade({ user, setUser }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    premium: {
      name: 'Premium',
      price: '₦50',
      features: [
        'Unlimited AI prompts',
        'Personalized crop planning',
        'Soil health insights',
        'Consumption tracking'
      ]
    },
    pro: {
      name: 'Pro Premium', 
      price: '₦150',
      features: [
        'All Premium features',
        'Advanced climate forecasting',
        'Supply chain optimization',
        'Export market insights',
        'Priority support',
        'Exclusive sustainability reports'
      ]
    }
  };

  const handleUpgrade = async (plan) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          plan: plan
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        alert('Payment initialization failed: ' + data.error);
      }
    } catch (error) {
      alert('Upgrade error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Upgrade Your Subscription</h2>
      <p>Choose a plan that fits your sustainable agriculture needs</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        {Object.entries(plans).map(([planKey, plan]) => (
          <div 
            key={planKey}
            style={{ 
              border: '2px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              flex: 1,
              backgroundColor: selectedPlan === planKey ? '#f8f9fa' : 'white'
            }}
          >
            <h3>{plan.name}</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
              {plan.price}
              <span style={{ fontSize: '14px', color: '#666' }}>/month</span>
            </div>
            
            <ul style={{ paddingLeft: '20px', margin: '20px 0' }}>
              {plan.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(planKey)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {isProcessing ? 'Processing...' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionUpgrade;