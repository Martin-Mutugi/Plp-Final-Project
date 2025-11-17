import React, { useState, useEffect } from 'react';

function ConsumerTools({ user }) {
  const [consumerData, setConsumerData] = useState(null);
  const [activeTab, setActiveTab] = useState('waste');
  const [foodWaste, setFoodWaste] = useState({ foodType: '', amount: '', reason: 'spoiled' });
  const [carbonData, setCarbonData] = useState({ dietType: 'omnivore', weeklyMeals: 21, transportation: 'car' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConsumerData();
  }, [user.id]);

  const fetchConsumerData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/consumer/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setConsumerData(data);
      }
    } catch (error) {
      console.error('Failed to fetch consumer data:', error);
    }
  };

  const logFoodWaste = async () => {
    if (!foodWaste.foodType || !foodWaste.amount) {
      alert('Please provide food type and amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/consumer/${user.id}/food-waste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodWaste)
      });
      
      if (response.ok) {
        setFoodWaste({ foodType: '', amount: '', reason: 'spoiled' });
        fetchConsumerData();
        alert('Food waste logged successfully!');
      }
    } catch (error) {
      console.error('Failed to log food waste:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCarbonFootprint = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/consumer/${user.id}/carbon-footprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carbonData)
      });
      
      if (response.ok) {
        fetchConsumerData();
        alert('Carbon footprint calculated!');
      }
    } catch (error) {
      console.error('Failed to calculate carbon footprint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalFoodWaste = consumerData?.foodWasteLog?.reduce((total, entry) => total + (entry.amount || 0), 0) || 0;
  const wasteSavings = totalFoodWaste * 2.5; // Estimated CO2 savings per kg of food waste prevented

  const tabs = [
    { id: 'waste', label: '🗑️ Food Waste Tracker', icon: '🗑️' },
    { id: 'carbon', label: '🌍 Carbon Footprint', icon: '🌍' },
    { id: 'shopping', label: '🛒 Sustainable Shopping', icon: '🛒' }
  ];

  const getCarbonImpact = (co2) => {
    if (co2 < 100) return { level: 'Low', color: 'success', emoji: '🌱' };
    if (co2 < 300) return { level: 'Moderate', color: 'warning', emoji: '⚠️' };
    return { level: 'High', color: 'error', emoji: '🔴' };
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <h1>🛒 Consumer Sustainability Tools</h1>
        <p className="text-lg text-stone">
          Track your environmental impact and make sustainable consumption choices
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

      {/* Food Waste Tracker Tab */}
      {activeTab === 'waste' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            {/* Log Food Waste */}
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">📝</span>
                Log Food Waste
              </h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Food Type</label>
                  <input
                    type="text"
                    placeholder="e.g., Vegetables, Fruits, Dairy, Meat"
                    value={foodWaste.foodType}
                    onChange={(e) => setFoodWaste({...foodWaste, foodType: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Amount Wasted (kg)</label>
                  <input
                    type="number"
                    placeholder="Enter amount in kilograms"
                    value={foodWaste.amount}
                    onChange={(e) => setFoodWaste({...foodWaste, amount: e.target.value})}
                    className="form-input"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Reason for Waste</label>
                  <select
                    value={foodWaste.reason}
                    onChange={(e) => setFoodWaste({...foodWaste, reason: e.target.value})}
                    className="form-select"
                  >
                    <option value="spoiled">🥀 Spoiled or expired</option>
                    <option value="leftovers">🍽️ Leftovers not eaten</option>
                    <option value="overprepared">👨‍🍳 Overprepared food</option>
                    <option value="other">❓ Other reasons</option>
                  </select>
                </div>
                
                <button 
                  onClick={logFoodWaste}
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="loading"></div>
                      Logging...
                    </div>
                  ) : (
                    'Log Food Waste'
                  )}
                </button>
              </div>
            </div>

            {/* Waste Summary */}
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                Your Food Waste Impact
              </h3>
              
              {/* Impact Stats */}
              <div className="grid grid-2 gap-4 mb-6">
                <div className="text-center p-4 bg-warning bg-opacity-10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{totalFoodWaste} kg</div>
                  <div className="text-sm text-stone">Total Waste</div>
                </div>
                <div className="text-center p-4 bg-success bg-opacity-10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{wasteSavings.toFixed(1)} kg</div>
                  <div className="text-sm text-stone">CO₂ Equivalent</div>
                </div>
              </div>

              {/* Waste Log */}
              <h4 className="font-semibold mb-3">Recent Waste Entries</h4>
              {consumerData?.foodWasteLog?.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {consumerData.foodWasteLog.map((entry, index) => (
                    <div key={index} className="p-3 bg-cloud rounded-lg border border-cloud-dark">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-charcoal">{entry.foodType}</span>
                        <span className="bg-warning text-charcoal text-xs px-2 py-1 rounded-full">
                          {entry.amount} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-stone">
                        <span>{entry.reason}</span>
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">📈</div>
                  <p className="text-stone">No waste entries yet</p>
                  <p className="text-sm text-stone">Start tracking to see your impact</p>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="mt-8 card bg-gradient-to-r from-emerald to-teal text-white">
            <div className="text-center">
              <h3 className="text-xl mb-2">🌍 Environmental Impact</h3>
              <p className="opacity-90">
                Every kilogram of food waste prevented saves approximately 2.5 kg of CO₂ emissions. 
                You're helping combat climate change with every entry!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Carbon Footprint Tab */}
      {activeTab === 'carbon' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            {/* Calculator */}
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-xl">🧮</span>
                Carbon Footprint Calculator
              </h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Diet Type</label>
                  <select
                    value={carbonData.dietType}
                    onChange={(e) => setCarbonData({...carbonData, dietType: e.target.value})}
                    className="form-select"
                  >
                    <option value="vegan">🌱 Vegan - Lowest impact</option>
                    <option value="vegetarian">🥬 Vegetarian - Low impact</option>
                    <option value="omnivore">🍖 Omnivore - Moderate impact</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Weekly Meals Prepared</label>
                  <input
                    type="number"
                    value={carbonData.weeklyMeals}
                    onChange={(e) => setCarbonData({...carbonData, weeklyMeals: e.target.value})}
                    className="form-input"
                    min="0"
                    max="50"
                  />
                  <div className="text-xs text-stone mt-1">
                    Includes all meals prepared at home or purchased
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Primary Transportation</label>
                  <select
                    value={carbonData.transportation}
                    onChange={(e) => setCarbonData({...carbonData, transportation: e.target.value})}
                    className="form-select"
                  >
                    <option value="bike">🚲 Bike - Zero emissions</option>
                    <option value="public">🚌 Public Transport - Low emissions</option>
                    <option value="car">🚗 Car - High emissions</option>
                  </select>
                </div>
                
                <button 
                  onClick={calculateCarbonFootprint}
                  className="btn btn-accent w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="loading"></div>
                      Calculating...
                    </div>
                  ) : (
                    'Calculate My Footprint'
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              {consumerData?.carbonFootprint?.estimatedCO2 ? (
                <div className="card-elevated sticky top-4">
                  <h4 className="flex items-center gap-2 mb-4">
                    <span className="text-xl">📈</span>
                    Your Carbon Footprint
                  </h4>
                  
                  {(() => {
                    const impact = getCarbonImpact(consumerData.carbonFootprint.estimatedCO2);
                    return (
                      <div className={`bg-${impact.color} bg-opacity-10 p-4 rounded-lg border border-${impact.color} border-opacity-30`}>
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">{impact.emoji}</div>
                          <div className="text-2xl font-bold text-charcoal">
                            {consumerData.carbonFootprint.estimatedCO2} kg CO₂/month
                          </div>
                          <div className={`text-${impact.color} font-semibold`}>
                            {impact.level} Impact Level
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Diet:</span>
                            <span className="font-medium">{consumerData.carbonFootprint.dietType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transportation:</span>
                            <span className="font-medium">{consumerData.carbonFootprint.transportation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Impact:</span>
                            <span className="font-medium">
                              Equivalent to {Math.round(consumerData.carbonFootprint.estimatedCO2 / 2.3)} km driven
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="mt-4 p-3 bg-cloud rounded-lg">
                    <h5 className="font-semibold mb-2">💡 Reduction Tips</h5>
                    <ul className="text-sm text-stone space-y-1">
                      <li>• Choose plant-based meals 2-3 times per week</li>
                      <li>• Use public transport or carpool when possible</li>
                      <li>• Reduce food waste through better meal planning</li>
                      <li>• Support local and seasonal produce</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-8">
                  <div className="text-4xl mb-4">🌍</div>
                  <h4 className="text-lg font-semibold mb-2">Calculate Your Impact</h4>
                  <p className="text-stone">
                    Use the calculator to estimate your monthly carbon footprint and get personalized reduction tips.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sustainable Shopping Tab */}
      {activeTab === 'shopping' && (
        <div className="fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated">
              <h3 className="flex items-center gap-2 mb-6 text-center justify-center">
                <span className="text-xl">🛒</span>
                Sustainable Shopping Guide
              </h3>
              
              <div className="grid grid-2 gap-6 mb-8">
                <div className="text-center p-6 bg-success bg-opacity-10 rounded-xl">
                  <div className="text-4xl mb-3">🌱</div>
                  <h4 className="font-semibold mb-2">Local & Seasonal</h4>
                  <p className="text-sm text-stone">Choose locally grown, seasonal produce to reduce transportation emissions</p>
                </div>
                
                <div className="text-center p-6 bg-info bg-opacity-10 rounded-xl">
                  <div className="text-4xl mb-3">📦</div>
                  <h4 className="font-semibold mb-2">Minimal Packaging</h4>
                  <p className="text-sm text-stone">Avoid excessive packaging and bring reusable bags & containers</p>
                </div>
                
                <div className="text-center p-6 bg-warning bg-opacity-10 rounded-xl">
                  <div className="text-4xl mb-3">🥦</div>
                  <h4 className="font-semibold mb-2">Meal Planning</h4>
                  <p className="text-sm text-stone">Plan meals to reduce food waste and make efficient shopping lists</p>
                </div>
                
                <div className="text-center p-6 bg-emerald bg-opacity-10 rounded-xl">
                  <div className="text-4xl mb-3">🔄</div>
                  <h4 className="font-semibold mb-2">Bulk Buying</h4>
                  <p className="text-sm text-stone">Purchase in bulk for frequently used items to reduce packaging waste</p>
                </div>
              </div>

              <div className="bg-warning bg-opacity-10 border border-warning border-opacity-30 rounded-lg p-6">
                <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                  <span>🚀</span>
                  Premium Feature Coming Soon
                </h4>
                <p className="text-sm text-stone">
                  Personalized shopping recommendations based on your location, preferences, and sustainability goals. 
                  Get AI-powered suggestions for the most eco-friendly products in your area.
                </p>
              </div>

              <div className="mt-6 text-center">
                <button className="btn btn-outline">
                  📋 Download Shopping Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsumerTools;