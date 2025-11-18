import React, { useState, useEffect } from 'react';
import './App.css';

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
  const wasteSavings = totalFoodWaste * 2.5;

  const tabs = [
    { id: 'waste', label: 'Food Waste Tracker', icon: '🗑️', color: 'warning' },
    { id: 'carbon', label: 'Carbon Footprint', icon: '🌍', color: 'info' },
    { id: 'shopping', label: 'Sustainable Shopping', icon: '🛒', color: 'success' }
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
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald to-teal rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🛒</span>
          </div>
        </div>
        <h1 className="mb-4">Consumer Sustainability Tools</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
          Track your environmental impact and make sustainable consumption choices that support UN SDG goals
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

      {/* Food Waste Tracker Tab */}
      {activeTab === 'waste' && (
        <div className="fade-in">
          <div className="grid grid-2 gap-8">
            {/* Log Food Waste */}
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Log Food Waste</h3>
                  <p className="text-sm text-stone">Track and reduce your food waste impact</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Food Type</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Vegetables, Fruits, Dairy, Meat"
                      value={foodWaste.foodType}
                      onChange={(e) => setFoodWaste({...foodWaste, foodType: e.target.value})}
                      className="form-input pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🍎</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Amount Wasted (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter amount in kilograms"
                      value={foodWaste.amount}
                      onChange={(e) => setFoodWaste({...foodWaste, amount: e.target.value})}
                      className="form-input pl-10"
                      min="0"
                      step="0.1"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">⚖️</span>
                  </div>
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
                  className="btn btn-primary w-full btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loading"></div>
                      <span>Logging Waste...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>📊</span>
                      <span>Log Food Waste</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Waste Summary */}
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Your Food Waste Impact</h3>
                  <p className="text-sm text-stone">Track your progress and environmental savings</p>
                </div>
              </div>
              
              {/* Impact Stats */}
              <div className="grid grid-2 gap-4 mb-8">
                <div className="text-center p-6 bg-warning-light rounded-xl border border-warning border-opacity-30">
                  <div className="text-3xl font-bold text-warning mb-2">{totalFoodWaste} kg</div>
                  <div className="text-sm text-stone">Total Food Waste</div>
                </div>
                <div className="text-center p-6 bg-success-light rounded-xl border border-success border-opacity-30">
                  <div className="text-3xl font-bold text-success mb-2">{wasteSavings.toFixed(1)} kg</div>
                  <div className="text-sm text-stone">CO₂ Equivalent Saved</div>
                </div>
              </div>

              {/* Waste Log */}
              <h4 className="font-semibold text-charcoal mb-4">Recent Waste Entries</h4>
              {consumerData?.foodWasteLog?.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {consumerData.foodWasteLog.map((entry, index) => (
                    <div key={index} className="p-4 bg-snow rounded-xl border border-cloud hover:border-warning transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-charcoal">{entry.foodType}</span>
                        <span className="bg-warning text-white text-sm px-3 py-1 rounded-full font-semibold">
                          {entry.amount} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-stone">
                        <span className="capitalize">{entry.reason}</span>
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📈</span>
                  </div>
                  <p className="text-stone mb-2">No waste entries yet</p>
                  <p className="text-sm text-stone">Start tracking to see your environmental impact</p>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="mt-8 card bg-gradient-emerald text-white fade-in">
            <div className="text-center p-8">
              <div className="flex justify-center mb-4">
                <span className="text-4xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Environmental Impact</h3>
              <p className="opacity-90 leading-relaxed max-w-2xl mx-auto">
                Every kilogram of food waste prevented saves approximately 2.5 kg of CO₂ emissions. 
                You're directly contributing to UN SDG 12 (Responsible Consumption) and helping combat climate change with every entry!
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-info to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🧮</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Carbon Footprint Calculator</h3>
                  <p className="text-sm text-stone">Estimate your monthly environmental impact</p>
                </div>
              </div>
              
              <div className="space-y-6">
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
                  <div className="relative">
                    <input
                      type="number"
                      value={carbonData.weeklyMeals}
                      onChange={(e) => setCarbonData({...carbonData, weeklyMeals: e.target.value})}
                      className="form-input pl-10"
                      min="0"
                      max="50"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🍽️</span>
                  </div>
                  <div className="text-xs text-stone-light mt-2">
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
                  className="btn btn-accent w-full btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loading"></div>
                      <span>Calculating Footprint...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🌍</span>
                      <span>Calculate My Footprint</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              {consumerData?.carbonFootprint?.estimatedCO2 ? (
                <div className="card-elevated sticky top-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
                      <span className="text-xl text-white">📈</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-charcoal">Your Carbon Footprint</h4>
                      <p className="text-sm text-stone">Monthly environmental impact</p>
                    </div>
                  </div>
                  
                  {(() => {
                    const impact = getCarbonImpact(consumerData.carbonFootprint.estimatedCO2);
                    return (
                      <div className={`bg-${impact.color}-light p-6 rounded-xl border border-${impact.color} border-opacity-30 mb-6`}>
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-3">{impact.emoji}</div>
                          <div className="text-2xl font-bold text-charcoal mb-2">
                            {consumerData.carbonFootprint.estimatedCO2} kg CO₂/month
                          </div>
                          <div className={`text-${impact.color} font-semibold text-lg`}>
                            {impact.level} Impact Level
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between p-2 bg-white rounded-lg">
                            <span className="text-stone">Diet:</span>
                            <span className="font-medium text-charcoal capitalize">{consumerData.carbonFootprint.dietType}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-white rounded-lg">
                            <span className="text-stone">Transportation:</span>
                            <span className="font-medium text-charcoal capitalize">{consumerData.carbonFootprint.transportation}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-white rounded-lg">
                            <span className="text-stone">Monthly Impact:</span>
                            <span className="font-medium text-charcoal">
                              Equivalent to {Math.round(consumerData.carbonFootprint.estimatedCO2 / 2.3)} km driven
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="p-4 bg-snow rounded-xl border border-cloud">
                    <h5 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                      <span>💡</span>
                      Reduction Tips
                    </h5>
                    <ul className="text-sm text-stone space-y-2">
                      <li className="flex items-center gap-2">• Choose plant-based meals 2-3 times per week</li>
                      <li className="flex items-center gap-2">• Use public transport or carpool when possible</li>
                      <li className="flex items-center gap-2">• Reduce food waste through better meal planning</li>
                      <li className="flex items-center gap-2">• Support local and seasonal produce</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="card-elevated text-center py-12">
                  <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <h4 className="text-lg font-semibold text-charcoal mb-3">Calculate Your Impact</h4>
                  <p className="text-stone leading-relaxed">
                    Use the calculator to estimate your monthly carbon footprint and get personalized reduction tips 
                    to support UN SDG 13 (Climate Action).
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
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-success to-green-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl text-white">🛒</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">Sustainable Shopping Guide</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Make conscious consumption choices that support environmental sustainability and reduce your ecological footprint
                </p>
              </div>
              
              <div className="grid grid-2 gap-6 mb-8">
                {[
                  {
                    icon: '🌱',
                    title: 'Local & Seasonal',
                    description: 'Choose locally grown, seasonal produce to reduce transportation emissions and support local farmers',
                    color: 'success'
                  },
                  {
                    icon: '📦',
                    title: 'Minimal Packaging',
                    description: 'Avoid excessive packaging and bring reusable bags & containers to reduce plastic waste',
                    color: 'info'
                  },
                  {
                    icon: '🥦',
                    title: 'Meal Planning',
                    description: 'Plan meals to reduce food waste, save money, and make efficient shopping lists',
                    color: 'warning'
                  },
                  {
                    icon: '🔄',
                    title: 'Bulk Buying',
                    description: 'Purchase in bulk for frequently used items to reduce packaging waste and save resources',
                    color: 'emerald'
                  }
                ].map((tip, index) => (
                  <div key={index} className="text-center p-6 bg-snow rounded-xl border border-cloud hover:border-emerald transition-colors">
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <h4 className="font-semibold text-charcoal mb-3">{tip.title}</h4>
                    <p className="text-sm text-stone leading-relaxed">{tip.description}</p>
                  </div>
                ))}
              </div>

              <div className="card card-warning mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                    <span className="text-xl text-white">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning mb-2">Premium Feature Coming Soon</h4>
                    <p className="text-sm text-stone">
                      Personalized shopping recommendations based on your location, preferences, and sustainability goals. 
                      Get AI-powered suggestions for the most eco-friendly products in your area.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="btn btn-outline btn-lg">
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Download Sustainable Shopping Checklist</span>
                  </div>
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