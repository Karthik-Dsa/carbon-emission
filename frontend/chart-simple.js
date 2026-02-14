// Simple Chart.js-like library for drawing line charts
class SimpleChart {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.data = config.data;
        this.options = config.options || {};
        
        // Set canvas size
        this.resize();
        
        // Initial draw
        this.update();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }

    update(animation) {
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const data = this.data;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        if (!data.labels || data.labels.length === 0) {
            // Draw empty state
            ctx.fillStyle = '#9caf88';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Enter your carbon data to see the chart', this.width / 2, this.height / 2);
            return;
        }

        // Chart dimensions
        const padding = { top: 60, right: 20, bottom: 60, left: 70 };
        const chartWidth = this.width - padding.left - padding.right;
        const chartHeight = this.height - padding.top - padding.bottom;

        // Find max value for scaling
        let maxValue = 0;
        data.datasets.forEach(dataset => {
            const max = Math.max(...dataset.data);
            if (max > maxValue) maxValue = max;
        });
        
        if (maxValue === 0) maxValue = 100;
        
        // Add 10% padding to max value
        maxValue = maxValue * 1.1;

        // Draw grid lines and Y-axis labels
        ctx.strokeStyle = 'rgba(124, 179, 66, 0.1)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#2d5016';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'right';
        
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            const value = maxValue - (maxValue / gridLines) * i;
            
            // Grid line
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
            
            // Y-axis label
            ctx.fillText(Math.round(value) + ' kg', padding.left - 10, y + 4);
        }

        // Draw X-axis labels
        ctx.textAlign = 'center';
        const labelStep = Math.ceil(data.labels.length / 6); // Show max 6 labels
        data.labels.forEach((label, i) => {
            if (i % labelStep === 0 || i === data.labels.length - 1) {
                const labelCount = Math.max(data.labels.length - 1, 1);
                const x = padding.left + (chartWidth / labelCount) * i;
                ctx.fillText(label, x, this.height - padding.bottom + 20);
            }
        });

        // Draw datasets
        data.datasets.forEach((dataset, datasetIndex) => {
            if (dataset.data.length === 0) return;

            ctx.strokeStyle = dataset.borderColor;
            ctx.fillStyle = dataset.backgroundColor;
            ctx.lineWidth = dataset.borderWidth || 2;

            // Draw filled area
            if (dataset.fill) {
                ctx.beginPath();
                dataset.data.forEach((value, i) => {
                    const labelCount = Math.max(data.labels.length - 1, 1);
                    const x = padding.left + (chartWidth / labelCount) * i;
                    const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
                    
                    if (i === 0) {
                        ctx.moveTo(x, padding.top + chartHeight);
                        ctx.lineTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
                ctx.closePath();
                ctx.fill();
            }

            // Draw line
            ctx.beginPath();
            dataset.data.forEach((value, i) => {
                const labelCount = Math.max(data.labels.length - 1, 1);
                const x = padding.left + (chartWidth / labelCount) * i;
                const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw points
            dataset.data.forEach((value, i) => {
                const labelCount = Math.max(data.labels.length - 1, 1);
                const x = padding.left + (chartWidth / labelCount) * i;
                const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
                
                ctx.fillStyle = dataset.pointBackgroundColor || dataset.borderColor;
                ctx.strokeStyle = dataset.pointBorderColor || '#fff';
                ctx.lineWidth = dataset.pointBorderWidth || 2;
                
                ctx.beginPath();
                ctx.arc(x, y, dataset.pointRadius || 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        });

        // Draw legend
        const legend = this.options.plugins?.legend;
        if (legend && legend.display) {
            const legendY = 20;
            let legendX = padding.left;
            
            data.datasets.forEach((dataset, i) => {
                // Draw color box
                ctx.fillStyle = dataset.borderColor;
                ctx.fillRect(legendX, legendY, 12, 12);
                
                // Draw label
                ctx.fillStyle = '#2d5016';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(dataset.label, legendX + 18, legendY + 10);
                
                // Move to next position
                legendX += ctx.measureText(dataset.label).width + 35;
            });
        }
    }
}

// Export Chart class
window.Chart = SimpleChart;
