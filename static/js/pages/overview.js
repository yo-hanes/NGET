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

        <!-- Row 3: Regional Threat Radar & Relief Logistics Readiness -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Regional Threat Radar -->
          <div class="lg:col-span-7 glass-card rounded-xl border border-border p-5">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h2 class="font-bold text-base text-main flex items-center gap-2">
                  <i data-lucide="map-pin" class="w-4 h-4 text-brand-green"></i> Regional Threat Radar
                </h2>
                <p class="text-xs text-muted mt-0.5">High-priority woreda vulnerability breakdown across key river basins & rift zones</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30 shrink-0">
                12 Regions Monitored
              </span>
            </div>

            <div class="space-y-3.5">
              <!-- South Ethiopia (Gofa) -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-semibold text-main flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-brand-red"></span> South Ethiopia &bull; Gofa & Wolayita Highlands
                  </span>
                  <span class="font-mono font-bold text-brand-red">92% &bull; CRITICAL</span>
                </div>
                <div class="w-full bg-card/80 border border-border rounded-full h-2 overflow-hidden">
                  <div class="bg-brand-red h-full rounded-full transition-all" style="width: 92%"></div>
                </div>
                <div class="text-[10px] text-muted mt-0.5 flex justify-between">
                  <span>Primary Hazard: Steep Slope Mudslide & Soil Saturation</span>
                  <span>14 Woredas in High Advisory</span>
                </div>
              </div>

              <!-- Afar -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-semibold text-main flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-brand-red"></span> Afar Region &bull; Awash Basin & Danakil
                  </span>
                  <span class="font-mono font-bold text-brand-red">85% &bull; CRITICAL</span>
                </div>
                <div class="w-full bg-card/80 border border-border rounded-full h-2 overflow-hidden">
                  <div class="bg-brand-red h-full rounded-full transition-all" style="width: 85%"></div>
                </div>
                <div class="text-[10px] text-muted mt-0.5 flex justify-between">
                  <span>Primary Hazard: Flash Flood Headwaters & Rift Tectonic Clusters</span>
                  <span>M4.9 Cluster Active</span>
                </div>
              </div>

              <!-- Somali -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-semibold text-main flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span> Somali Region &bull; Dawa & Shabelle Pastoral Zones
                  </span>
                  <span class="font-mono font-bold text-amber-500">78% &bull; ELEVATED</span>
                </div>
                <div class="w-full bg-card/80 border border-border rounded-full h-2 overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full transition-all" style="width: 78%"></div>
                </div>
                <div class="text-[10px] text-muted mt-0.5 flex justify-between">
                  <span>Primary Hazard: Borehole Water Stress & Pasture Depletion</span>
                  <span>Emergency Tanking Dispatched</span>
                </div>
              </div>

              <!-- Gambela -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-semibold text-main flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span> Gambela Region &bull; Baro & Akobo River Basins
                  </span>
                  <span class="font-mono font-bold text-amber-500">72% &bull; ELEVATED</span>
                </div>
                <div class="w-full bg-card/80 border border-border rounded-full h-2 overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full transition-all" style="width: 72%"></div>
                </div>
                <div class="text-[10px] text-muted mt-0.5 flex justify-between">
                  <span>Primary Hazard: Lowland River Overflow & Inundation</span>
                  <span>Gauge: +1.4m Above Baseline</span>
                </div>
              </div>

              <!-- Oromia & Amhara -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-semibold text-main flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-brand-green"></span> Oromia & Amhara &bull; Rift Valley & Highland Margins
                  </span>
                  <span class="font-mono font-bold text-brand-green">48% &bull; MODERATE</span>
                </div>
                <div class="w-full bg-card/80 border border-border rounded-full h-2 overflow-hidden">
                  <div class="bg-brand-green h-full rounded-full transition-all" style="width: 48%"></div>
                </div>
                <div class="text-[10px] text-muted mt-0.5 flex justify-between">
                  <span>Primary Hazard: Localized Seasonal Runoff & Agro-Moisture Watch</span>
                  <span>Normal Seasonal Envelope</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Relief Mobilization & Hub Readiness -->
          <div class="lg:col-span-5 glass-card rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h2 class="font-bold text-base text-main flex items-center gap-2">
                  <i data-lucide="package" class="w-4 h-4 text-brand-green"></i> Relief Logistics Readiness
                </h2>
                <span class="text-xs text-muted font-mono">Hubs: Adama &bull; Dire Dawa</span>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="p-3 rounded-lg bg-card border border-border">
                  <div class="text-[11px] text-muted font-medium">Grain & Food Rations</div>
                  <div class="text-lg font-bold font-mono text-main mt-1">12,450 MT</div>
                  <div class="text-[10px] text-brand-green font-medium mt-0.5">82% of target reserve</div>
                </div>
                <div class="p-3 rounded-lg bg-card border border-border">
                  <div class="text-[11px] text-muted font-medium">Emergency Shelter Kits</div>
                  <div class="text-lg font-bold font-mono text-main mt-1">8,200 Kits</div>
                  <div class="text-[10px] text-brand-green font-medium mt-0.5">Ready for airlift</div>
                </div>
                <div class="p-3 rounded-lg bg-card border border-border">
                  <div class="text-[11px] text-muted font-medium">Water Purification</div>
                  <div class="text-lg font-bold font-mono text-main mt-1">46 Units</div>
                  <div class="text-[10px] text-amber-500 font-medium mt-0.5">32 currently in field</div>
                </div>
                <div class="p-3 rounded-lg bg-card border border-border">
                  <div class="text-[11px] text-muted font-medium">Rapid Medical Teams</div>
                  <div class="text-lg font-bold font-mono text-main mt-1">18 Convoys</div>
                  <div class="text-[10px] text-brand-green font-medium mt-0.5">4h deployment radius</div>
                </div>
              </div>

              <div class="p-3 rounded-lg bg-brand-green/10 border border-brand-green/20 text-xs text-main flex items-center gap-3">
                <i data-lucide="truck" class="w-5 h-5 text-brand-green shrink-0"></i>
                <div class="text-[11px]">
                  <strong>14 Heavy Convoy Transports</strong> currently en route to Sawla (Gofa) and Gambela Logistics Staging Bases.
                </div>
              </div>
            </div>

            <button onclick="window.App.switchTab('resources')" class="w-full mt-4 py-2 px-3 bg-card hover:bg-brand-green/10 border border-border hover:border-brand-green/30 text-xs font-semibold rounded-lg text-main transition-colors flex items-center justify-center gap-2">
              <i data-lucide="layers" class="w-3.5 h-3.5 text-brand-green"></i> Inspect Full Logistics & Inventory
            </button>
          </div>
        </div>

        <!-- Row 4: Recent Field Reports & Federal Emergency Hotlines -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Recent Verified Field Incidents Stream -->
          <div class="lg:col-span-8 glass-card rounded-xl border border-border p-5">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h2 class="font-bold text-base text-main flex items-center gap-2">
                  <i data-lucide="rss" class="w-4 h-4 text-brand-green"></i> Recent Field Reports & Citizen Ingestion
                </h2>
                <p class="text-xs text-muted mt-0.5">Live vetted telemetry incoming via Telegram @NegaritBot and USSD *444#</p>
              </div>
              <button onclick="window.App.switchTab('reports')" class="text-xs text-brand-green hover:underline font-semibold flex items-center gap-1">
                View All <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="space-y-3">
              <!-- Item 1 -->
              <div class="p-3 rounded-lg bg-card border border-border flex items-center justify-between gap-3 hover:border-brand-green/40 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center font-bold text-sm shrink-0">
                    <i data-lucide="droplet" class="w-4 h-4"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-main truncate">Flash flood runoff along Gambela-Itang roadway</div>
                    <div class="text-[10px] text-muted flex items-center gap-2 mt-0.5">
                      <span>Itang Special Woreda</span> &bull; 
                      <span>12 mins ago</span> &bull; 
                      <span class="text-emerald-500 font-medium">Telegram Bot Photo Verified</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30 shrink-0">
                  DISPATCHED
                </span>
              </div>

              <!-- Item 2 -->
              <div class="p-3 rounded-lg bg-card border border-border flex items-center justify-between gap-3 hover:border-brand-green/40 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
                    <i data-lucide="mountain" class="w-4 h-4"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-main truncate">Hillside tension cracks observed on Sawla ridge</div>
                    <div class="text-[10px] text-muted flex items-center gap-2 mt-0.5">
                      <span>Sawla Woreda &bull; Gofa</span> &bull; 
                      <span>38 mins ago</span> &bull; 
                      <span class="text-amber-500 font-medium">USSD *444# Field Counter Alert</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0">
                  EVALUATING
                </span>
              </div>

              <!-- Item 3 -->
              <div class="p-3 rounded-lg bg-card border border-border flex items-center justify-between gap-3 hover:border-brand-green/40 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold text-sm shrink-0">
                    <i data-lucide="activity" class="w-4 h-4"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-main truncate">Sub-surface tremors felt near Metahara town center</div>
                    <div class="text-[10px] text-muted flex items-center gap-2 mt-0.5">
                      <span>East Shewa &bull; Oromia</span> &bull; 
                      <span>1 hour ago</span> &bull; 
                      <span class="text-purple-400 font-medium">USGS M4.2 Correlated</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 shrink-0">
                  CONFIRMED
                </span>
              </div>

              <!-- Item 4 -->
              <div class="p-3 rounded-lg bg-card border border-border flex items-center justify-between gap-3 hover:border-brand-green/40 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-red-500/15 text-red-500 flex items-center justify-center font-bold text-sm shrink-0">
                    <i data-lucide="sun" class="w-4 h-4"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-main truncate">Borehole solar pump inverter shutdown in Dolo Ado pasture</div>
                    <div class="text-[10px] text-muted flex items-center gap-2 mt-0.5">
                      <span>Dolo Ado &bull; Liben Zone</span> &bull; 
                      <span>2 hours ago</span> &bull; 
                      <span class="text-emerald-500 font-medium">Community Reporter Verified</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30 shrink-0">
                  REPAIR QUEUED
                </span>
              </div>
            </div>
          </div>

          <!-- Federal Emergency Hotlines & Inter-Agency Contacts -->
          <div class="lg:col-span-4 glass-card rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-3">
                <h2 class="font-bold text-base text-main flex items-center gap-2">
                  <i data-lucide="phone-call" class="w-4 h-4 text-brand-green"></i> Emergency Hotlines
                </h2>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30">
                  24/7 Active
                </span>
              </div>
              <p class="text-xs text-muted mb-4">Direct national coordination and inter-agency dispatch hotlines</p>

              <div class="space-y-2.5">
                <div class="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-main">NDRMC Command Center</div>
                    <div class="text-[10px] text-muted">National Disaster Risk Commission</div>
                  </div>
                  <a href="tel:833" class="px-2.5 py-1 rounded bg-brand-green text-white font-mono font-bold text-xs hover:bg-brand-greenDark transition-colors">
                    833
                  </a>
                </div>

                <div class="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-main">Ethiopian Red Cross</div>
                    <div class="text-[10px] text-muted">Humanitarian & Evacuation Dispatch</div>
                  </div>
                  <a href="tel:907" class="px-2.5 py-1 rounded bg-brand-red text-white font-mono font-bold text-xs hover:bg-brand-redDark transition-colors">
                    907
                  </a>
                </div>

                <div class="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-main">EPHI Public Health Ops</div>
                    <div class="text-[10px] text-muted">Epidemic & Waterborne Alert</div>
                  </div>
                  <a href="tel:8335" class="px-2.5 py-1 rounded bg-card hover:bg-black/5 dark:hover:bg-white/10 border border-border text-main font-mono font-bold text-xs transition-colors">
                    8335
                  </a>
                </div>

                <div class="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-main">Federal Police Emergency</div>
                    <div class="text-[10px] text-muted">Search & Rescue Assistance</div>
                  </div>
                  <a href="tel:991" class="px-2.5 py-1 rounded bg-card hover:bg-black/5 dark:hover:bg-white/10 border border-border text-main font-mono font-bold text-xs transition-colors">
                    991
                  </a>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
              <span>National Operations Standard</span>
              <span class="font-bold text-brand-green flex items-center gap-1">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Protocol Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};

