/**
 * NEGARIT ET - MAP & TELEMETRY PAGE CONTROLLER
 * Connects spatial Leaflet maps, 16-day Open-Meteo telemetry,
 * real-time USGS earthquake markers, and bento KPI cards.
 */

window.MapTelemetryPage = {
  currentCity: null,
  latestTelemetry: null,
  latestSeismic: null,
  initialized: false,

  async init() {
    if (!this.initialized) {
      this.currentCity = window.WeatherAPI.CONFIG.CITIES[0]; // Addis Ababa
      window.MapController.init('leaflet-map', (selectedCity) => {
        this.selectCity(selectedCity);
      });

      const recenterBtn = document.getElementById('btn-recenter');
      if (recenterBtn) {
        recenterBtn.addEventListener('click', () => window.MapController.recenter());
      }

      this.initialized = true;
    }

    await this.loadTelemetryForCity(this.currentCity);
  },

  async selectCity(city) {
    this.currentCity = city;
    await this.loadTelemetryForCity(city);
  },

  async loadTelemetryForCity(city) {
    const statusPill = document.getElementById('system-status-text');
    if (statusPill) statusPill.textContent = `Streaming ${city.name} telemetry...`;

    try {
      const [telemetry, seismic] = await Promise.all([
        window.WeatherAPI.fetchForecast(city.lat, city.lon),
        this.latestSeismic ? Promise.resolve(this.latestSeismic) : window.WeatherAPI.fetchEarthquakes()
      ]);

      this.latestTelemetry = telemetry;
      this.latestSeismic = seismic;

      // Update Map Layers
      window.MapController.renderEarthquakeMarkers(seismic);

      // Render Bento Metrics
      this.renderBentoMetrics(telemetry);

      // Render 16-Day Chart
      window.ChartController.renderTrend('trendChart', telemetry.daily);

      // Render 16-Day Forecast Grid
      this.renderForecastGrid(telemetry.daily);

      // Render 1-2 Line AI Model Location Summary
      this.renderLocationSummary(city, telemetry, seismic);

      // Update header national highlights if available
      this.updateNationalStats();

      // Recalculate disaster predictive models for the selected city
      if (window.DisasterAnalyticsPage && !document.getElementById('view-disaster-analytics')?.classList.contains('hidden')) {
        window.DisasterAnalyticsPage.init();
      }

      if (statusPill) statusPill.textContent = `Telemetry Live (${city.name})`;
    } catch (err) {
      console.error("Failed to load telemetry:", err);
      if (statusPill) statusPill.textContent = "Telemetry Degraded (Offline Cache)";
    }
  },

  renderBentoMetrics(telemetry) {
    const cur = telemetry.current || {};
    
    const tempCard = document.getElementById('metric-temp');
    if (tempCard) {
      tempCard.querySelector('.text-2xl').textContent = `${cur.temperature_2m !== undefined ? cur.temperature_2m.toFixed(1) : '--'}°C`;
    }

    const humCard = document.getElementById('metric-humidity');
    if (humCard) {
      humCard.querySelector('.text-2xl').textContent = `${cur.relative_humidity_2m !== undefined ? Math.round(cur.relative_humidity_2m) : '--'}%`;
    }

    const rainCard = document.getElementById('metric-precip');
    if (rainCard) {
      rainCard.querySelector('.text-2xl').textContent = `${cur.precipitation !== undefined ? cur.precipitation.toFixed(1) : '0.0'}mm`;
    }

    const soilCard = document.getElementById('metric-soil');
    if (soilCard) {
      soilCard.querySelector('.text-2xl').textContent = `${cur.soil_moisture_0_to_7cm !== undefined ? cur.soil_moisture_0_to_7cm.toFixed(3) : '0.285'} m³/m³`;
    }
  },

  renderForecastGrid(daily) {
    const container = document.getElementById('forecast-grid');
    if (!container || !daily || !daily.time) return;

    let html = '';
    daily.time.forEach((t, idx) => {
      const date = new Date(t);
      const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
      const maxT = daily.temperature_2m_max[idx];
      const minT = daily.temperature_2m_min[idx];
      const rain = daily.precipitation_sum[idx];
      const hum = daily.relative_humidity_2m_mean ? daily.relative_humidity_2m_mean[idx] : 50;

      const rainClass = rain > 10 ? 'text-brand-red font-semibold' : (rain > 2 ? 'text-brand-blue' : 'text-slate-400');

      html += `
        <div class="flex-shrink-0 w-28 p-3 rounded-lg border border-border/70 bg-card/60 flex flex-col items-center text-center gap-1 hover:border-brand-blue transition-colors">
          <div class="text-xs font-medium ${idx === 0 ? 'text-brand-blue font-bold' : 'text-slate-300'}">${dayName}</div>
          <div class="text-[10px] text-slate-500">${t.slice(5)}</div>
          <div class="my-1">
            <span class="text-sm font-bold text-white">${maxT}°</span>
            <span class="text-xs text-slate-400">/${minT}°</span>
          </div>
          <div class="text-[11px] ${rainClass}">💧 ${rain}mm</div>
          <div class="text-[10px] text-slate-500">💨 ${hum}%</div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  async updateNationalStats() {
    try {
      const stats = await window.WeatherAPI.fetchNationalHighlights();
      const peakTempEl = document.getElementById('stat-peak-temp');
      const peakTempLoc = document.getElementById('stat-peak-temp-loc');
      const peakRainEl = document.getElementById('stat-peak-rain');
      const peakRainLoc = document.getElementById('stat-peak-rain-loc');

      if (peakTempEl) peakTempEl.textContent = `${stats.highestTemp}°C`;
      if (peakTempLoc) peakTempLoc.textContent = stats.highestTempCity;
      if (peakRainEl) peakRainEl.textContent = `${stats.highestRain}mm`;
      if (peakRainLoc) peakRainLoc.textContent = stats.highestRainCity;
    } catch (e) {
      // Non-critical
    }
  },

  renderLocationSummary(city, telemetry, seismic) {
    const summaryBadge = document.getElementById('map-summary-badge');
    const summaryText = document.getElementById('map-model-summary-text');
    const summaryTitle = document.getElementById('map-summary-title');

    if (!summaryText) return;

    if (summaryTitle) {
      summaryTitle.textContent = `AI Predictive Summary • ${city.name}`;
    }

    if (!window.DisasterPredictionEngine || !telemetry || !telemetry.current || !telemetry.daily) {
      summaryText.textContent = `Connecting multivariate models to ${city.name} telemetry stream...`;
      return;
    }

    const predictions = window.DisasterPredictionEngine.predictAll(
      telemetry.current,
      telemetry.daily,
      seismic,
      city.name
    );

    // Sort by risk score descending
    predictions.sort((a, b) => b.riskScore - a.riskScore);

    const top = predictions[0];
    const second = predictions[1];

    if (top.riskScore >= 60) {
      if (summaryBadge) {
        summaryBadge.textContent = top.riskScore >= 75 ? 'CRITICAL ALERT' : 'HIGH RISK WATCH';
        summaryBadge.className = top.riskScore >= 75 
          ? 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
          : 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
      }
      const secondClause = (second && second.riskScore >= 55) ? ` Secondary watch: ${second.name.split('&')[0]} (${second.riskScore}%).` : '';
      summaryText.innerHTML = `⚠️ <strong class="text-white">${city.name}:</strong> AI models project <span class="text-amber-300 font-semibold">${top.riskScore}% ${top.name}</span> risk (${top.predictedWindow}). Primary driver: <span class="font-mono text-slate-200">${top.keyIndicator}</span>.${secondClause} Protocol: <span class="text-slate-300 italic">${top.protocol}</span>`;
    } else if (top.riskScore >= 45) {
      if (summaryBadge) {
        summaryBadge.textContent = 'ELEVATED ADVISORY';
        summaryBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      }
      summaryText.innerHTML = `⚠️ <strong class="text-white">${city.name}:</strong> Moderate <span class="text-yellow-300 font-semibold">${top.name}</span> watch (${top.riskScore}%). Driven by <span class="font-mono text-slate-200">${top.keyIndicator}</span>. Soil moisture and runoff remain under observation.`;
    } else {
      if (summaryBadge) {
        summaryBadge.textContent = 'NORMAL STABLE';
        summaryBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      }
      const soilVal = (telemetry.current?.soil_moisture_0_to_7cm || 0.28).toFixed(3);
      summaryText.innerHTML = `✅ <strong class="text-white">${city.name}:</strong> All 5 predictive disaster models report baseline stability. Current rainfall, temperature, and soil saturation (<span class="font-mono text-slate-200">${soilVal} m³/m³</span>) are within safe seasonal thresholds.`;
    }
  }
};


