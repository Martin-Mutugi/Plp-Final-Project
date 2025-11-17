import React, { useState, useEffect } from 'react';

function ConsumerTools({ user }) {
  const [consumerData, setConsumerData] = useState(null);
  const [activeTab, setActiveTab] = useState('waste');
  const [foodWaste, setFoodWaste] = useState({ foodType: '', amount: '', reason: 'spoiled' });
  const [carbonData, setCarbonData] = useState({ dietType: 'omnivore', weeklyMeals: 21, transportation: 'car' });

  useEffect(() => {
    fetchConsumerData();
  }, [user.id]);

  const fetchConsumerData = async () => {
    try {
      const response = await fetch(`/api/consumer/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setConsumerData(data);
      }
    } catch (error) {
      console.error('Failed to fetch consumer data:', error);
    }
  };

  const logFoodWaste = async () => {
    try {
      const response = await fetch(`/api/consumer/${user.id}/food-waste`, {
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
    }
  };

  const calculateCarbonFootprint = async () => {
    try {
      const response = await fetch(`/api/consumer/${user.id}/carbon-footprint`, {
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
    }
  };

  const totalFoodWaste = consumerData?.foodWasteLog?.reduce((total, entry) => total + (entry.amount || 0), 0) || 0;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛒 Consumer Tools</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('waste')} style={{ marginRight: '10px' }}>
          Food Waste Tracker
        </button>
        <button onClick={() => setActiveTab('carbon')} style={{ marginRight: '10px' }}>
          Carbon Footprint
        </button>
        <button onClick={() => setActiveTab('shopping')}>
          Sustainable Shopping
        </button>
      </div>

      {activeTab === 'waste' && (
        <div>
          <h3>Food Waste Tracker</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h4>Log Food Waste</h4>
            <input
              type="text"
              placeholder="Food Type (e.g., vegetables, fruits)"
              value={foodWaste.foodType}
              onChange={(e) => setFoodWaste({...foodWaste, foodType: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            />
            <input
              type="number"
              placeholder="Amount (kg)"
              value={foodWaste.amount}
              onChange={(e) => setFoodWaste({...foodWaste, amount: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            />
            <select
              value={foodWaste.reason}
              onChange={(e) => setFoodWaste({...foodWaste, reason: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            >
              <option value="spoiled">Spoiled</option>
              <option value="leftovers">Leftovers</option>
              <option value="overprepared">Overprepared</option>
              <option value="other">Other</option>
            </select>
            <button onClick={logFoodWaste}>Log Waste</button>
          </div>

          <div>
            <h4>Your Food Waste Summary</h4>
            <p><strong>Total Waste:</strong> {totalFoodWaste} kg</p>
            {consumerData?.foodWasteLog?.map((entry, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                {entry.foodType} - {entry.amount} kg - {entry.reason} - {new Date(entry.date).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'carbon' && (
        <div>
          <h3>Carbon Footprint Calculator</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label>Diet Type: </label>
              <select
                value={carbonData.dietType}
                onChange={(e) => setCarbonData({...carbonData, dietType: e.target.value})}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="omnivore">Omnivore</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Weekly Meals: </label>
              <input
                type="number"
                value={carbonData.weeklyMeals}
                onChange={(e) => setCarbonData({...carbonData, weeklyMeals: e.target.value})}
                style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Transportation: </label>
              <select
                value={carbonData.transportation}
                onChange={(e) => setCarbonData({...carbonData, transportation: e.target.value})}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="bike">Bike</option>
                <option value="public">Public Transport</option>
                <option value="car">Car</option>
              </select>
            </div>
            <button onClick={calculateCarbonFootprint}>Calculate Footprint</button>
          </div>

          {consumerData?.carbonFootprint?.estimatedCO2 && (
            <div style={{ border: '1px solid #28a745', padding: '15px', backgroundColor: '#f8fff9' }}>
              <h4>Your Carbon Footprint</h4>
              <p><strong>Estimated CO₂:</strong> {consumerData.carbonFootprint.estimatedCO2} kg per month</p>
              <p><strong>Diet:</strong> {consumerData.carbonFootprint.dietType}</p>
              <p><strong>Transportation:</strong> {consumerData.carbonFootprint.transportation}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'shopping' && (
        <div>
          <h3>Sustainable Shopping Recommendations</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px' }}>
            <h4>Tips for Sustainable Shopping</h4>
            <ul>
              <li>🛒 Buy local and seasonal produce</li>
              <li>🌱 Choose organic when possible</li>
              <li>📦 Avoid excessive packaging</li>
              <li>🥦 Plan meals to reduce food waste</li>
              <li>🔄 Bring reusable bags and containers</li>
            </ul>
            <p><strong>Feature Coming Soon:</strong> Personalized shopping recommendations based on your preferences</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsumerTools;