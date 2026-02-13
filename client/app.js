// Chart instance
let emissionsChart = null;
let emissionsHistory = [];
const MAX_HISTORY_POINTS = 12; // Show last 12 calculations

// Initialize chart
function initChart() {
    const canvas = document.getElementById('emissionsChart');
    
    emissionsChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Total Emissions',
                    data: [],
                    borderColor: '#4a7c2c',
                    backgroundColor: 'rgba(74, 124, 44, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#4a7c2c',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Electricity',
                    data: [],
                    borderColor: '#7cb342',
                    backgroundColor: 'rgba(124, 179, 66, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: 'Transportation',
                    data: [],
                    borderColor: '#8db255',
                    backgroundColor: 'rgba(141, 178, 85, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: 'Flights',
                    data: [],
                    borderColor: '#9caf88',
                    backgroundColor: 'rgba(156, 175, 136, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: 'Diet',
                    data: [],
                    borderColor: '#8b7355',
                    backgroundColor: 'rgba(139, 115, 85, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Update chart with new data
function updateChart(data) {
    const timestamp = new Date().toLocaleTimeString();
    
    // Add new data point
    emissionsHistory.push({
        timestamp,
        total: data.totalYearlyEmissions.value,
        electricity: data.totalElectricityUsage.value,
        transportation: data.totalTransportationUsage.value,
        flights: data.totalEmissionFlight.value,
        diet: data.dietaryChoiceEmission.value
    });

    // Keep only last MAX_HISTORY_POINTS
    if (emissionsHistory.length > MAX_HISTORY_POINTS) {
        emissionsHistory = emissionsHistory.slice(-MAX_HISTORY_POINTS);
    }

    // Update chart data
    emissionsChart.data.labels = emissionsHistory.map(h => h.timestamp);
    emissionsChart.data.datasets[0].data = emissionsHistory.map(h => h.total);
    emissionsChart.data.datasets[1].data = emissionsHistory.map(h => h.electricity);
    emissionsChart.data.datasets[2].data = emissionsHistory.map(h => h.transportation);
    emissionsChart.data.datasets[3].data = emissionsHistory.map(h => h.flights);
    emissionsChart.data.datasets[4].data = emissionsHistory.map(h => h.diet);

    // Animate the update
    emissionsChart.update();
}

// Display results
function displayResults(data) {
    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('chartSection').classList.remove('hidden');

    // Update values with animation
    animateValue('totalYearlyEmissions', 0, data.totalYearlyEmissions.value, 1000);
    animateValue('totalElectricityUsage', 0, data.totalElectricityUsage.value, 1000);
    animateValue('totalTransportationUsage', 0, data.totalTransportationUsage.value, 1000);
    animateValue('totalEmissionFlight', 0, data.totalEmissionFlight.value, 1000);
    animateValue('dietaryChoiceEmission', 0, data.dietaryChoiceEmission.value, 1000);

    // Update chart
    if (!emissionsChart) {
        initChart();
    }
    updateChart(data);

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Animate number counting
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        element.textContent = current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toFixed(2);
        }
    }
    
    requestAnimationFrame(update);
}

// Form submission handler
document.getElementById('carbonForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const formData = {
        electricityUsageKwh: parseFloat(document.getElementById('electricityUsageKwh').value) || 0,
        transportationUsagePerMonth: parseFloat(document.getElementById('transportationUsagePerMonth').value) || 0,
        shortFlight: parseInt(document.getElementById('shortFlight').value) || 0,
        mediumFlight: parseInt(document.getElementById('mediumFlight').value) || 0,
        largeFlight: parseInt(document.getElementById('largeFlight').value) || 0,
        dietaryChoice: document.getElementById('dietaryChoice').value
    };

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Calculating... 🌱';
        submitBtn.disabled = true;

        // Call API
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Calculation failed');
        }

        const result = await response.json();

        // Display results
        displayResults(result);

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to calculate emissions. Please try again.');
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Calculate My Impact 🌱';
        submitBtn.disabled = false;
    }
});

// Auto-calculate on input change (real-time updates with debouncing)
let debounceTimer;
const formInputs = document.querySelectorAll('#carbonForm input, #carbonForm select');

formInputs.forEach(input => {
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            // Only auto-submit if form is valid
            const form = document.getElementById('carbonForm');
            if (form.checkValidity()) {
                form.dispatchEvent(new Event('submit'));
            }
        }, 500); // Wait 500ms after user stops typing
    });
});
