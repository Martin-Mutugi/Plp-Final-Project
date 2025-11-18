import React, { useState, useEffect } from 'react';
import './App.css';

function FarmerTools({ user }) {
  const [farmData, setFarmData] = useState(null);
  const [activeTab, setActiveTab] = useState('crops');
  const [newCrop, setNewCrop] = useState({ cropName: '', plantingDate: '', area: '' });
  const [pestAnalysis, setPestAnalysis] = useState({ crop: '', symptoms: '', description: '' });
  const [irrigationData, setIrrigationData] = useState({ crop: '', soilType: 'loamy', weatherConditions: 'sunny', area: '' });
  const [aiResults, setAiResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFarmData();
  }, [user.id]);

  const fetchFarmData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setFarmData(data);
      }
    } catch (error) {
      console.error('Failed to fetch farm data:', error);
    }
  };

  const addCrop = async () => {
    if (!newCrop.cropName || !newCrop.plantingDate || !newCrop.area) {
      alert('Please fill in all crop details');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...farmData,
          currentCrops: [...(farmData?.currentCrops || []), {
            ...newCrop,
            plantingDate: new Date(newCrop.plantingDate),
            area: parseFloat(newCrop.area)
          }]
        })
      });
      
      if (response.ok) {
        setNewCrop({ cropName: '', plantingDate: '', area: '' });
        fetchFarmData();
      }
    } catch (error) {
      console.error('Failed to add crop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePest = async () => {
    if (!pestAnalysis.crop || !pestAnalysis.symptoms) {
      alert('Please provide crop name and symptoms');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer/${user.id}/pests/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pestAnalysis)
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiResults({ type: 'pest', data: data.analysis });
        setPestAnalysis({ crop: '', symptoms: '', description: '' });
        fetchFarmData();
      }
    } catch (error) {
      console.error('Failed to analyze pest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleIrrigation = async () => {
    if (!irrigationData.crop || !irrigationData.area) {
      alert('Please provide crop name and area');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer/${user.id}/irrigation/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(irrigationData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiResults({ type: 'irrigation', data: data.irrigationAdvice });
        setIrrigationData({ crop: '', soilType: 'loamy', weatherConditions: 'sunny', area: '' });
        fetchFarmData();
      }
    } catch (error) {
      console.error('Failed to schedule irrigation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'crops', label: 'My Crops', icon: '🌱', color: 'emerald' },
    { id: 'soil', label: 'Soil Health', icon: '🪴', color: 'earth' },
    { id: 'pests', label: 'Pest Reports', icon: '🐛', color: 'warning' },
    { id: 'pest-ai', label: 'AI Pest Analysis', icon: '🔍', color: 'accent' },
    { id: 'irrigation-ai', label: 'Smart Irrigation', icon: '💧', color: 'info' }
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald to-teal rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🌾</span>
          </div>
        </div>
        <h1 className="mb-4">Farmer Tools Suite</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
          AI-powered agricultural tools for sustainable farming practices and optimized crop management
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? `bg-gradient-to-r from-${tab.color} to-${tab.color}-dark text-white shadow-lg scale-105`
                : 'bg-snow text-charcoal hover:bg-cloud hover:scale-102 border border-cloud'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* My Crops Tab */}
      {activeTab === 'crops' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            {/* Add New Crop */}
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald to-teal rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">➕</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Add New Crop</h3>
                  <p className="text-sm text-stone">Track your crop planting and management</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Maize, Tomatoes, Wheat"
                      value={newCrop.cropName}
                      onChange={(e) => setNewCrop({...newCrop, cropName: e.target.value})}
                      className="form-input pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🌱</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Planting Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={newCrop.plantingDate}
                      onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                      className="form-input pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">📅</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Area (acres)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter area in acres"
                      value={newCrop.area}
                      onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                      className="form-input pl-10"
                      min="0"
                      step="0.1"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">📏</span>
                  </div>
                </div>
                
                <button 
                  onClick={addCrop}
                  className="btn btn-primary w-full btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loading"></div>
                      <span>Adding Crop...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🌾</span>
                      <span>Add Crop to Farm</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Current Crops */}
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Your Current Crops</h3>
                  <p className="text-sm text-stone">{farmData?.currentCrops?.length || 0} active crops</p>
                </div>
              </div>
              
              {farmData?.currentCrops?.length > 0 ? (
                <div className="space-y-4">
                  {farmData.currentCrops.map((crop, index) => (
                    <div key={index} className="p-4 bg-snow rounded-xl border border-cloud hover:border-emerald transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-charcoal text-lg">{crop.cropName}</h4>
                        <span className="bg-gradient-emerald text-white text-sm px-3 py-1 rounded-full font-semibold">
                          {crop.area} acres
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone">
                        <span>📅</span>
                        <span>Planted: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <p className="text-stone mb-2">No crops added yet</p>
                  <p className="text-sm text-stone">Add your first crop to get started with farm management</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Soil Health Tab */}
      {activeTab === 'soil' && (
        <div className="fade-in">
          <div className="card-elevated text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-earth to-brown-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🪴</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-4">Soil Health Tracker</h3>
            <p className="text-lg text-stone mb-8 leading-relaxed">
              Monitor your soil conditions and get AI-powered recommendations for improvement and sustainable soil management
            </p>
            
            <div className="card card-warning mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🚧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-warning mb-2">Feature Coming Soon</h4>
                  <p className="text-sm text-stone">
                    We're working on integrating soil testing data and advanced AI analysis 
                    to provide personalized soil health recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-2 gap-6">
              {[
                { icon: '📊', title: 'Soil Testing', description: 'Comprehensive soil nutrient analysis and pH monitoring' },
                { icon: '🌱', title: 'Amendment Plans', description: 'Custom fertilizer and organic matter recommendations' },
                { icon: '💧', title: 'Moisture Tracking', description: 'Smart irrigation based on soil moisture levels' },
                { icon: '📈', title: 'Health Analytics', description: 'Long-term soil health trends and improvements' }
              ].map((feature, index) => (
                <div key={index} className="text-left p-6 bg-snow rounded-xl border border-cloud">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h5 className="font-semibold text-charcoal mb-2">{feature.title}</h5>
                  <p className="text-sm text-stone leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pest Reports Tab */}
      {activeTab === 'pests' && (
        <div className="fade-in">
          <div className="card-elevated text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-warning to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🐛</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-4">Pest & Disease Management</h3>
            <p className="text-lg text-stone mb-8 leading-relaxed">
              Track and manage pest issues across your crops with intelligent monitoring and prevention strategies
            </p>
            
            <div className="card card-info mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-info rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-info mb-2">Pro Tip</h4>
                  <p className="text-sm text-stone">
                    Use our AI Pest Analysis for instant diagnosis and treatment recommendations 
                    based on your specific crop issues and local conditions.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('pest-ai')}
              className="btn btn-accent btn-lg"
            >
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span>Try AI Pest Analysis</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* AI Pest Analysis Tab */}
      {activeTab === 'pest-ai' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-sky to-accent-ocean rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🔍</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">AI Pest & Disease Analysis</h3>
                  <p className="text-sm text-stone">Instant diagnosis and treatment recommendations</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Which crop is affected?"
                      value={pestAnalysis.crop}
                      onChange={(e) => setPestAnalysis({...pestAnalysis, crop: e.target.value})}
                      className="form-input pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🌱</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Symptoms Observed</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., yellow leaves, black spots, wilting"
                      value={pestAnalysis.symptoms}
                      onChange={(e) => setPestAnalysis({...pestAnalysis, symptoms: e.target.value})}
                      className="form-input pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">⚠️</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <div className="relative">
                    <textarea
                      placeholder="When did you first notice the issue? Any weather changes? Pattern of spread?"
                      value={pestAnalysis.description}
                      onChange={(e) => setPestAnalysis({...pestAnalysis, description: e.target.value})}
                      className="form-textarea pl-10"
                      rows="4"
                    />
                    <span className="absolute left-3 top-4 transform text-stone-light">📝</span>
                  </div>
                </div>

                <button 
                  onClick={analyzePest}
                  className="btn btn-primary w-full btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loading"></div>
                      <span>Analyzing with AI...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🤖</span>
                      <span>Analyze Pest Issue</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div>
              {aiResults?.type === 'pest' && (
                <div className="card card-success sticky top-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
                      <span className="text-xl text-white">🎯</span>
                    </div>
                    <h4 className="text-lg font-semibold text-charcoal">AI Analysis Results</h4>
                  </div>
                  <div className="bg-success-light p-6 rounded-xl border border-success border-opacity-30">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-charcoal">
                      {aiResults.data}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Smart Irrigation Tab */}
      {activeTab === 'irrigation-ai' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-info to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">💧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Climate-Smart Irrigation</h3>
                  <p className="text-sm text-stone">AI-powered water optimization for your crops</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Which crop needs irrigation?"
                      value={irrigationData.crop}
                      onChange={(e) => setIrrigationData({...irrigationData, crop: e.target.value})}
                      className="form-input pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🌱</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Soil Type</label>
                  <select
                    value={irrigationData.soilType}
                    onChange={(e) => setIrrigationData({...irrigationData, soilType: e.target.value})}
                    className="form-select"
                  >
                    <option value="sandy">Sandy - Drains quickly</option>
                    <option value="loamy">Loamy - Well-balanced</option>
                    <option value="clay">Clay - Holds moisture</option>
                    <option value="silty">Silty - Retains water</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Weather Conditions</label>
                  <select
                    value={irrigationData.weatherConditions}
                    onChange={(e) => setIrrigationData({...irrigationData, weatherConditions: e.target.value})}
                    className="form-select"
                  >
                    <option value="sunny">☀️ Sunny & Clear</option>
                    <option value="cloudy">☁️ Cloudy & Overcast</option>
                    <option value="rainy">🌧️ Rainy & Wet</option>
                    <option value="hot-dry">🔥 Hot & Dry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Area to Irrigate (acres)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter area in acres"
                      value={irrigationData.area}
                      onChange={(e) => setIrrigationData({...irrigationData, area: e.target.value})}
                      className="form-input pl-10"
                      min="0"
                      step="0.1"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">📏</span>
                  </div>
                </div>

                <button 
                  onClick={scheduleIrrigation}
                  className="btn btn-accent w-full btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loading"></div>
                      <span>Calculating Schedule...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>💡</span>
                      <span>Get Irrigation Schedule</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div>
              {aiResults?.type === 'irrigation' && (
                <div className="card card-info sticky top-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-info rounded-xl flex items-center justify-center">
                      <span className="text-xl text-white">💡</span>
                    </div>
                    <h4 className="text-lg font-semibold text-charcoal">AI Irrigation Recommendations</h4>
                  </div>
                  <div className="bg-info-light p-6 rounded-xl border border-info border-opacity-30">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-charcoal">
                      {aiResults.data}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerTools;