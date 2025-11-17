import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function ImpactCharts({ metrics }) {
  if (!metrics) return <div>Loading impact data...</div>;

  // Bar chart data for SDG impact
  const impactBarData = {
    labels: ['Meals Supported', 'Food Waste Reduced (tons)', 'CO₂ Reduced (tons)'],
    datasets: [
      {
        label: 'SDG Impact',
        data: [
          metrics.sdgImpact.mealsSupported,
          metrics.sdgImpact.foodWasteReduced,
          metrics.sdgImpact.co2Reduced
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(23, 162, 184, 0.8)'
        ],
        borderColor: [
          'rgb(40, 167, 69)',
          'rgb(255, 193, 7)',
          'rgb(23, 162, 184)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Line chart data for platform growth
  const growthLineData = {
    labels: ['Users', 'AI Prompts', 'Farmers', 'Consumers'],
    datasets: [
      {
        label: 'Platform Statistics',
        data: [
          metrics.totalUsers,
          metrics.totalPrompts,
          metrics.platformStats.farmersRegistered,
          metrics.platformStats.consumersRegistered
        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  // Doughnut chart for subscription tiers
  const subscriptionDoughnutData = {
    labels: ['Free Users', 'Premium', 'Pro Premium'],
    datasets: [
      {
        label: 'Subscription Distribution',
        data: [
          metrics.totalUsers - (metrics.platformStats.premiumSubscribers + metrics.platformStats.proSubscribers),
          metrics.platformStats.premiumSubscribers,
          metrics.platformStats.proSubscribers
        ],
        backgroundColor: [
          'rgba(108, 117, 125, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(0, 123, 255, 0.8)'
        ],
        borderColor: [
          'rgb(108, 117, 125)',
          'rgb(40, 167, 69)',
          'rgb(0, 123, 255)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sustainable Agriculture Impact'
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 SDG Impact Visualization</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h4>Environmental Impact</h4>
          <Bar data={impactBarData} options={chartOptions} />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h4>Subscription Distribution</h4>
          <Doughnut data={subscriptionDoughnutData} options={chartOptions} />
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h4>Platform Growth Metrics</h4>
        <Line data={growthLineData} options={chartOptions} />
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Impact Summary</h4>
        <p><strong>Total Environmental Impact:</strong></p>
        <ul>
          <li>🌱 <strong>{metrics.sdgImpact.mealsSupported.toLocaleString()}</strong> meals supported through sustainable practices</li>
          <li>🗑️ <strong>{metrics.sdgImpact.foodWasteReduced}</strong> tons of food waste prevented</li>
          <li>🌍 <strong>{metrics.sdgImpact.co2Reduced}</strong> tons of CO₂ emissions reduced</li>
          <li>👥 <strong>{metrics.totalUsers}</strong> users creating positive change</li>
          <li>💬 <strong>{metrics.totalPrompts.toLocaleString()}</strong> AI-assisted sustainable decisions</li>
        </ul>
      </div>
    </div>
  );
}

export default ImpactCharts;