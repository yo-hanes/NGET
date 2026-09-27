/**
 * NEGARIT ET - EXECUTIVE OVERVIEW PAGE CONTROLLER
 * Aggregates high-level national disaster KPIs, multi-hazard alerts,
 * response readiness metrics, and recent verified field reports.
 */

window.OverviewPage = {
  init() {
    const container = document.getElementById('view-overview');
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <!-- Top Executive Banner -->
        <div class="acrylic-card p-6 rounded-2xl border border-border flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/20 text-brand-green border border-brand-green/30">FEDERAL COMMAND</span>
              <span class="text-xs text-muted">National Early Warning System &bull; Live Telemetry Sync</span>
            </div>
            <h1 class="text-2xl font-extrabold text-main tracking-tight">Executive Disaster Intelligence Briefing</h1>
            <p class="text-sm text-muted mt-1">Multi-agency coordination for drought, flood, landslide, thermal and tectonic hazard response.</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <button onclick="window.App.switchTab('approval')" class="px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-sm font-semibold shadow-lg shadow-brand-red/20 transition-all flex items-center gap-2">
              <i data-lucide="shield-alert" class="w-4 h-4"></i> Broadcast Alerts (3)
            </button>
            <button onclick="window.App.switchTab('map')" class="px-4 py-2 bg-brand-green hover:bg-brand-greenDark text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
              <i data-lucide="map" class="w-4 h-4"></i> Spatial GIS Map
            </button>
          </div>
        </div>

        <!-- 5 National KPI Counters -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-muted mb-1 font-medium">Active Alerts</div>
            <div class="text-2xl font-bold font-mono text-brand-red">156 <span class="text-xs font-normal text-red-500">+12%</span></div>
            <div class="text-[10px] text-muted mt-1">4 Critical • 24 Elevated</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-muted mb-1 font-medium">High-Risk Zones</div>
            <div class="text-2xl font-bold font-mono text-brand-amber">28 <span class="text-xs font-normal text-amber-500">+8%</span></div>
            <div class="text-[10px] text-muted mt-1">Afar, Gofa, Somali, Tigray</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-muted mb-1 font-medium">Population at Risk</div>
            <div class="text-2xl font-bold font-mono text-main">2.4M</div>
            <div class="text-[10px] text-muted mt-1">Highland & lowland woredas</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-muted mb-1 font-medium">Response Readiness</div>
            <div class="text-2xl font-bold font-mono text-brand-green">64% <span class="text-xs font-normal text-emerald-500">+6%</span></div>
            <div class="text-[10px] text-muted mt-1">74.2t supplies in transit</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-muted mb-1 font-medium">Trusted Field Counters</div>
            <div class="text-2xl font-bold font-mono text-brand-green">1,248</div>
            <div class="text-[10px] text-muted mt-1">Active Telegram & USSD mesh</div>
          </div>
        </div>

        <!-- Middle Section: Recent Alerts & System Pulse -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Recent Critical Alerts Feed -->
          <div class="lg:col-span-8 glass-card rounded-xl border border-border p-5">
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-bold text-base text-main flex items-center gap-2">
                <i data-lucide="radio" class="w-4 h-4 text-brand-red animate-pulse"></i> Priority Early Warning Feeds
              </h2>
              <span class="text-xs text-muted">Live AI Hazard Correlation</span>
            </div>
            <div class="space-y-3">
              <div class="p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-lg bg-red-500/20 text-red-500 shrink-0 text-base">🌊</div>
                  <div>
                    <div class="font-semibold text-sm text-main">Baro River Flash Flood Warning &bull; Gambela Zone</div>
                    <div class="text-xs text-muted mt-0.5">Heavy 48h headwater runoff exceeding 85mm. 184,200 population at risk.</div>
                    <div class="text-[10px] text-muted mt-2">AI Confidence: 96% &bull; Source: Open-Meteo + River Catchment Telemetry</div>
                  </div>
                </div>
                <span class="px-2 py-1 rounded text-xs font-bold bg-brand-red text-white shrink-0">CRITICAL</span>
              </div>

              <div class="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0 text-base">⛰️</div>
                  <div>
                    <div class="font-semibold text-sm text-main">Landslide Shear Stress Alert &bull; Gofa Highlands</div>
                    <div class="text-xs text-muted mt-0.5">Topsoil moisture saturation at 0.440 m³/m³. Immediate hillside slope advisory.</div>
                    <div class="text-[10px] text-muted mt-2">AI Confidence: 91% &bull; Source: Highland Slope Soil Saturation Index</div>
                  </div>
                </div>
                <span class="px-2 py-1 rounded text-xs font-bold bg-amber-500 text-white shrink-0">ELEVATED</span>
              </div>

              <div class="p-3.5 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-lg bg-purple-500/20 text-purple-500 shrink-0 text-base">🌋</div>
                  <div>
                    <div class="font-semibold text-sm text-main">Rift Valley Seismic Swarm &bull; Metahara / Awash</div>
                    <div class="text-xs text-muted mt-0.5">USGS detected cluster up to M4.9 along Main Ethiopian Rift fault lines.</div>
                    <div class="text-[10px] text-muted mt-2">AI Confidence: 94% &bull; Source: USGS Real-time GeoJSON Feed</div>
                  </div>
                </div>
                <span class="px-2 py-1 rounded text-xs font-bold bg-purple-600 text-white shrink-0">SEISMIC</span>
              </div>
            </div>
          </div>

          <!-- Operational Readiness / System Pulse -->
          <div class="lg:col-span-4 flex flex-col gap-4">
            <div class="glass-card rounded-xl border border-border p-5 flex-1">
              <h2 class="font-bold text-base text-main mb-4 flex items-center gap-2">
                <i data-lucide="activity" class="w-4 h-4 text-brand-green"></i> Emergency Infrastructure
              </h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between text-xs p-2 rounded bg-card border border-border">
                  <span class="text-main font-medium">Open-Meteo Satellite Feed</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-green/15 text-brand-green border border-brand-green/30">ONLINE</span>
                </div>
                <div class="flex items-center justify-between text-xs p-2 rounded bg-card border border-border">
                  <span class="text-main font-medium">USGS Seismic Telemetry</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-green/15 text-brand-green border border-brand-green/30">ONLINE</span>
                </div>
                <div class="flex items-center justify-between text-xs p-2 rounded bg-card border border-border">
                  <span class="text-main font-medium">Emergency SMS Gateway</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-green/15 text-brand-green border border-brand-green/30">READY</span>
                </div>
                <div class="flex items-center justify-between text-xs p-2 rounded bg-card border border-border">
                  <span class="text-main font-medium">USSD *444# Mesh Node</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-green/15 text-brand-green border border-brand-green/30">ACTIVE</span>
                </div>
                <div class="flex items-center justify-between text-xs p-2 rounded bg-card border border-border">
                  <span class="text-main font-medium">Voice 444 IVR Stream</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-green/15 text-brand-green border border-brand-green/30">STANDBY</span>
                </div>
              </div>
            </div>

            <div class="glass-card rounded-xl border border-border p-4">
              <div class="text-xs text-muted mb-1 font-medium">Total Relief Mobilized</div>
              <div class="text-xl font-bold text-main font-mono">ETB 8,640,000</div>
              <div class="text-[11px] text-muted mt-1">Disbursed via Safaricom M-PESA & relief vouchers</div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};

