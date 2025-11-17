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

function ImpactCharts({ metrics, onBack }) {
  if (!metrics) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
          <h2>Loading Impact Data</h2>
          <p className="text-stone">Preparing your sustainability insights...</p>
        </div>
      </div>
    );
  }

  // Enhanced color palette
  const colors = {
    primary: {
      green: 'rgba(16, 185, 129, 0.8)',
      teal: 'rgba(13, 148, 136, 0.8)',
      blue: 'rgba(59, 130, 246, 0.8)',
      purple: 'rgba(139, 92, 246, 0.8)',
      amber: 'rgba(245, 158, 11, 0.8)'
    },
    border: {
      green: 'rgb(16, 185, 129)',
      teal: 'rgb(13, 148, 136)',
      blue: 'rgb(59, 130, 246)',
      purple: 'rgb(139, 92, 246)',
      amber: 'rgb(245, 158, 11)'
    }
  };

  // Bar chart data for SDG impact
  const impactBarData = {
    labels: ['Meals Supported', 'Food Waste Reduced', 'CO₂ Emissions Reduced'],
    datasets: [
      {
        label: 'Environmental Impact',
        data: [
          metrics.sdgImpact.mealsSupported,
          metrics.sdgImpact.foodWasteReduced,
          metrics.sdgImpact.co2Reduced
        ],
        backgroundColor: [
          colors.primary.green,
          colors.primary.amber,
          colors.primary.blue
        ],
        borderColor: [
          colors.border.green,
          colors.border.amber,
          colors.border.blue
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Line chart data for platform growth
  const growthLineData = {
    labels: ['Total Users', 'AI Prompts', 'Farmers', 'Consumers'],
    datasets: [
      {
        label: 'Platform Engagement',
        data: [
          metrics.totalUsers,
          metrics.totalPrompts,
          metrics.platformStats.farmersRegistered,
          metrics.platformStats.consumersRegistered
        ],
        borderColor: colors.border.purple,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: colors.border.purple,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  // Doughnut chart for subscription tiers
  const subscriptionDoughnutData = {
    labels: ['Free Users', 'Premium', 'Pro Premium'],
    datasets: [
      {
        label: 'User Distribution',
        data: [
          metrics.totalUsers - ((metrics.platformStats.premiumSubscribers || 0) + (metrics.platformStats.proSubscribers || 0)),
          metrics.platformStats.premiumSubscribers || 0,
          metrics.platformStats.proSubscribers || 0
        ],
        backgroundColor: [
          'rgba(148, 163, 184, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(148, 163, 184)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2,
        spacing: 4,
        borderRadius: 8
      }
    ]
  };

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          }
        }
      },
      title: {
        display: true,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: '600'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 12
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 11
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(241, 245, 249, 0.8)'
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          }
        }
      }
    }
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '60%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Advanced Impact Analytics
          </h1>
          <p className="text-lg text-stone mt-2">
            Detailed visualization of your sustainable agriculture impact
          </p>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="btn btn-outline flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl text-emerald mb-2">🍽️</div>
          <div className="text-2xl font-bold text-charcoal">
            {metrics.sdgImpact.mealsSupported.toLocaleString()}
          </div>
          <div className="text-sm text-stone">Meals Supported</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl text-amber mb-2">🗑️</div>
          <div className="text-2xl font-bold text-charcoal">
            {metrics.sdgImpact.foodWasteReduced}
          </div>
          <div className="text-sm text-stone">Tons Waste Reduced</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl text-blue mb-2">🌍</div>
          <div className="text-2xl font-bold text-charcoal">
            {metrics.sdgImpact.co2Reduced}
          </div>
          <div className="text-sm text-stone">Tons CO₂ Reduced</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl text-purple mb-2">👥</div>
          <div className="text-2xl font-bold text-charcoal">
            {metrics.totalUsers}
          </div>
          <div className="text-sm text-stone">Active Users</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-2 gap-8 mb-8">
        {/* Environmental Impact Bar Chart */}
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌱</span>
            <h3 className="font-semibold">Environmental Impact Metrics</h3>
          </div>
          <div className="h-80">
            <Bar 
              data={impactBarData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'SDG Impact Measurement'
                  }
                }
              }} 
            />
          </div>
          <div className="mt-4 text-sm text-stone">
            Tracking progress towards UN Sustainable Development Goals 2, 12, and 13
          </div>
        </div>

        {/* Subscription Distribution Doughnut */}
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💰</span>
            <h3 className="font-semibold">User Subscription Distribution</h3>
          </div>
          <div className="h-80">
            <Doughnut 
              data={subscriptionDoughnutData} 
              options={doughnutOptions} 
            />
          </div>
          <div className="mt-4 grid grid-3 gap-2 text-center">
            <div>
              <div className="text-sm font-semibold text-gray-500">Free</div>
              <div className="text-lg font-bold">
                {metrics.totalUsers - ((metrics.platformStats.premiumSubscribers || 0) + (metrics.platformStats.proSubscribers || 0))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald">Premium</div>
              <div className="text-lg font-bold text-emerald">
                {metrics.platformStats.premiumSubscribers || 0}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-600">Pro</div>
              <div className="text-lg font-bold text-purple-600">
                {metrics.platformStats.proSubscribers || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Growth Line Chart */}
      <div className="card-elevated mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📈</span>
          <h3 className="font-semibold">Platform Growth & Engagement</h3>
        </div>
        <div className="h-80">
          <Line 
            data={growthLineData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'User Engagement Metrics'
                }
              }
            }} 
          />
        </div>
        <div className="mt-4 grid grid-4 gap-4 text-center">
          <div>
            <div className="text-sm font-semibold text-stone">Total Users</div>
            <div className="text-lg font-bold text-charcoal">{metrics.totalUsers}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-stone">AI Prompts</div>
            <div className="text-lg font-bold text-charcoal">{metrics.totalPrompts.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-stone">Farmers</div>
            <div className="text-lg font-bold text-charcoal">{metrics.platformStats.farmersRegistered}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-stone">Consumers</div>
            <div className="text-lg font-bold text-charcoal">{metrics.platformStats.consumersRegistered}</div>
          </div>
        </div>
      </div>

      {/* Detailed Impact Summary */}
      <div className="card-elevated bg-gradient-to-r from-emerald to-teal text-white">
        <h3 className="flex items-center gap-2 mb-6 text-xl">
          <span>🌍</span>
          Comprehensive Impact Summary
        </h3>
        
        <div className="grid grid-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4 text-emerald-100">Environmental Achievements</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-lg">🌱</span>
                <div>
                  <div className="font-semibold">{metrics.sdgImpact.mealsSupported.toLocaleString()} meals</div>
                  <div className="text-emerald-200 text-sm">supported through sustainable agriculture</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">🗑️</span>
                <div>
                  <div className="font-semibold">{metrics.sdgImpact.foodWasteReduced} tons</div>
                  <div className="text-emerald-200 text-sm">of food waste prevented from landfills</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">🌍</span>
                <div>
                  <div className="font-semibold">{metrics.sdgImpact.co2Reduced} tons CO₂</div>
                  <div className="text-emerald-200 text-sm">emissions reduced from atmosphere</div>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-emerald-100">Community Impact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-lg">👥</span>
                <div>
                  <div className="font-semibold">{metrics.totalUsers} users</div>
                  <div className="text-emerald-200 text-sm">actively creating positive change</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">💬</span>
                <div>
                  <div className="font-semibold">{metrics.totalPrompts.toLocaleString()} decisions</div>
                  <div className="text-emerald-200 text-sm">AI-assisted sustainable choices made</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">🌾</span>
                <div>
                  <div className="font-semibold">{metrics.platformStats.farmersRegistered} farmers</div>
                  <div className="text-emerald-200 text-sm">adopting climate-smart practices</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* SDG Alignment */}
        <div className="mt-6 pt-6 border-t border-emerald-300 border-opacity-30">
          <h4 className="font-semibold mb-3 text-emerald-100">UN SDG Alignment</h4>
          <div className="flex gap-4">
            <div className="flex-1 text-center p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="text-lg font-semibold">SDG 2</div>
              <div className="text-sm text-emerald-200">Zero Hunger</div>
            </div>
            <div className="flex-1 text-center p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="text-lg font-semibold">SDG 12</div>
              <div className="text-sm text-emerald-200">Responsible Consumption</div>
            </div>
            <div className="flex-1 text-center p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="text-lg font-semibold">SDG 13</div>
              <div className="text-sm text-emerald-200">Climate Action</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 text-center">
        <button className="btn btn-outline mr-4">
          📄 Export as PDF Report
        </button>
        <button className="btn btn-outline">
          📊 Download Raw Data (CSV)
        </button>
      </div>
    </div>
  );
}

export default ImpactCharts;