/**
 * NEGARIT ET - PAN-AFRICAN DISASTER RISK ANALYTICS CONTROLLER (OS-GRADE CLEAN UI)
 * Evaluates multivariate predictive models across African regional expansion hubs.
 * Default probability filter: > 60% (High / Critical Risk).
 */

window.DisasterAnalyticsPage = {
  allPredictions: [],
  filteredPredictions: [],
  minProbability: 60, // Default filter: > 60%
  searchQuery: '',
  hazardFilter: 'all',
  isLoaded: false,
  isLoading: false,
  eventsAttached: false,

  async init() {
    this.setupEventListeners();
    this.syncCountryDropdown();

    if (this.isLoaded && this.allPredictions.length > 0) {
      this.applyFilters();
      return;
    }

    await this.loadAllPredictions();
  },

  setupEventListeners() {
    if (this.eventsAttached) return;

    // 1. Pan-African Country Selector
    const countrySelect = document.getElementById('analytics-country-select');
    if (countrySelect) {
      countrySelect.value = window.WeatherAPI.activeCountryCode;
      countrySelect.addEventListener('change', async (e) => {
        await this.onCountryChanged(e.target.value);
      });
    }

    // Synchronize if country was changed on the Map page
    window.addEventListener('negarit:country-changed', async (e) => {
      const newCountry = e.detail.countryCode;
      const select = document.getElementById('analytics-country-select');
      if (select && select.value !== newCountry) {
        select.value = newCountry;
      }
      this.isLoaded = false;
      this.allPredictions = [];
      await this.loadAllPredictions();
    });

    // 2. Preset Buttons (>60%, >75%, >40%, All)
    const presetBtns = document.querySelectorAll('.prob-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const prob = parseInt(target.getAttribute('data-prob') || '60', 10);
        this.minProbability = prob;
        this.updatePresetButtons(prob);
        this.applyFilters();
      });
    });

    // 3. Custom Range Slider
    const slider = document.getElementById('prob-range-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.minProbability = val;
        this.updatePresetButtons(val);
        this.applyFilters();
      });
    }

    // 4. Search Bar
    const searchInput = document.getElementById('disaster-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    // 5. Hazard Category Dropdown
    const hazardSelect = document.getElementById('disaster-hazard-filter');
    if (hazardSelect) {
      hazardSelect.addEventListener('change', (e) => {
        this.hazardFilter = e.target.value;
        this.applyFilters();
      });
    }

    // 6. Reset to Default (>60%)
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    this.eventsAttached = true;
  },

  syncCountryDropdown() {
    const countrySelect = document.getElementById('analytics-country-select');
    if (countrySelect) {
      countrySelect.value = window.WeatherAPI.activeCountryCode;
    }
  },

  async onCountryChanged(countryCode) {
    window.WeatherAPI.setActiveCountry(countryCode, true);
    this.isLoaded = false;
    this.allPredictions = [];
    await this.loadAllPredictions();
  },

  updatePresetButtons(activeProb) {
    const presetBtns = document.querySelectorAll('.prob-preset-btn');
    presetBtns.forEach(btn => {
      const p = parseInt(btn.getAttribute('data-prob') || '60', 10);
      if (p === activeProb) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const slider = document.getElementById('prob-range-slider');
    if (slider && parseInt(slider.value, 10) !== activeProb) {
      slider.value = activeProb;
    }

    const sliderDisplay = document.getElementById('prob-slider-display');
    if (sliderDisplay) {
      sliderDisplay.textContent = `${activeProb}%`;
    }

    const badge = document.getElementById('active-filter-badge');
    if (badge) {
      if (activeProb === 60) {
        badge.textContent = 'Active: > 60% (Default)';
        badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
      } else if (activeProb >= 75) {
        badge.textContent = `Active: > ${activeProb}% (Critical)`;
        badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30';
      } else if (activeProb === 0) {
        badge.textContent = 'Active: All Threats (0-100%)';
        badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30';
      } else {
        badge.textContent = `Active: > ${activeProb}%`;
        badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-green/20 text-brand-green border border-brand-green/30';
      }
    }
  },

  resetFilters() {
    this.minProbability = 60;
    this.searchQuery = '';
    this.hazardFilter = 'all';

    const searchInput = document.getElementById('disaster-search-input');
    if (searchInput) searchInput.value = '';

    const hazardSelect = document.getElementById('disaster-hazard-filter');
    if (hazardSelect) hazardSelect.value = 'all';

    this.updatePresetButtons(60);
    this.applyFilters();
  },

  async loadAllPredictions() {
    if (this.isLoading) return;
    this.isLoading = true;

    const country = window.WeatherAPI.getActiveCountry();
    const cities = country.cities;
    const countryPrefix = country.code === 'ethiopia' ? 'ET' :
                          (country.code === 'kenya' ? 'KE' :
                          (country.code === 'south_africa' ? 'ZA' :
                          (country.code === 'drc' ? 'CD' :
                          (country.code === 'egypt' ? 'EG' :
                          (country.code === 'lesotho' ? 'LS' :
                          (country.code === 'mozambique' ? 'MZ' : 'TZ'))))));

    const subtitle = document.getElementById('analytics-subtitle');
    if (subtitle) {
      subtitle.textContent = `Evaluated across ${cities.length} regional hubs & climate corridors in ${country.name} (${country.flag})`;
    }

    const tbody = document.getElementById('disaster-table-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-4 py-12 text-center text-slate-400">
            <div class="flex flex-col items-center justify-center gap-3">
              <div class="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
              <div class="text-xs font-mono">Running multivariate disaster risk radar across all ${cities.length} ${country.name} hubs...</div>
            </div>
          </td>
        </tr>
      `;
    }

    const countBadge = document.getElementById('threat-match-count');
    if (countBadge) countBadge.textContent = `Scanning ${cities.length} ${country.name} hubs...`;

    try {
      const seismic = await window.WeatherAPI.fetchEarthquakes();

      const allResults = [];
      let threatIndex = 1;

      // Evaluate predictions across the country's cities
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        let telemetry = null;

        // Use cached or fetch/generate telemetry
        if (window.MapTelemetryPage?.currentCity?.id === city.id && window.MapTelemetryPage?.latestTelemetry) {
          telemetry = window.MapTelemetryPage.latestTelemetry;
        } else {
          telemetry = await window.WeatherAPI.fetchForecast(city.lat, city.lon, city.id);
        }

        if (window.DisasterPredictionEngine && telemetry && telemetry.current && telemetry.daily) {
          const preds = window.DisasterPredictionEngine.predictAll(
            telemetry.current,
            telemetry.daily,
            seismic,
            city.name
          );

          preds.forEach(p => {
            const risk = p.riskScore !== undefined ? p.riskScore : (p.probability || 0);
            const rawSeverity = p.severity || p.riskLevel || (risk >= 75 ? 'critical' : (risk >= 45 ? 'high' : 'low'));
            const normSeverity = String(rawSeverity).toLowerCase().includes('crit') ? 'critical' :
                                 (String(rawSeverity).toLowerCase().includes('high') || String(rawSeverity).toLowerCase().includes('elev') ? 'high' : 'low');

            allResults.push({
              ...p,
              id: p.id,
              hazardCategory: p.id || p.hazardCategory || 'all',
              hazardName: p.name || p.hazardName || 'Climate Anomaly',
              hazardIcon: p.icon || p.hazardIcon || 'alert-triangle',
              riskScore: risk,
              probability: risk,
              severity: normSeverity,
              keyFactor: p.keyIndicator || p.keyFactor || p.protocol || 'Multivariate anomaly detected',
              confidenceDisplay: typeof p.confidence === 'string' && p.confidence.includes('%') ? p.confidence : `${p.confidence || 85}%`,
              cityId: city.id,
              cityName: city.name,
              cityRegion: city.region,
              cityElevation: city.elevation,
              cityLat: city.lat,
              cityLon: city.lon,
              countryCode: country.code,
              threatCode: `#${countryPrefix}-${100 + threatIndex++}`
            });
          });
        }
      }

      // Sort by risk score descending (highest danger first)
      allResults.sort((a, b) => b.riskScore - a.riskScore);

      this.allPredictions = allResults;
      this.isLoaded = true;
      this.applyFilters();
    } catch (err) {
      console.error("Failed to load regional predictions:", err);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-8 text-center text-red-400">Failed to calculate threat matrix: ${err.message}</td></tr>`;
      }
    } finally {
      this.isLoading = false;
    }
  },

  applyFilters() {
    if (!this.allPredictions.length) return;

    let filtered = this.allPredictions.filter(p => {
      // 1. Probability Cutoff
      if (p.probability < this.minProbability) return false;

      // 2. Hazard Category Filter
      if (this.hazardFilter !== 'all' && p.hazardCategory !== this.hazardFilter) return false;

      // 3. Search Query (City, Region, Threat Code, Hazard)
      if (this.searchQuery) {
        const q = this.searchQuery;
        const match = 
          p.cityName.toLowerCase().includes(q) ||
          (p.cityRegion && p.cityRegion.toLowerCase().includes(q)) ||
          p.hazardName.toLowerCase().includes(q) ||
          p.threatCode.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    this.filteredPredictions = filtered;
    this.renderKPIs(filtered);
    this.renderThreatCards(filtered);
    this.renderTable(filtered);

    // Update match count badge
    const countBadge = document.getElementById('threat-match-count');
    if (countBadge) {
      countBadge.textContent = `${filtered.length} Threat${filtered.length === 1 ? '' : 's'} Detected`;
    }
  },

  renderKPIs(filtered) {
    const total = filtered.length;
    let extremeCount = 0;
    let highCount = 0;
    let popAtRisk = 0;

    filtered.forEach(p => {
      if (p.severity === 'critical') extremeCount++;
      if (p.severity === 'high') highCount++;
      
      if (p.severity === 'critical') popAtRisk += 450000;
      else if (p.severity === 'high') popAtRisk += 180000;
      else popAtRisk += 45000;
    });

    const elTotal = document.getElementById('kpi-total-threats');
    if (elTotal) elTotal.textContent = total;

    const elExtreme = document.getElementById('kpi-extreme-threats');
    if (elExtreme) elExtreme.textContent = extremeCount;

    const elHigh = document.getElementById('kpi-high-threats');
    if (elHigh) elHigh.textContent = highCount;

    const elPop = document.getElementById('kpi-pop-risk');
    if (elPop) {
      elPop.textContent = popAtRisk > 1000000 ? `${(popAtRisk / 1000000).toFixed(1)}M+` : `${(popAtRisk / 1000).toFixed(0)}k+`;
    }
  },

  renderThreatCards(filtered) {
    const container = document.getElementById('disaster-cards-container');
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center glass-card border border-border rounded-xl">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green">
            <i data-lucide="shield-check" class="w-6 h-6"></i>
          </div>
          <div class="font-bold text-sm text-main">Zero Anomalies Exceeding ${this.minProbability}%</div>
          <div class="text-xs text-muted mt-1 max-w-md mx-auto">
            All regional hubs are currently below the selected cutoff. Adjust your threshold slider to examine lower risk bands.
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Render Top 6 Critical Cards
    const topThreats = filtered.slice(0, 6);
    let html = '';

    topThreats.forEach(p => {
      const isCritical = p.severity === 'critical';
      const isHigh = p.severity === 'high';
      const sevDisplay = (p.severity || 'low').toUpperCase();
      
      const badgeClass = isCritical 
        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
        : (isHigh ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30');

      const progressColor = isCritical ? 'bg-red-500' : (isHigh ? 'bg-amber-400' : 'bg-brand-green');

      html += `
        <div class="glass-card p-5 rounded-2xl border border-border flex flex-col justify-between hover:border-brand-green/60 transition-all relative overflow-hidden group">
          <!-- Top Tag & Severity -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-card border border-border text-slate-400">
                ${p.threatCode}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badgeClass}">
                ${sevDisplay}
              </span>
            </div>

            <!-- Title & Location -->
            <div class="flex items-start gap-3 mb-3">
              <div class="p-2.5 rounded-xl bg-card border border-border text-brand-green shrink-0 flex items-center justify-center">
                <i data-lucide="${p.hazardIcon || 'alert-triangle'}" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-main group-hover:text-brand-green transition-colors leading-tight">
                  ${p.hazardName}
                </h4>
                <div class="text-xs text-muted mt-0.5 flex items-center gap-1.5 font-medium">
                  <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i>
                  <span>${p.cityName}</span>
                  <span class="text-[10px] text-slate-500">(${p.cityRegion})</span>
                </div>
                <div class="text-[11px] font-mono text-brand-green mt-1 flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3 h-3 text-brand-green shrink-0"></i>
                  <span>${p.predictedDate || 'Immediate'}</span>
                </div>
              </div>
            </div>

            <!-- Probability Meter -->
            <div class="my-3 p-3 rounded-xl bg-card/60 border border-border/80">
              <div class="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span class="text-muted">Event Probability</span>
                <span class="font-bold text-main">${p.probability}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full rounded-full ${progressColor} transition-all duration-500" style="width: ${p.probability}%"></div>
              </div>
            </div>

            <!-- Key Metric Reason -->
            <p class="text-xs text-muted leading-relaxed mb-4">
              ${p.keyFactor}
            </p>
          </div>

          <!-- Actions: Map & Broadcast -->
          <div class="pt-3 border-t border-border flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono text-slate-500">${p.confidenceDisplay || '85% Confidence'}</span>
            <div class="flex items-center gap-1.5">
              <button onclick="window.DisasterAnalyticsPage.viewOnMap('${p.cityId}')" title="Center on GIS Map" class="px-2.5 py-1.5 rounded-lg bg-card hover:bg-border text-slate-300 border border-border text-[11px] font-medium transition-colors flex items-center gap-1">
                <i data-lucide="map" class="w-3 h-3"></i>
                <span>GIS Map</span>
              </button>
              <button onclick="window.DisasterAnalyticsPage.prepareBroadcast('${p.cityId}', '${p.cityName}', '${p.hazardName}', ${p.probability})" class="px-3 py-1.5 rounded-lg bg-brand-green hover:bg-brand-greenDark text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1">
                <i data-lucide="radio" class="w-3 h-3"></i>
                <span>Queue Alert</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  },

  renderTable(filtered) {
    const tbody = document.getElementById('disaster-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-4 py-8 text-center text-slate-400 font-mono text-xs">
            No threats matching active filters.
          </td>
        </tr>
      `;
      return;
    }

    let rows = '';
    filtered.forEach(p => {
      const isCritical = p.severity === 'critical';
      const isHigh = p.severity === 'high';
      const sevDisplay = (p.severity || 'low').toUpperCase();
      const badgeClass = isCritical 
        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
        : (isHigh ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30');

      rows += `
        <tr class="hover:bg-card/60 transition-colors border-b border-border/60">
          <td class="px-4 py-3 font-mono text-xs text-slate-400">${p.threatCode}</td>
          <td class="px-4 py-3 font-medium text-main flex items-center gap-2">
            <i data-lucide="${p.hazardIcon || 'alert-triangle'}" class="w-4 h-4 text-brand-green shrink-0"></i>
            <span>${p.hazardName}</span>
          </td>
          <td class="px-4 py-3 text-xs text-main">
            <div class="font-semibold">${p.cityName}</div>
            <div class="text-[10px] text-muted">${p.cityRegion} &bull; ${p.cityElevation}</div>
          </td>
          <td class="px-4 py-3 text-xs">
            <div class="font-medium text-main flex items-center gap-1.5 whitespace-nowrap">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-brand-green shrink-0"></i>
              <span>${p.predictedDate || 'Immediate'}</span>
            </div>
            ${p.predictedWindow ? `<div class="text-[10px] text-muted truncate max-w-[170px] mt-0.5" title="${p.predictedWindow}">${p.predictedWindow}</div>` : ''}
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-main">${p.probability}%</span>
              <div class="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full rounded-full ${isCritical ? 'bg-red-500' : (isHigh ? 'bg-amber-400' : 'bg-brand-green')}" style="width: ${p.probability}%"></div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badgeClass}">
              ${sevDisplay}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-muted max-w-xs truncate" title="${p.keyFactor}">
            ${p.keyFactor}
          </td>
          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="window.DisasterAnalyticsPage.viewOnMap('${p.cityId}')" class="p-1.5 rounded-lg bg-card hover:bg-border text-slate-300 border border-border" title="View on GIS Map">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.DisasterAnalyticsPage.prepareBroadcast('${p.cityId}', '${p.cityName}', '${p.hazardName}', ${p.probability})" class="px-2.5 py-1 rounded-lg bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/30 text-xs font-bold transition-all" title="Draft Emergency Alert">
                Alert
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rows;
    if (window.lucide) window.lucide.createIcons();
  },

  viewOnMap(cityId) {
    const city = window.WeatherAPI?.CONFIG?.CITIES?.find(c => c.id === cityId);
    if (!city) return;

    window.App.switchTab('map');
    if (window.MapTelemetryPage) {
      window.MapTelemetryPage.selectCity(city);
    }
  },

  prepareBroadcast(cityId, cityName, hazardName, score) {
    if (window.ApprovalQueuePage) {
      const alertId = `NGR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newAlert = {
        id: alertId,
        region: cityName,
        hazard: hazardName,
        populationAtRisk: Math.floor(25000 + Math.random() * 150000),
        confidence: score,
        channels: ["SMS", "USSD"],
        status: "pending_review",
        timestamp: "Just now",
        summary: `Automated threat model detected ${hazardName} anomaly with ${score}% predictive probability for ${cityName}. Requesting authorized official clearance.`
      };

      if (!window.ApprovalQueuePage.pendingAlerts) {
        window.ApprovalQueuePage.pendingAlerts = [];
      }
      window.ApprovalQueuePage.pendingAlerts.unshift(newAlert);

      window.App.showToast(`Drafted emergency broadcast for ${cityName} to Approval Queue`, 'success');
      window.App.switchTab('approval');
    }
  }
};
