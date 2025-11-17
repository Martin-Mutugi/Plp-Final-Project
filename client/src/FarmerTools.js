import React, { useState, useEffect } from 'react';

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
    { id: 'crops', label: '🌱 My Crops', icon: '🌱' },
    { id: 'soil', label: '🪴 Soil Health', icon: '🪴' },
    { id: 'pests', label: '🐛 Pest Reports', icon: '🐛' },
    { id: 'pest-ai', label: '🔍 AI Pest Analysis', icon: '🔍' },
    { id: 'irrigation-ai', label: '💧 Smart Irrigation', icon: '💧' }
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <h1>🌾 Farmer Tools Suite</h1>
        <p className="text-lg text-stone">
          AI-powered agricultural tools for sustainable farming practices
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-emerald text-white shadow-md'
                : 'bg-cloud text-charcoal hover:bg-cloud-dark'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* My Crops Tab */}
      {activeTab === 'crops' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            {/* Add New Crop */}
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">➕</span>
                Add New Crop
              </h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Maize, Tomatoes, Wheat"
                    value={newCrop.cropName}
                    onChange={(e) => setNewCrop({...newCrop, cropName: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Planting Date</label>
                  <input
                    type="date"
                    value={newCrop.plantingDate}
                    onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Area (acres)</label>
                  <input
                    type="number"
                    placeholder="Enter area in acres"
                    value={newCrop.area}
                    onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                    className="form-input"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <button 
                  onClick={addCrop}
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="loading"></div>
                      Adding Crop...
                    </div>
                  ) : (
                    'Add Crop to Farm'
                  )}
                </button>
              </div>
            </div>

            {/* Current Crops */}
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                Your Current Crops
              </h3>
              
              {farmData?.currentCrops?.length > 0 ? (
                <div className="space-y-3">
                  {farmData.currentCrops.map((crop, index) => (
                    <div key={index} className="p-4 bg-cloud rounded-lg border border-cloud-dark">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-charcoal">{crop.cropName}</h4>
                        <span className="bg-emerald text-white text-xs px-2 py-1 rounded-full">
                          {crop.area} acres
                        </span>
                      </div>
                      <div className="text-sm text-stone">
                        Planted: {new Date(crop.plantingDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌱</div>
                  <p className="text-stone">No crops added yet</p>
                  <p className="text-sm text-stone">Add your first crop to get started</p>
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
            <div className="text-6xl mb-4">🪴</div>
            <h3 className="text-2xl mb-4">Soil Health Tracker</h3>
            <p className="text-lg text-stone mb-6">
              Monitor your soil conditions and get AI-powered recommendations for improvement
            </p>
            
            <div className="bg-warning bg-opacity-10 border border-warning border-opacity-30 rounded-lg p-6">
              <h4 className="font-semibold text-warning mb-2">🚧 Feature Coming Soon</h4>
              <p className="text-sm text-stone">
                We're working on integrating soil testing data and advanced AI analysis 
                to provide personalized soil health recommendations.
              </p>
            </div>

            <div className="mt-6 grid grid-2 gap-4">
              <div className="text-left p-4 bg-cloud rounded-lg">
                <h5 className="font-semibold mb-2">📊 Soil Testing</h5>
                <p className="text-sm text-stone">Comprehensive soil nutrient analysis</p>
              </div>
              <div className="text-left p-4 bg-cloud rounded-lg">
                <h5 className="font-semibold mb-2">🌱 Amendment Plans</h5>
                <p className="text-sm text-stone">Custom fertilizer recommendations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pest Reports Tab */}
      {activeTab === 'pests' && (
        <div className="fade-in">
          <div className="card-elevated text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🐛</div>
            <h3 className="text-2xl mb-4">Pest & Disease Management</h3>
            <p className="text-lg text-stone mb-6">
              Track and manage pest issues across your crops with intelligent monitoring
            </p>
            
            <div className="bg-info bg-opacity-10 border border-info border-opacity-30 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-info mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-stone">
                Use our AI Pest Analysis for instant diagnosis and treatment recommendations 
                based on your specific crop issues.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('pest-ai')}
              className="btn btn-accent"
            >
              🔍 Try AI Pest Analysis
            </button>
          </div>
        </div>
      )}

      {/* AI Pest Analysis Tab */}
      {activeTab === 'pest-ai' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">🔍</span>
                AI Pest & Disease Analysis
              </h3>
              <p className="text-stone mb-6">
                Describe your crop issue and get instant AI-powered diagnosis and treatment recommendations
              </p>

              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <input
                    type="text"
                    placeholder="Which crop is affected?"
                    value={pestAnalysis.crop}
                    onChange={(e) => setPestAnalysis({...pestAnalysis, crop: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Symptoms Observed</label>
                  <input
                    type="text"
                    placeholder="e.g., yellow leaves, black spots, wilting"
                    value={pestAnalysis.symptoms}
                    onChange={(e) => setPestAnalysis({...pestAnalysis, symptoms: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    placeholder="When did you first notice the issue? Any weather changes? Pattern of spread?"
                    value={pestAnalysis.description}
                    onChange={(e) => setPestAnalysis({...pestAnalysis, description: e.target.value})}
                    className="form-textarea"
                    rows="4"
                  />
                </div>

                <button 
                  onClick={analyzePest}
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="loading"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze with AI'
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div>
              {aiResults?.type === 'pest' && (
                <div className="card card-success sticky top-4">
                  <h4 className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🎯</span>
                    AI Analysis Results
                  </h4>
                  <div className="bg-success bg-opacity-10 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
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
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">💧</span>
                Climate-Smart Irrigation
              </h3>
              <p className="text-stone mb-6">
                Get AI-powered irrigation recommendations based on your specific conditions
              </p>

              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <input
                    type="text"
                    placeholder="Which crop needs irrigation?"
                    value={irrigationData.crop}
                    onChange={(e) => setIrrigationData({...irrigationData, crop: e.target.value})}
                    className="form-input"
                  />
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
                  <input
                    type="number"
                    placeholder="Enter area in acres"
                    value={irrigationData.area}
                    onChange={(e) => setIrrigationData({...irrigationData, area: e.target.value})}
                    className="form-input"
                    min="0"
                    step="0.1"
                  />
                </div>

                <button 
                  onClick={scheduleIrrigation}
                  className="btn btn-accent w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="loading"></div>
                      Calculating...
                    </div>
                  ) : (
                    'Get Irrigation Schedule'
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div>
              {aiResults?.type === 'irrigation' && (
                <div className="card card-info sticky top-4">
                  <h4 className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    AI Irrigation Recommendations
                  </h4>
                  <div className="bg-info bg-opacity-10 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
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