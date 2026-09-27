/**
 * NEGARIT ET - METEOROLOGICAL & RISK TREND CHART CONTROLLER
 * Renders high-resolution 16-day climate trends using Chart.js.
 */

window.ChartController = {
  chartInstance: null,
  latestDailyData: null,

  renderTrend(canvasId, daily) {
    if (!daily || !daily.time) return;
    this.latestDailyData = daily;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const labels = daily.time.map(t => {
      const parts = t.split('-');
      return `${parts[1]}/${parts[2]}`;
    });

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    this.chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Max Temp (°C)',
            data: daily.temperature_2m_max,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Min Temp (°C)',
            data: daily.temperature_2m_min,
            borderColor: '#38bdf8',
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 2,
            tension: 0.35,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Rain Sum (mm)',
            data: daily.precipitation_sum,
            type: 'bar',
            backgroundColor: 'rgba(16, 185, 129, 0.65)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: textColor
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#cbd5e1' : '#334155',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 10 } }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 10 },
              callback: (val) => `${val}°C`
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#10b981',
              font: { size: 10 },
              callback: (val) => `${val}mm`
            }
          }
        }
      }
    });
  },

  refreshTheme() {
    if (this.latestDailyData) {
      this.renderTrend('trendChart', this.latestDailyData);
    }
  }
};

