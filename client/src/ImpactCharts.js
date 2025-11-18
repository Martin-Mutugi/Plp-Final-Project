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
import './App.css';

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
        <div className="text-center fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
              <div className="loading" style={{ width: '32px', height: '32px' }}></div>
            </div>
          </div>
          <h2 className="mb-4">Loading Impact Data</h2>
          <p className="text-lg text-stone">Preparing your sustainability insights...</p>
        </div>
      </div>
    );
  }

  // Enhanced color palette using your design system
  const colors = {
    primary: {
      green: 'rgba(16, 185, 129, 0.8)',
      teal: 'rgba(13, 148, 136, 0.8)',
      blue: 'rgba(59, 130, 246, 0.8)',
      purple: 'rgba(139, 92, 246, 0.8)',
      amber: 'rgba(245, 158, 11, 0.8)',
      emerald: 'rgba(16, 185, 129, 0.8)',
      forest: 'rgba(6, 95, 70, 0.8)'
    },
    border: {
      green: 'rgb(16, 185, 129)',
      teal: 'rgb(13, 148, 136)',
      blue: 'rgb(59, 130, 246)',
      purple: 'rgb(139, 92, 246)',
      amber: 'rgb(245, 158, 11)',
      emerald: 'rgb(16, 185, 129)',
      forest: 'rgb(6, 95, 70)'
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
          colors.primary.emerald,
          colors.primary.amber,
          colors.primary.blue
        ],
        borderColor: [
          colors.border.emerald,
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
      <div className="flex items-center justify-between mb-8 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald to-teal rounded-xl flex items-center justify-center">
            <span className="text-xl text-white">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Advanced Impact Analytics</h1>
            <p className="text-lg text-stone mt-1">
              Detailed visualization of your sustainable agriculture impact
            </p>
          </div>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="btn btn-outline flex items-center gap-3"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-4 gap-6 mb-8 stagger">
        {[
          {
            icon: '🍽️',
            value: metrics.sdgImpact.mealsSupported.toLocaleString(),
            label: 'Meals Supported',
            color: 'emerald'
          },
          {
            icon: '🗑️',
            value: metrics.sdgImpact.foodWasteReduced,
            label: 'Tons Waste Reduced',
            color: 'warning'
          },
          {
            icon: '🌍',
            value: metrics.sdgImpact.co2Reduced,
            label: 'Tons CO₂ Reduced',
            color: 'info'
          },
          {
            icon: '👥',
            value: metrics.totalUsers,
            label: 'Active Users',
            color: 'purple'
          }
        ].map((metric, index) => (
          <div key={index} className="card text-center card-interactive">
            <div className={`text-3xl text-${metric.color} mb-3`}>{metric.icon}</div>
            <div className="text-2xl font-bold text-charcoal mb-1">{metric.value}</div>
            <div className="text-sm text-stone">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-2 gap-8 mb-8 stagger">
        {/* Environmental Impact Bar Chart */}
        <div className="card-elevated">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald to-teal rounded-xl flex items-center justify-center">
              <span className="text-lg text-white">🌱</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal">Environmental Impact Metrics</h3>
              <p className="text-sm text-stone">SDG Impact Measurement</p>
            </div>
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
          <div className="mt-4 p-4 bg-snow rounded-xl border border-cloud">
            <p className="text-sm text-stone text-center">
              Tracking progress towards UN Sustainable Development Goals 2, 12, and 13
            </p>
          </div>
        </div>

        {/* Subscription Distribution Doughnut */}
        <div className="card-elevated">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-lg text-white">💰</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal">User Subscription Distribution</h3>
              <p className="text-sm text-stone">Platform membership breakdown</p>
            </div>
          </div>
          <div className="h-80">
            <Doughnut 
              data={subscriptionDoughnutData} 
              options={doughnutOptions} 
            />
          </div>
          <div className="mt-6 grid grid-3 gap-4 text-center">
            <div className="p-3 bg-snow rounded-xl border border-cloud">
              <div className="text-sm font-semibold text-stone">Free</div>
              <div className="text-lg font-bold text-charcoal">
                {metrics.totalUsers - ((metrics.platformStats.premiumSubscribers || 0) + (metrics.platformStats.proSubscribers || 0))}
              </div>
            </div>
            <div className="p-3 bg-emerald-light rounded-xl border border-emerald border-opacity-30">
              <div className="text-sm font-semibold text-emerald">Premium</div>
              <div className="text-lg font-bold text-emerald">
                {metrics.platformStats.premiumSubscribers || 0}
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-sm font-semibold text-purple-600">Pro</div>
              <div className="text-lg font-bold text-purple-600">
                {metrics.platformStats.proSubscribers || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Growth Line Chart */}
      <div className="card-elevated mb-8 fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
            <span className="text-lg text-white">📈</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-charcoal">Platform Growth & Engagement</h3>
            <p className="text-sm text-stone">User Engagement Metrics</p>
          </div>
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
        <div className="mt-6 grid grid-4 gap-6 text-center">
          {[
            { label: 'Total Users', value: metrics.totalUsers },
            { label: 'AI Prompts', value: metrics.totalPrompts.toLocaleString() },
            { label: 'Farmers', value: metrics.platformStats.farmersRegistered },
            { label: 'Consumers', value: metrics.platformStats.consumersRegistered }
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-snow rounded-xl border border-cloud">
              <div className="text-sm font-semibold text-stone mb-2">{stat.label}</div>
              <div className="text-xl font-bold text-charcoal">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Impact Summary */}
      <div className="card bg-gradient-emerald text-white fade-in">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Comprehensive Impact Summary</h3>
              <p className="text-emerald-100 mt-1">Your collective contribution to sustainable development</p>
            </div>
          </div>
          
          <div className="grid grid-2 gap-8">
            <div>
              <h4 className="font-semibold mb-6 text-emerald-100 text-lg">Environmental Achievements</h4>
              <ul className="space-y-4">
                {[
                  {
                    icon: '🌱',
                    value: `${metrics.sdgImpact.mealsSupported.toLocaleString()} meals`,
                    description: 'supported through sustainable agriculture'
                  },
                  {
                    icon: '🗑️',
                    value: `${metrics.sdgImpact.foodWasteReduced} tons`,
                    description: 'of food waste prevented from landfills'
                  },
                  {
                    icon: '🌍',
                    value: `${metrics.sdgImpact.co2Reduced} tons CO₂`,
                    description: 'emissions reduced from atmosphere'
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-lg">{item.value}</div>
                      <div className="text-emerald-200 text-sm">{item.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-emerald-100 text-lg">Community Impact</h4>
              <ul className="space-y-4">
                {[
                  {
                    icon: '👥',
                    value: `${metrics.totalUsers} users`,
                    description: 'actively creating positive change'
                  },
                  {
                    icon: '💬',
                    value: `${metrics.totalPrompts.toLocaleString()} decisions`,
                    description: 'AI-assisted sustainable choices made'
                  },
                  {
                    icon: '🌾',
                    value: `${metrics.platformStats.farmersRegistered} farmers`,
                    description: 'adopting climate-smart practices'
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-lg">{item.value}</div>
                      <div className="text-emerald-200 text-sm">{item.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SDG Alignment */}
          <div className="mt-8 pt-8 border-t border-emerald-300 border-opacity-30">
            <h4 className="font-semibold mb-6 text-emerald-100 text-lg text-center">UN Sustainable Development Goals Alignment</h4>
            <div className="grid grid-3 gap-6">
              {[
                { number: 'SDG 2', title: 'Zero Hunger', description: 'End hunger and achieve food security' },
                { number: 'SDG 12', title: 'Responsible Consumption', description: 'Ensure sustainable consumption patterns' },
                { number: 'SDG 13', title: 'Climate Action', description: 'Combat climate change and its impacts' }
              ].map((sdg, index) => (
                <div key={index} className="text-center p-6 bg-white bg-opacity-10 rounded-xl border border-white border-opacity-20">
                  <div className="text-2xl font-bold mb-2">{sdg.number}</div>
                  <div className="font-semibold mb-3">{sdg.title}</div>
                  <div className="text-sm text-emerald-200 leading-relaxed">{sdg.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 text-center fade-in">
        <div className="flex gap-4 justify-center">
          <button className="btn btn-outline btn-lg">
            <div className="flex items-center gap-2">
              <span>📄</span>
              <span>Export as PDF Report</span>
            </div>
          </button>
          <button className="btn btn-outline btn-lg">
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Download Raw Data (CSV)</span>
            </div>
          </button>
        </div>
        <p className="text-sm text-stone mt-4">
          Share your impact with stakeholders, investors, and community partners
        </p>
      </div>
    </div>
  );
}

export default ImpactCharts;