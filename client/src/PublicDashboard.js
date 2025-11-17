import React, { useState, useEffect } from 'react';
import ImpactCharts from './ImpactCharts';

function PublicDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/public')
      .then(response => response.json())
      .then(data => setDashboardData(data));
  }, []);

  if (!dashboardData) return <div>Loading dashboard...</div>;

  // Show detailed charts if user clicks view charts
  if (showCharts) {
    return <ImpactCharts metrics={dashboardData} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌱 Sustainable Agriculture Impact Dashboard</h1>
      <p>See how our community is making a difference</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>🍽️ Meals Supported</h3>
          <p>{dashboardData.sdgImpact.mealsSupported.toLocaleString()}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>🗑️ Food Waste Reduced</h3>
          <p>{dashboardData.sdgImpact.foodWasteReduced} tons</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>🌍 CO₂ Reduced</h3>
          <p>{dashboardData.sdgImpact.co2Reduced} tons</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>👥 Platform Statistics</h3>
          <p><strong>Total Users:</strong> {dashboardData.totalUsers}</p>
          <p><strong>AI Prompts:</strong> {dashboardData.totalPrompts.toLocaleString()}</p>
          <p><strong>Farmers Registered:</strong> {dashboardData.platformStats.farmersRegistered}</p>
          <p><strong>Consumers Registered:</strong> {dashboardData.platformStats.consumersRegistered}</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>💰 Subscription Overview</h3>
          <p><strong>Premium Subscribers:</strong> {dashboardData.platformStats.premiumSubscribers || 0}</p>
          <p><strong>Pro Subscribers:</strong> {dashboardData.platformStats.proSubscribers || 0}</p>
          <p><strong>Free Users:</strong> {dashboardData.totalUsers - ((dashboardData.platformStats.premiumSubscribers || 0) + (dashboardData.platformStats.proSubscribers || 0))}</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          onClick={() => setShowCharts(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          📊 View Detailed Charts & Analytics
        </button>
        
        <button 
          onClick={() => window.open('/api/dashboard/export', '_blank')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📄 Export SDG Report (CSV)
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>This data supports UN Sustainable Development Goals: 
          <strong> SDG 2 (Zero Hunger)</strong>, 
          <strong> SDG 12 (Responsible Consumption)</strong>, and 
          <strong> SDG 13 (Climate Action)</strong>
        </p>
      </div>
    </div>
  );
}

export default PublicDashboard;