import React, { useState } from 'react';
import './CarbonCalculator.css';

function CarbonCalculator() {
  const [formData, setFormData] = useState({
    electricityUsageKwh: '',
    transportationUsagePerMonth: '',
    shortFlight: '',
    mediumFlight: '',
    largeFlight: '',
    dietaryChoice: 'vegetarian'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8080/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          electricityUsageKwh: parseFloat(formData.electricityUsageKwh) || 0,
          transportationUsagePerMonth: parseFloat(formData.transportationUsagePerMonth) || 0,
          shortFlight: parseInt(formData.shortFlight) || 0,
          mediumFlight: parseInt(formData.mediumFlight) || 0,
          largeFlight: parseInt(formData.largeFlight) || 0,
          dietaryChoice: formData.dietaryChoice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate emissions');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error calculating emissions. Please make sure the server is running on port 8080.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      electricityUsageKwh: '',
      transportationUsagePerMonth: '',
      shortFlight: '',
      mediumFlight: '',
      largeFlight: '',
      dietaryChoice: 'vegetarian'
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="calculator-container">
      <div className="header">
        <h1>🌍 Carbon Emission Calculator</h1>
        <p>Calculate your yearly carbon footprint</p>
      </div>

      <form onSubmit={handleSubmit} className="calculator-form">
        <div className="form-section">
          <h2>⚡ Electricity Usage</h2>
          <div className="form-group">
            <label htmlFor="electricityUsageKwh">
              Monthly Electricity Usage (kWh)
            </label>
            <input
              type="number"
              id="electricityUsageKwh"
              name="electricityUsageKwh"
              value={formData.electricityUsageKwh}
              onChange={handleChange}
              placeholder="e.g., 350"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>🚗 Transportation</h2>
          <div className="form-group">
            <label htmlFor="transportationUsagePerMonth">
              Monthly Transportation Usage (km)
            </label>
            <input
              type="number"
              id="transportationUsagePerMonth"
              name="transportationUsagePerMonth"
              value={formData.transportationUsagePerMonth}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>✈️ Air Travel</h2>
          <div className="form-group">
            <label htmlFor="shortFlight">
              Short Flights per Year (&lt;1500 km)
            </label>
            <input
              type="number"
              id="shortFlight"
              name="shortFlight"
              value={formData.shortFlight}
              onChange={handleChange}
              placeholder="e.g., 2"
              min="0"
              step="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mediumFlight">
              Medium Flights per Year (1500-4000 km)
            </label>
            <input
              type="number"
              id="mediumFlight"
              name="mediumFlight"
              value={formData.mediumFlight}
              onChange={handleChange}
              placeholder="e.g., 1"
              min="0"
              step="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="largeFlight">
              Long Flights per Year (&gt;4000 km)
            </label>
            <input
              type="number"
              id="largeFlight"
              name="largeFlight"
              value={formData.largeFlight}
              onChange={handleChange}
              placeholder="e.g., 0"
              min="0"
              step="1"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>🍽️ Dietary Choice</h2>
          <div className="form-group">
            <label htmlFor="dietaryChoice">Select Your Diet</label>
            <select
              id="dietaryChoice"
              name="dietaryChoice"
              value={formData.dietaryChoice}
              onChange={handleChange}
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Emissions'}
          </button>
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="results-container">
          <h2>📊 Your Carbon Footprint Results</h2>
          
          <div className="result-card total">
            <h3>Total Yearly Emissions</h3>
            <p className="result-value">
              {result.totalYearlyEmissions.value.toFixed(2)} {result.totalYearlyEmissions.unit}
            </p>
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h4>⚡ Electricity</h4>
              <p>{result.totalElectricityUsage.value.toFixed(2)} {result.totalElectricityUsage.unit}</p>
            </div>
            <div className="result-card">
              <h4>🚗 Transportation</h4>
              <p>{result.totalTransportationUsage.value.toFixed(2)} {result.totalTransportationUsage.unit}</p>
            </div>
            <div className="result-card">
              <h4>✈️ Air Travel</h4>
              <p>{result.totalEmissionFlight.value.toFixed(2)} {result.totalEmissionFlight.unit}</p>
            </div>
            <div className="result-card">
              <h4>🍽️ Diet</h4>
              <p>{result.dietaryChoiceEmission.value.toFixed(2)} {result.dietaryChoiceEmission.unit}</p>
            </div>
          </div>

          <div className="tips-section">
            <h3>💡 Tips to Reduce Your Carbon Footprint</h3>
            <ul>
              <li>Use renewable energy sources for electricity</li>
              <li>Consider public transportation or carpooling</li>
              <li>Reduce air travel when possible</li>
              <li>Consider plant-based dietary options</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarbonCalculator;
