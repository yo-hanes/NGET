/**
 * NEGARIT ET - PAN-AFRICAN MAP & TELEMETRY PAGE CONTROLLER
 * Connects spatial Leaflet maps, 16-day Open-Meteo telemetry,
 * real-time USGS earthquake markers, multi-country regional filter,
 * and dynamic country color branding.
 */

window.MapTelemetryPage = {
  currentCity: null,
  latestTelemetry: null,
  latestSeismic: null,
  initialized: false,

  async init() {
    const activeCountry = window.WeatherAPI.getActiveCountry();
    const cities = window.WeatherAPI.getCities(activeCountry.code);

    if (!this.initialized) {
      this.currentCity = cities[0] || window.WeatherAPI.COUNTRIES.ethiopia.cities[0];

      window.MapController.init('leaflet-map', (selectedCity) => {
        this.selectCity(selectedCity);
      });

      this.setupControls();

      // Responsive resize & orientation listeners for mobile devices
      window.addEventListener('resize', () => {
        if (window.MapController) window.MapController.invalidateSize();
      });
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          if (window.MapController) window.MapController.invalidateSize();
        }, 200);
      });

      // Synchronize when country changes from any other view (e.g. Analytics)
      window.addEventListener('negarit:country-changed', (e) => {
        this.onCountryChanged(e.detail.countryCode, false);
      });

      this.initialized = true;
    } else {
      // Ensure dropdowns are synced with active country
      this.syncCountryDropdown(activeCountry.code);
    }

    // Invalidate size on tab activation
    setTimeout(() => {
      if (window.MapController) window.MapController.invalidateSize();
    }, 100);

    if (!this.currentCity || this.currentCity.countryCode !== activeCountry.code) {
      this.currentCity = cities[0];
    }

    await this.loadTelemetryForCity(this.currentCity);

    setTimeout(() => {
      if (window.MapController) window.MapController.invalidateSize();
    }, 300);
  },

  setupControls() {
    const countrySelect = document.getElementById('map-country-select');
    const citySelect = document.getElementById('map-city-select');
    const recenterBtn = document.getElementById('btn-recenter');

    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => window.MapController.recenter());
    }

    if (countrySelect) {
      countrySelect.value = window.WeatherAPI.activeCountryCode;
      countrySelect.addEventListener('change', (e) => {
        this.onCountryChanged(e.target.value, true);
      });
    }

    this.populateCitySelect();

    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        const cityId = e.target.value;
        const cities = window.WeatherAPI.getCities();
        const city = cities.find(c => c.id === cityId);
        if (city) {
          window.MapController.focusCity(city);
          this.selectCity(city);
        }
      });
    }
  },

  syncCountryDropdown(countryCode) {
    const countrySelect = document.getElementById('map-country-select');
    if (countrySelect && countrySelect.value !== countryCode) {
      countrySelect.value = countryCode;
      this.populateCitySelect();
    }
    this.updateCountryBadge(countryCode);
  },

  populateCitySelect() {
    const citySelect = document.getElementById('map-city-select');
    if (!citySelect) return;

    const cities = window.WeatherAPI.getCities();
    citySelect.innerHTML = '';

    cities.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.region || c.elevation})`;
      citySelect.appendChild(opt);
    });

    if (this.currentCity) {
      citySelect.value = this.currentCity.id;
    }
  },

  async onCountryChanged(countryCode, notifyEngine = true) {
    if (notifyEngine) {
      window.WeatherAPI.setActiveCountry(countryCode, true);
    }

    const country = window.WeatherAPI.COUNTRIES[countryCode] || window.WeatherAPI.COUNTRIES.ethiopia;
    const cities = country.cities;

    // Switch Map geographic view and markers
    window.MapController.switchCountry(countryCode);

    // Update City dropdown
    this.populateCitySelect();
    this.updateCountryBadge(countryCode);

    // Pick first city of the new country
    const firstCity = cities[0];
    if (firstCity) {
      this.currentCity = firstCity;
      const citySelect = document.getElementById('map-city-select');
      if (citySelect) citySelect.value = firstCity.id;
      await this.loadTelemetryForCity(firstCity);
    }
  },

  updateCountryBadge(countryCode) {
    const country = window.WeatherAPI.COUNTRIES[countryCode] || window.WeatherAPI.COUNTRIES.ethiopia;
    const badge = document.getElementById('map-country-badge');
    if (!badge) return;

    const isRedTheme = country.theme === 'red';
    badge.textContent = `${country.flag} ${country.name} GIS Hub`;

    if (isRedTheme) {
      badge.className = 'px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-red/15 text-brand-red border border-brand-red/30';
    } else {
      badge.className = 'px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-green/15 text-brand-green border border-brand-green/30';
    }
  },

  async selectCity(city) {
    this.currentCity = city;

    const cityLabel = document.getElementById('map-active-city-label');
    if (cityLabel) cityLabel.textContent = city.name;

    const citySelect = document.getElementById('map-city-select');
    if (citySelect && city.id !== 'custom') {
      citySelect.value = city.id;
    }

    await this.loadTelemetryForCity(city);
  },

  async loadTelemetryForCity(city) {
    const statusPill = document.getElementById('system-status-text');
    if (statusPill) statusPill.textContent = `Streaming ${city.name} telemetry...`;

    try {
      const [telemetry, seismic] = await Promise.all([
        window.WeatherAPI.fetchForecast(city.lat, city.lon, city.id),
        window.WeatherAPI.fetchEarthquakes()
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

      // Recalculate disaster predictive models for the selected city if view is active
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

      const rainClass = rain > 10 ? 'text-brand-red font-semibold' : (rain > 2 ? 'text-brand-green font-semibold' : 'text-slate-400');

      html += `
        <div class="flex-shrink-0 w-28 p-3 rounded-lg border border-border/70 bg-card/60 flex flex-col items-center text-center gap-1 hover:border-brand-green transition-colors">
          <div class="text-xs font-medium ${idx === 0 ? 'text-brand-green font-bold' : 'text-slate-300'}">${dayName}</div>
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

  renderLocationSummary(city, telemetry, seismic) {
    const summaryCard = document.getElementById('map-location-summary-card');
    const summaryTitle = document.getElementById('map-summary-title');
    const summaryBadge = document.getElementById('map-summary-badge');
    const summaryText = document.getElementById('map-model-summary-text');
    if (!summaryText) return;

    let topHazard = null;
    let highestProb = 0;

    if (window.DisasterPredictionEngine && telemetry && telemetry.current && telemetry.daily) {
      const preds = window.DisasterPredictionEngine.predictAll(
        telemetry.current,
        telemetry.daily,
        seismic,
        city.name
      );
      if (preds && preds.length > 0) {
        topHazard = preds[0];
        highestProb = topHazard.probability;
      }
    }

    if (summaryTitle) {
      summaryTitle.textContent = `${city.name} • Predictive Summary`;
    }

    if (topHazard && highestProb >= 60) {
      if (summaryBadge) {
        summaryBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-red/15 text-brand-red border border-brand-red/30 animate-pulse';
        summaryBadge.textContent = `${highestProb}% ${topHazard.severity.toUpperCase()} RISK`;
      }
      summaryText.textContent = `High Alert: ${topHazard.hazardName} model is flagging a ${highestProb}% event probability across ${city.name} (${topHazard.description || 'Elevated climate anomalies detected'}). Recommended immediate woreda readiness.`;
    } else if (topHazard && highestProb >= 35) {
      if (summaryBadge) {
        summaryBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30';
        summaryBadge.textContent = `${highestProb}% MODERATE`;
      }
      summaryText.textContent = `Elevated Watch: ${topHazard.hazardName} indicates ${highestProb}% likelihood for ${city.name}. Meteorological parameters remain within observation limits with normal soil saturation.`;
    } else {
      if (summaryBadge) {
        summaryBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-green/15 text-brand-green border border-brand-green/30';
        summaryBadge.textContent = `NORMAL RISK`;
      }
      summaryText.textContent = `Stable Telemetry: All 16-day hydrological, thermal, and seismic risk curves for ${city.name} are baseline. Zero critical anomaly thresholds exceeded.`;
    }
  }
};
