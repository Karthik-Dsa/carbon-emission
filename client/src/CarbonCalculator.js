import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function CarbonCalculator() {
  const [formData, setFormData] = useState({
    electricityUsageKwh: '',
    transportationUsagePerMonth: '',
    shortFlight: '',
    mediumFlight: '',
    largeFlight: '',
    dietaryChoice: 'vegetarian'
  });

  const [emissionsHistory, setEmissionsHistory] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Real-time calculation as user types
  useEffect(() => {
    const calculateRealTime = async () => {
      // Only calculate if at least one field has a value
      const hasInput = Object.entries(formData).some(([key, value]) => {
        if (key === 'dietaryChoice') return true;
        return value !== '';
      });

      if (!hasInput) return;

      try {
        const response = await axios.post('http://localhost:8080/calculate', {
          electricityUsageKwh: parseFloat(formData.electricityUsageKwh) || 0,
          transportationUsagePerMonth: parseFloat(formData.transportationUsagePerMonth) || 0,
          shortFlight: parseInt(formData.shortFlight) || 0,
          mediumFlight: parseInt(formData.mediumFlight) || 0,
          largeFlight: parseInt(formData.largeFlight) || 0,
          dietaryChoice: formData.dietaryChoice
        });

        const data = response.data;
        const timestamp = new Date().toLocaleTimeString();
        
        // Add new data point to history (keep last 12 points for monthly view)
        setEmissionsHistory(prev => {
          const newHistory = [...prev, {
            timestamp,
            electricity: data.totalElectricityUsage.value / 12, // Monthly value
            transportation: data.totalTransportationUsage.value / 12,
            airTravel: data.totalEmissionFlight.value / 12,
            diet: data.dietaryChoiceEmission.value / 12,
            total: data.totalYearlyEmissions.value / 12
          }];
          // Keep only last 12 data points
          return newHistory.slice(-12);
        });

        setError('');
      } catch (err) {
        console.error(err);
        // Don't show error for real-time updates to avoid spam
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(calculateRealTime, 500);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleReset = () => {
    setFormData({
      electricityUsageKwh: '',
      transportationUsagePerMonth: '',
      shortFlight: '',
      mediumFlight: '',
      largeFlight: '',
      dietaryChoice: 'vegetarian'
    });
    setEmissionsHistory([]);
    setError('');
  };

  // Prepare chart data
  const chartData = {
    labels: emissionsHistory.map(item => item.timestamp),
    datasets: [
      {
        label: 'Total Monthly Emissions',
        data: emissionsHistory.map(item => item.total),
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3
      },
      {
        label: 'Electricity',
        data: emissionsHistory.map(item => item.electricity),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Transportation',
        data: emissionsHistory.map(item => item.transportation),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Air Travel',
        data: emissionsHistory.map(item => item.airTravel),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Diet',
        data: emissionsHistory.map(item => item.diet),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Real-Time Carbon Emissions Tracking (Monthly kgCO2)',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' kgCO2/month';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Emissions (kgCO2/month)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const currentTotal = emissionsHistory.length > 0 
    ? emissionsHistory[emissionsHistory.length - 1].total 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 flex items-center justify-center gap-3">
            <span>🌍</span>
            <span>Carbon Emission Calculator</span>
          </h1>
          <p className="text-center text-indigo-100 text-lg">
            Real-time tracking of your carbon footprint
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Electricity Usage */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Electricity Usage</span>
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Electricity Usage (kWh)
                  </label>
                  <input
                    type="number"
                    name="electricityUsageKwh"
                    value={formData.electricityUsageKwh}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                    placeholder="e.g., 350"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Transportation */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🚗</span>
                  <span>Transportation</span>
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Transportation Usage (km)
                  </label>
                  <input
                    type="number"
                    name="transportationUsagePerMonth"
                    value={formData.transportationUsagePerMonth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                    placeholder="e.g., 500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Air Travel */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✈️</span>
                  <span>Air Travel</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Flights per Year (&lt;1500 km)
                    </label>
                    <input
                      type="number"
                      name="shortFlight"
                      value={formData.shortFlight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                      placeholder="e.g., 2"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medium Flights per Year (1500-4000 km)
                    </label>
                    <input
                      type="number"
                      name="mediumFlight"
                      value={formData.mediumFlight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                      placeholder="e.g., 1"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long Flights per Year (&gt;4000 km)
                    </label>
                    <input
                      type="number"
                      name="largeFlight"
                      value={formData.largeFlight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                      placeholder="e.g., 0"
                      min="0"
                      step="1"
                    />
                  </div>
                </div>
              </div>

              {/* Dietary Choice */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🍽️</span>
                  <span>Dietary Choice</span>
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Diet
                  </label>
                  <select
                    name="dietaryChoice"
                    value={formData.dietaryChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition bg-white"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Reset
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Real-time Graph */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {emissionsHistory.length > 0 ? (
              <>
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Current Monthly Emissions</h3>
                    <p className="text-4xl font-bold">
                      {currentTotal.toFixed(2)}
                      <span className="text-xl font-normal ml-2">kgCO2/month</span>
                    </p>
                    <p className="text-sm text-indigo-100 mt-2">
                      Yearly estimate: {(currentTotal * 12).toFixed(2)} kgCO2/year
                    </p>
                  </div>
                </div>

                <div className="h-96">
                  <Line data={chartData} options={chartOptions} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {emissionsHistory.length > 0 && (
                    <>
                      <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                        <p className="text-xs text-gray-600 font-semibold">⚡ Electricity</p>
                        <p className="text-lg font-bold text-gray-800">
                          {emissionsHistory[emissionsHistory.length - 1].electricity.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <p className="text-xs text-gray-600 font-semibold">🚗 Transport</p>
                        <p className="text-lg font-bold text-gray-800">
                          {emissionsHistory[emissionsHistory.length - 1].transportation.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                        <p className="text-xs text-gray-600 font-semibold">✈️ Air Travel</p>
                        <p className="text-lg font-bold text-gray-800">
                          {emissionsHistory[emissionsHistory.length - 1].airTravel.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-teal-50 rounded-lg p-4 border-l-4 border-teal-400">
                        <p className="text-xs text-gray-600 font-semibold">🍽️ Diet</p>
                        <p className="text-lg font-bold text-gray-800">
                          {emissionsHistory[emissionsHistory.length - 1].diet.toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Start Entering Your Data
                  </h3>
                  <p className="text-gray-500">
                    Your real-time emissions graph will appear here as you input your data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Tips to Reduce Your Carbon Footprint</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <span className="text-2xl">🌱</span>
              <div>
                <h4 className="font-semibold text-gray-800">Use Renewable Energy</h4>
                <p className="text-sm text-gray-600">Switch to solar or wind power for electricity</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <span className="text-2xl">🚌</span>
              <div>
                <h4 className="font-semibold text-gray-800">Public Transportation</h4>
                <p className="text-sm text-gray-600">Use buses, trains, or carpool to reduce emissions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <span className="text-2xl">🏠</span>
              <div>
                <h4 className="font-semibold text-gray-800">Reduce Air Travel</h4>
                <p className="text-sm text-gray-600">Consider virtual meetings or alternative transport</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg">
              <span className="text-2xl">🥗</span>
              <div>
                <h4 className="font-semibold text-gray-800">Plant-Based Diet</h4>
                <p className="text-sm text-gray-600">Reduce meat consumption for lower emissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarbonCalculator;
