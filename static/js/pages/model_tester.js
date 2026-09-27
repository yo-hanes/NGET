/**
 * NEGARIT ET - MODEL TESTING SANDBOX CONTROLLER
 * Evaluates predictive disaster models against historical ground-truth datasets,
 * interactive parameter stress-tests, and custom external JSON payloads.
 */

window.ModelTesterPage = {
  initialized: false,

  init() {
    if (this.initialized) return;
    this.renderBenchmarkCards();
    this.bindSliders();
    this.bindJsonTester();
    this.initialized = true;

    // Auto-run first benchmark (Gofa Landslide 2024)
    if (window.HISTORICAL_BENCHMARKS && window.HISTORICAL_BENCHMARKS.length > 0) {
      this.runBenchmark(window.HISTORICAL_BENCHMARKS[0].id);
    }
  },

  renderBenchmarkCards() {
    const container = document.getElementById('benchmark-cards-container');
    if (!container || !window.HISTORICAL_BENCHMARKS) return;

    container.innerHTML = '';
    window.HISTORICAL_BENCHMARKS.forEach(bm => {
      const btn = document.createElement('button');
      btn.id = `bm-btn-${bm.id}`;
      btn.onclick = () => this.runBenchmark(bm.id);
      btn.className = 'w-full text-left p-3 rounded-lg border border-border hover:border-brand-blue bg-card/60 hover:bg-card transition-colors flex justify-between items-center group';
      btn.innerHTML = `
        <div>
          <div class="font-medium text-sm text-white flex items-center gap-2">
            <span>${bm.name}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-brand-blue font-bold uppercase">${bm.disasterCategory}</span>
          </div>
          <div class="text-xs text-slate-400 mt-1">${bm.description}</div>
          <div class="text-[10px] text-slate-500 mt-1 font-mono">Expected: ${bm.expectedRiskScoreMin}%+ • ${bm.expectedRiskLevel}</div>
        </div>
        <i data-lucide="play-circle" class="w-5 h-5 text-slate-400 group-hover:text-brand-blue transition-colors shrink-0"></i>
      `;
      container.appendChild(btn);
    });

    if (window.lucide) window.lucide.createIcons();
  },

  runBenchmark(bmId) {
    const bm = window.HISTORICAL_BENCHMARKS.find(b => b.id === bmId);
    if (!bm) return;

    // Highlight active card
    document.querySelectorAll('[id^="bm-btn-"]').forEach(el => {
      el.classList.remove('border-brand-blue', 'bg-brand-blue/10');
    });
    const activeBtn = document.getElementById(`bm-btn-${bmId}`);
    if (activeBtn) {
      activeBtn.classList.add('border-brand-blue', 'bg-brand-blue/10');
    }

    const t0 = performance.now();
    const preds = window.DisasterPredictionEngine.predictAll(
      bm.telemetry.current,
      bm.telemetry.daily,
      bm.telemetry.seismic,
      bm.name
    );
    const latency = (performance.now() - t0).toFixed(2);

    const targetPred = preds.find(p => p.id === bm.disasterCategory);
    const passed = targetPred && targetPred.riskScore >= bm.expectedRiskScoreMin;

    const latencyEl = document.getElementById('test-latency');
    if (latencyEl) latencyEl.textContent = `${latency} ms`;

    const badgeEl = document.getElementById('test-result-badge');
    if (badgeEl) {
      if (passed) {
        badgeEl.textContent = 'PASSED • GROUND TRUTH VERIFIED';
        badgeEl.className = 'mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      } else {
        badgeEl.textContent = 'WARNING • CALIBRATION DRIFT';
        badgeEl.className = 'mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30';
      }
    }

    const tbody = document.getElementById('test-results-table-body');
    if (tbody) {
      let rows = `
        <tr class="bg-brand-blue/15 font-semibold">
          <td class="p-2 text-white flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            Target Hazard (${bm.disasterCategory.toUpperCase()})
          </td>
          <td class="p-2 font-mono text-brand-cyan font-bold">${targetPred ? targetPred.riskScore : 0}% (${targetPred ? targetPred.riskLevel : 'N/A'})</td>
        </tr>
      `;
      preds.forEach(p => {
        if (p.id !== bm.disasterCategory) {
          rows += `
            <tr>
              <td class="p-2 text-slate-400">${p.name}</td>
              <td class="p-2 font-mono text-slate-300">${p.riskScore}% (${p.riskLevel})</td>
            </tr>
          `;
        }
      });
      tbody.innerHTML = rows;
    }
  },

  bindSliders() {
    const sliders = [
      { id: 'val-soil' },
      { id: 'val-rain' },
      { id: 'val-temp' },
      { id: 'val-seismic' }
    ];

    const rangeInputs = document.querySelectorAll('#view-model-tester input[type="range"]');
    rangeInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const span = document.getElementById(sliders[index].id);
        if (span) span.textContent = e.target.value;
        this.runLiveSliderTest();
      });
    });
  },

  runLiveSliderTest() {
    const rangeInputs = document.querySelectorAll('#view-model-tester input[type="range"]');
    if (rangeInputs.length < 4) return;

    const soil = parseFloat(rangeInputs[0].value);
    const rain = parseFloat(rangeInputs[1].value);
    const temp = parseFloat(rangeInputs[2].value);
    const seismicMag = parseFloat(rangeInputs[3].value);

    // Synthesize telemetry with slider parameters
    const syntheticCurrent = {
      temperature_2m: temp,
      relative_humidity_2m: 55,
      precipitation: rain / 4,
      soil_moisture_0_to_7cm: soil
    };

    const syntheticDaily = {
      time: Array.from({ length: 16 }, (_, i) => `Day +${i}`),
      temperature_2m_max: Array(16).fill(temp),
      temperature_2m_min: Array(16).fill(temp - 10),
      precipitation_sum: Array(16).fill(rain / 16),
      relative_humidity_2m_mean: Array(16).fill(55)
    };

    const syntheticSeismic = {
      features: seismicMag > 0 ? [{
        properties: { mag: seismicMag, title: `Simulated M${seismicMag} tremor` },
        geometry: { coordinates: [39.0, 9.0, 10] }
      }] : []
    };

    const t0 = performance.now();
    const preds = window.DisasterPredictionEngine.predictAll(
      syntheticCurrent,
      syntheticDaily,
      syntheticSeismic,
      "Stress-Test Simulation"
    );
    const latency = (performance.now() - t0).toFixed(2);

    const latencyEl = document.getElementById('test-latency');
    if (latencyEl) latencyEl.textContent = `${latency} ms`;

    const badgeEl = document.getElementById('test-result-badge');
    if (badgeEl) {
      badgeEl.textContent = 'LIVE SLIDER SIMULATION';
      badgeEl.className = 'mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/30';
    }

    const tbody = document.getElementById('test-results-table-body');
    if (tbody) {
      let rows = '';
      preds.forEach(p => {
        rows += `
          <tr>
            <td class="p-2 text-slate-300 font-medium">${p.name}</td>
            <td class="p-2 font-mono text-white">${p.riskScore}% (${p.riskLevel})</td>
          </tr>
        `;
      });
      tbody.innerHTML = rows;
    }
  },

  bindJsonTester() {
    const btn = document.getElementById('btn-test-json');
    const textarea = document.getElementById('json-input-box');
    if (!btn || !textarea) return;

    textarea.value = JSON.stringify({
      current: { temperature_2m: 34.5, soil_moisture_0_to_7cm: 0.12, precipitation: 0 },
      daily: {
        precipitation_sum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        temperature_2m_max: [35, 36, 37, 36, 35, 34, 33, 34, 35, 36, 37, 38, 37, 36, 35, 34],
        temperature_2m_min: [22, 23, 24, 23, 22, 21, 20, 21, 22, 23, 24, 25, 24, 23, 22, 21],
        relative_humidity_2m_mean: [25, 24, 22, 20, 22, 25, 28, 25, 24, 22, 20, 18, 20, 22, 24, 25]
      },
      seismic: { features: [] }
    }, null, 2);

    btn.addEventListener('click', () => {
      try {
        const payload = JSON.parse(textarea.value);
        const t0 = performance.now();
        const preds = window.DisasterPredictionEngine.predictAll(
          payload.current,
          payload.daily,
          payload.seismic,
          "Custom JSON Telemetry"
        );
        const latency = (performance.now() - t0).toFixed(2);

        const latencyEl = document.getElementById('test-latency');
        if (latencyEl) latencyEl.textContent = `${latency} ms`;

        const badgeEl = document.getElementById('test-result-badge');
        if (badgeEl) {
          badgeEl.textContent = 'JSON EVALUATION SUCCESS';
          badgeEl.className = 'mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        }

        const tbody = document.getElementById('test-results-table-body');
        if (tbody) {
          let rows = '';
          preds.forEach(p => {
            rows += `
              <tr>
                <td class="p-2 text-slate-300 font-medium">${p.name}</td>
                <td class="p-2 font-mono text-white">${p.riskScore}% (${p.riskLevel})</td>
              </tr>
            `;
          });
          tbody.innerHTML = rows;
        }
      } catch (err) {
        alert("Invalid JSON format: " + err.message);
      }
    });
  }
};
