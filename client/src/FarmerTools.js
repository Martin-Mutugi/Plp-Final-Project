import React, { useState, useEffect } from 'react';

function FarmerTools({ user }) {
  const [farmData, setFarmData] = useState(null);
  const [activeTab, setActiveTab] = useState('crops');
  const [newCrop, setNewCrop] = useState({ cropName: '', plantingDate: '', area: '' });
  const [pestAnalysis, setPestAnalysis] = useState({ crop: '', symptoms: '', description: '' });
  const [irrigationData, setIrrigationData] = useState({ crop: '', soilType: 'loamy', weatherConditions: 'sunny', area: '' });
  const [aiResults, setAiResults] = useState(null);

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
    }
  };

  const analyzePest = async () => {
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
    }
  };

  const scheduleIrrigation = async () => {
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
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🌾 Farmer Tools</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('crops')} style={{ marginRight: '10px' }}>
          My Crops
        </button>
        <button onClick={() => setActiveTab('soil')} style={{ marginRight: '10px' }}>
          Soil Health
        </button>
        <button onClick={() => setActiveTab('pests')} style={{ marginRight: '10px' }}>
          Pest Reports
        </button>
        <button onClick={() => setActiveTab('pest-ai')} style={{ marginRight: '10px' }}>
          AI Pest Analysis
        </button>
        <button onClick={() => setActiveTab('irrigation-ai')}>
          Smart Irrigation
        </button>
      </div>

      {activeTab === 'crops' && (
        <div>
          <h3>Current Crops</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h4>Add New Crop</h4>
            <input
              type="text"
              placeholder="Crop Name"
              value={newCrop.cropName}
              onChange={(e) => setNewCrop({...newCrop, cropName: e.target.value})}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <input
              type="date"
              value={newCrop.plantingDate}
              onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <input
              type="number"
              placeholder="Area (acres)"
              value={newCrop.area}
              onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <button onClick={addCrop}>Add Crop</button>
          </div>

          <div>
            <h4>Your Crops</h4>
            {farmData?.currentCrops?.map((crop, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <strong>{crop.cropName}</strong> - {crop.area} acres - Planted: {new Date(crop.plantingDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'soil' && (
        <div>
          <h3>Soil Health Tracker</h3>
          <p>Monitor your soil conditions and get recommendations for improvement.</p>
          <div style={{ border: '1px solid #ccc', padding: '15px' }}>
            <p><strong>Feature Coming Soon:</strong> Soil testing integration and AI-powered recommendations</p>
          </div>
        </div>
      )}

      {activeTab === 'pests' && (
        <div>
          <h3>Pest & Disease Reports</h3>
          <p>Track and manage pest issues in your crops.</p>
          <div style={{ border: '1px solid #ccc', padding: '15px' }}>
            <p><strong>Basic reporting available.</strong> Use AI Pest Analysis for detailed diagnosis.</p>
          </div>
        </div>
      )}

      {activeTab === 'pest-ai' && (
        <div>
          <h3>AI Pest & Disease Analysis</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h4>Describe Your Crop Issue</h4>
            <input
              type="text"
              placeholder="Crop Name"
              value={pestAnalysis.crop}
              onChange={(e) => setPestAnalysis({...pestAnalysis, crop: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            />
            <input
              type="text"
              placeholder="Symptoms (e.g., yellow leaves, spots)"
              value={pestAnalysis.symptoms}
              onChange={(e) => setPestAnalysis({...pestAnalysis, symptoms: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            />
            <textarea
              placeholder="Detailed description of the issue..."
              value={pestAnalysis.description}
              onChange={(e) => setPestAnalysis({...pestAnalysis, description: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block', width: '100%', height: '100px' }}
            />
            <button onClick={analyzePest}>Analyze with AI</button>
          </div>

          {aiResults?.type === 'pest' && (
            <div style={{ border: '1px solid #28a745', padding: '15px', backgroundColor: '#f8fff9' }}>
              <h4>AI Analysis Results</h4>
              <div style={{ whiteSpace: 'pre-wrap' }}>{aiResults.data}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'irrigation-ai' && (
        <div>
          <h3>Climate-Smart Irrigation Scheduling</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h4>Get AI Irrigation Advice</h4>
            <input
              type="text"
              placeholder="Crop Name"
              value={irrigationData.crop}
              onChange={(e) => setIrrigationData({...irrigationData, crop: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            />
            <select
              value={irrigationData.soilType}
              onChange={(e) => setIrrigationData({...irrigationData, soilType: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            >
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="silty">Silty</option>
            </select>
            <select
              value={irrigationData.weatherConditions}
              onChange={(e) => setIrrigationData({...irrigationData, weatherConditions: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            >
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="hot-dry">Hot & Dry</option>
            </select>
            <input
              type="number"
              placeholder="Area (acres)"
              value={irrigationData.area}
              onChange={(e) => setIrrigationData({...irrigationData, area: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', marginBottom: '10px', display: 'block' }}
            />
            <button onClick={scheduleIrrigation}>Get Irrigation Schedule</button>
          </div>

          {aiResults?.type === 'irrigation' && (
            <div style={{ border: '1px solid #17a2b8', padding: '15px', backgroundColor: '#f8f9fe' }}>
              <h4>AI Irrigation Recommendations</h4>
              <div style={{ whiteSpace: 'pre-wrap' }}>{aiResults.data}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FarmerTools;