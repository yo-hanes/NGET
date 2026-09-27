/**
 * NEGARIT ET - DISASTER RISK ANALYTICS CONTROLLER (OS-GRADE CLEAN UI)
 * Evaluates multivariate predictive models across ALL 20 Ethiopian administrative hubs.
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

    if (this.isLoaded && this.allPredictions.length > 0) {
      this.applyFilters();
      return;
    }

    await this.loadAllPredictions();
  },

  setupEventListeners() {
    if (this.eventsAttached) return;

    // 1. Preset Buttons (>60%, >75%, >40%, All)
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

    // 2. Custom Range Slider
    const slider = document.getElementById('prob-range-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.minProbability = val;
        this.updatePresetButtons(val);
        this.applyFilters();
      });
    }

    // 3. Search Bar
    const searchInput = document.getElementById('disaster-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    // 4. Hazard Category Dropdown
    const hazardSelect = document.getElementById('disaster-hazard-filter');
    if (hazardSelect) {
      hazardSelect.addEventListener('change', (e) => {
        this.hazardFilter = e.target.value;
        this.applyFilters();
      });
    }

    // 5. Reset to Default (>60%)
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    this.eventsAttached = true;
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
        badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-blue/20 text-brand-cyan border border-brand-blue/30';
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

    const tbody = document.getElementById('disaster-table-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-4 py-12 text-center text-slate-400">
            <div class="flex flex-col items-center justify-center gap-3">
              <div class="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
              <div class="text-xs font-mono">Running multivariate disaster risk radar across all 20 Ethiopian hubs...</div>
            </div>
          </td>
        </tr>
      `;
    }

    const countBadge = document.getElementById('threat-match-count');
    if (countBadge) countBadge.textContent = 'Scanning 20 administrative hubs...';

    try {
      const cities = window.WeatherAPI?.CONFIG?.CITIES || [];
      const seismic = window.MapTelemetryPage?.latestSeismic || await window.WeatherAPI.fetchEarthquakes();

      const allResults = [];
      let threatIndex = 1;

      // Evaluate predictions across all 20 Ethiopian cities
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
            allResults.push({
              ...p,
              cityId: city.id,
              cityName: city.name,
              cityRegion: city.region,
              cityElevation: city.elevation,
              cityLat: city.lat,
              cityLon: city.lon,
              threatCode: `#ET-${100 + threatIndex++}`
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
      console.error("Failed to load national predictions:", err);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-red-400">Failed to calculate threat matrix: ${err.message}</td></tr>`;
      }
    } finally {
      this.isLoading = false;
    }
  },

  applyFilters() {
    if (!this.allPredictions.length) return;

    let filtered = this.allPredictions.filter(p => {
      // 1. Probability Cutoff
      const matchesProb = this.minProbability === 0 ? p.riskScore >= 0 : p.riskScore > this.minProbability;
      if (!matchesProb) return false;

      // 2. Hazard Type Filter
      if (this.hazardFilter !== 'all' && p.id !== this.hazardFilter) {
        return false;
      }

      // 3. Search Query (City, Region, Hazard Name, or Indicator)
      if (this.searchQuery) {
        const q = this.searchQuery;
        const haystack = `${p.cityName} ${p.cityRegion} ${p.name} ${p.keyIndicator} ${p.protocol}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    this.filteredPredictions = filtered;

    // Update match count indicator
    const countBadge = document.getElementById('threat-match-count');
    if (countBadge) {
      const probText = this.minProbability === 0 ? 'All' : `> ${this.minProbability}%`;
      countBadge.innerHTML = `Showing <strong class="text-white">${filtered.length}</strong> of ${this.allPredictions.length} threats (${probText})`;
    }

    this.renderHeader();
    this.renderSummaryCards();
    this.renderThreatTable();
  },

  renderHeader() {
    const banner = document.querySelector('#view-disaster-analytics .disaster-analytics-header');
    if (!banner) return;

    const criticalCount = this.filteredPredictions.filter(p => p.riskScore >= 75).length;
    const highCount = this.filteredPredictions.filter(p => p.riskScore >= 60 && p.riskScore < 75).length;
    const elevatedCount = this.filteredPredictions.filter(p => p.riskScore >= 45 && p.riskScore < 60).length;

    banner.innerHTML = `
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1.5 flex-wrap">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 uppercase tracking-wider">
              NATIONAL PREDICTIVE RADAR &bull; 20 HUBS
            </span>
            <span class="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-amber-400"></i> Cutoff: <strong class="text-amber-300 font-bold">> ${this.minProbability}%</strong>
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Disaster Risk Analytics</h1>
          <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Multi-hazard predictive models correlating 16-day Open-Meteo climate telemetry and USGS East African Rift seismicity.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0 flex-wrap">
          <div class="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>${criticalCount} Critical (≥ 75%)</span>
          </div>
          <div class="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>${highCount} High (60-74%)</span>
          </div>
          <div class="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-brand-cyan text-xs font-semibold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-brand-cyan"></span>
            <span>${this.filteredPredictions.length} Matching Threats</span>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  renderSummaryCards() {
    const container = document.getElementById('disaster-summary-cards');
    if (!container) return;

    if (!this.filteredPredictions.length) {
      container.innerHTML = `
        <div class="col-span-full glass-card p-6 text-center rounded-2xl border border-border">
          <div class="text-sm font-semibold text-white">No threats found above ${this.minProbability}% probability threshold</div>
          <p class="text-xs text-slate-400 mt-1">Try lowering the probability filter cutoff or selecting another hazard category.</p>
        </div>
      `;
      return;
    }

    // Top Hazard Frequency
    const hazardCounts = {};
    const regionScores = {};
    let totalScore = 0;

    this.filteredPredictions.forEach(p => {
      hazardCounts[p.name.split('&')[0].trim()] = (hazardCounts[p.name.split('&')[0].trim()] || 0) + 1;
      regionScores[p.cityRegion] = (regionScores[p.cityRegion] || 0) + p.riskScore;
      totalScore += p.riskScore;
    });

    const topHazard = Object.entries(hazardCounts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
    const topRegion = Object.entries(regionScores).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
    const criticalCount = this.filteredPredictions.filter(p => p.riskScore >= 75).length;
    const avgConfidence = (totalScore / this.filteredPredictions.length).toFixed(1);

    container.innerHTML = `
      <!-- Card 1: Active Threats -->
      <div class="glass-card p-4 rounded-2xl border border-border flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Threats</span>
          <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <i data-lucide="flame" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-3xl font-extrabold text-white font-mono">${this.filteredPredictions.length}</div>
          <div class="text-[11px] text-amber-300 mt-0.5">Threshold: > ${this.minProbability}% probability</div>
        </div>
      </div>

      <!-- Card 2: Critical Tier -->
      <div class="glass-card p-4 rounded-2xl border border-border flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical (≥ 75%)</span>
          <div class="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <i data-lucide="alert-octagon" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-3xl font-extrabold text-red-400 font-mono">${criticalCount}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Immediate intervention priority</div>
        </div>
      </div>

      <!-- Card 3: Dominant Hazard -->
      <div class="glass-card p-4 rounded-2xl border border-border flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Threat Type</span>
          <div class="p-2 rounded-xl bg-brand-blue/15 text-brand-cyan border border-brand-blue/30">
            <i data-lucide="radar" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-lg font-bold text-white truncate" title="${topHazard[0]}">${topHazard[0]}</div>
          <div class="text-[11px] text-brand-cyan mt-0.5">${topHazard[1]} locations affected</div>
        </div>
      </div>

      <!-- Card 4: Most Vulnerable Zone -->
      <div class="glass-card p-4 rounded-2xl border border-border flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vulnerable Zone</span>
          <div class="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <i data-lucide="map-pin" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-lg font-bold text-white truncate" title="${topRegion[0]}">${topRegion[0]}</div>
          <div class="text-[11px] text-purple-300 mt-0.5">Cumulative risk epicenter</div>
        </div>
      </div>

      <!-- Card 5: Mean Risk Index -->
      <div class="glass-card p-4 rounded-2xl border border-border flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean Risk Score</span>
          <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <i data-lucide="activity" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-3xl font-extrabold text-white font-mono">${avgConfidence}%</div>
          <div class="text-[11px] text-emerald-400 mt-0.5">Multivariate composite mean</div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderThreatTable() {
    const tbody = document.getElementById('disaster-table-body');
    if (!tbody) return;

    if (!this.filteredPredictions.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-4 py-12 text-center text-slate-400">
            <div class="flex flex-col items-center justify-center gap-2">
              <i data-lucide="filter-x" class="w-8 h-8 text-slate-500"></i>
              <div class="text-sm font-semibold text-white">No Threat Matches Above ${this.minProbability}%</div>
              <p class="text-xs text-slate-400">Adjust the probability filter or search terms above to see more Ethiopian locations.</p>
              <button onclick="window.DisasterAnalyticsPage.resetFilters()" class="mt-2 px-3 py-1.5 rounded-lg bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 text-xs font-semibold hover:bg-brand-blue/30 transition-colors">
                Reset to Default (> 60%)
              </button>
            </div>
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    tbody.innerHTML = '';
    this.filteredPredictions.forEach(p => {
      const isCritical = p.riskScore >= 75;
      const isHigh = p.riskScore >= 60 && p.riskScore < 75;

      let badgeClass = 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      let progressColor = '#2EA043';
      let severityLabel = 'ELEVATED';

      if (isCritical) {
        badgeClass = 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse';
        progressColor = '#F85149';
        severityLabel = 'CRITICAL';
      } else if (isHigh) {
        badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
        progressColor = '#D29922';
        severityLabel = 'HIGH RISK';
      }

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/40 transition-colors border-b border-border/40 text-xs';
      tr.innerHTML = `
        <!-- ID -->
        <td class="px-4 py-3.5 font-mono text-xs font-bold text-brand-cyan whitespace-nowrap">
          ${p.threatCode}
        </td>

        <!-- Place: City & Region -->
        <td class="px-4 py-3.5 whitespace-nowrap">
          <div class="font-bold text-white text-sm flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-cyan shrink-0"></i>
            <span>${p.cityName}</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-0.5 ml-5">${p.cityRegion} &bull; <span class="font-mono text-[10px] text-slate-500">${p.cityElevation}</span></div>
        </td>

        <!-- Hazard Model -->
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-2 font-semibold text-slate-100">
            <div class="p-1.5 rounded-lg bg-card border border-border text-brand-cyan shrink-0">
              <i data-lucide="${p.icon}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0">
              <div class="truncate font-semibold text-white">${p.name}</div>
              <div class="text-[10px] text-slate-400 font-mono mt-0.5">${p.predictedWindow}</div>
            </div>
          </div>
        </td>

        <!-- Severity Badge -->
        <td class="px-4 py-3.5 whitespace-nowrap">
          <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeClass}">
            ${severityLabel}
          </span>
        </td>

        <!-- Probability Score & Gauge -->
        <td class="px-4 py-3.5 whitespace-nowrap">
          <div class="flex items-center gap-2">
            <span class="font-mono text-base font-extrabold text-white">${p.riskScore}%</span>
            <div class="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" style="width: ${p.riskScore}%; background-color: ${progressColor};"></div>
            </div>
          </div>
          <div class="text-[10px] text-slate-400 mt-0.5 font-mono">${p.confidence}</div>
        </td>

        <!-- Telemetry & Action Protocol -->
        <td class="px-4 py-3.5 text-xs text-slate-300 max-w-xs md:max-w-md leading-relaxed">
          <div class="font-medium text-slate-200 line-clamp-2">${p.protocol}</div>
          <div class="text-[10px] font-mono text-brand-cyan mt-1 flex items-center gap-1">
            <i data-lucide="radio" class="w-3 h-3 text-brand-cyan"></i>
            <span>${p.keyIndicator}</span>
          </div>
        </td>

        <!-- Actions: Map & Broadcast -->
        <td class="px-4 py-3.5 whitespace-nowrap">
          <div class="flex items-center gap-2">
            <button onclick="window.DisasterAnalyticsPage.viewOnMap('${p.cityId}')" title="Center on GIS Map" class="px-2.5 py-1.5 rounded-lg bg-card hover:bg-border text-slate-300 border border-border text-[11px] font-medium transition-colors flex items-center gap-1">
              <i data-lucide="map" class="w-3 h-3 text-brand-cyan"></i>
              <span>GIS Map</span>
            </button>
            <button onclick="window.DisasterAnalyticsPage.prepareBroadcast('${p.cityId}', '${p.cityName}', '${p.name}', ${p.riskScore})" title="Stage Alert in Approval Queue" class="px-2.5 py-1.5 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-cyan border border-brand-blue/30 text-[11px] font-medium transition-colors flex items-center gap-1">
              <i data-lucide="send" class="w-3 h-3"></i>
              <span>Broadcast</span>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

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
        smsText: `[NEGARIT EMERGENCY] High disaster risk detected for ${cityName} (${hazardName}, ${score}% probability). Take precautions. Dial *444# for guidance.`,
        urgency: score >= 75 ? "CRITICAL" : "HIGH"
      };

      // Add to front of pendingAlerts
      window.ApprovalQueuePage.pendingAlerts.unshift(newAlert);
      if (window.App && window.App.showToast) {
        window.App.showToast(`Emergency alert staged for ${cityName} in Approval Queue!`, 'success');
      }
      window.App.switchTab('approval');
    }
  }
};
