/**
 * NEGARIT ET - AGENCY OPERATIONS & AID DISPATCH CONTROLLER
 * Connects humanitarian aid agencies (Red Cross, NDRMC, WFP) to verified Negarit
 * Community Volunteers to facilitate hospitality, shelter, food, and medical aid.
 */

window.DispatchPage = {
  agencyDeployments: [
    {
      missionId: "AID-501",
      agency: "Ethiopian Red Cross & WFP",
      targetZone: "Gambela (Baro River Basin)",
      objective: "Emergency Food & Clean Water Logistics",
      volunteerLead: "Abebe Kebede (Gambela Volunteer Mesh)",
      hospitalityFacility: "Primary School Highland Shelter (42 Families)",
      telemetryAccessGranted: "Live River Inundation & Soil Saturation",
      status: "ACTIVE ON SITE",
      priority: "CRITICAL"
    },
    {
      missionId: "AID-502",
      agency: "National Disaster Risk Management Commission (NDRMC)",
      targetZone: "Gofa Highlands (Sawla)",
      objective: "Slope Search, Rescue & Elder Evacuation",
      volunteerLead: "Bethlehem Tadesse (Gofa Mountain Scouts)",
      hospitalityFacility: "Sawla Community Hall & Family Host Homes",
      telemetryAccessGranted: "Highland Shear Stress Radar & USGS Feeds",
      status: "CONVOY EN ROUTE",
      priority: "CRITICAL"
    },
    {
      missionId: "AID-503",
      agency: "Regional Water Bureau & Relief Fleet",
      targetZone: "Afar Pastoral Lowlands (Asayita)",
      objective: "Potable Water Tanking & Livestock Forage",
      volunteerLead: "Kedir Mohammed (Afar Pastoral Scout Leader)",
      hospitalityFacility: "Asayita Central Distribution Oasis",
      telemetryAccessGranted: "16-Day Aridity Index & Soil Moisture Deficits",
      status: "WATER DISCHARGE IN PROGRESS",
      priority: "HIGH"
    },
    {
      missionId: "AID-504",
      agency: "Federal Infrastructure Safety Taskforce",
      targetZone: "East Shewa (Metahara Rift Corridor)",
      objective: "Bridge & Substation Structural Safety Inspection",
      volunteerLead: "Robel Desta (Awash Rift Community Volunteer)",
      hospitalityFacility: "Metahara Transit Station Triage",
      telemetryAccessGranted: "USGS Seismic Event Feed & Rift Fault Maps",
      status: "INSPECTION ACTIVE",
      priority: "MEDIUM"
    }
  ],

  init() {
    const container = document.getElementById('view-dispatch');
    if (!container) return;

    let rowsHtml = '';
    this.agencyDeployments.forEach(m => {
      let statusBadge = 'bg-slate-800 text-slate-300';
      if (m.status.includes('ACTIVE') || m.status.includes('PROGRESS')) {
        statusBadge = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      } else if (m.status.includes('EN ROUTE')) {
        statusBadge = 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30';
      }

      rowsHtml += `
        <tr class="hover:bg-slate-800/40 transition-colors border-b border-border/40 text-xs">
          <td class="px-4 py-3 font-mono font-bold text-brand-cyan">${m.missionId}</td>
          <td class="px-4 py-3">
            <div class="font-bold text-white">${m.agency}</div>
            <div class="text-[11px] text-slate-400 mt-0.5">${m.targetZone}</div>
          </td>
          <td class="px-4 py-3 text-slate-300">
            <div>${m.objective}</div>
            <div class="text-[10px] text-brand-blue font-mono mt-1">📡 Telemetry: ${m.telemetryAccessGranted}</div>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1.5 text-white font-medium">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-brand-cyan"></i>
              <span>${m.volunteerLead}</span>
            </div>
            <div class="text-[11px] text-amber-400 mt-0.5 flex items-center gap-1">
              <i data-lucide="home" class="w-3 h-3"></i> ${m.hospitalityFacility}
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${m.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
              ${m.priority}
            </span>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge}">${m.status}</span>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <!-- Header -->
        <div class="acrylic-card p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-brand-navy to-slate-900 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge-subtle px-2 py-0.5 rounded text-[10px] font-mono font-bold">HUMANITARIAN OPERATIONS</span>
              <span class="text-xs text-slate-400">&bull; Agency &bull; Volunteer Community Collaboration</span>
            </div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Agency Operations & Community Aid</h1>
            <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              When disasters strike and are verified, Negarit grants arriving relief agencies access to our <strong>GIS map &amp; weather telemetry</strong> and connects them directly to local <strong>volunteer community leaders</strong> to coordinate hospitality, shelter, food, and medical distribution.
            </p>
          </div>
          <button onclick="window.App.switchTab('map')" class="px-4 py-2 bg-brand-blue hover:bg-brand-blueDark text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0">
            <i data-lucide="map" class="w-4 h-4"></i> View Spatial Telemetry Map
          </button>
        </div>

        <!-- 4 KPI counters -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Deployed Relief Missions</div>
            <div class="text-2xl font-bold font-mono text-white mt-1">4 Active</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Post-verification deployments</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Community Hospitality Hubs</div>
            <div class="text-2xl font-bold font-mono text-amber-400 mt-1">12 Centers</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Hosting displaced neighbors</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Humanitarian Agencies Linked</div>
            <div class="text-2xl font-bold font-mono text-brand-cyan mt-1">18 Agencies</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Full map & telemetry access</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Volunteer Responders Guiding Aid</div>
            <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">340 Guides</div>
            <div class="text-[10px] text-slate-500 mt-0.5">On the ground at woredas</div>
          </div>
        </div>

        <!-- Operations Table -->
        <div class="glass-card rounded-xl border border-border overflow-hidden">
          <div class="p-4 border-b border-border bg-card/50 flex justify-between items-center">
            <h2 class="font-semibold text-sm text-white">Active Agency Aid Convoys & Local Volunteer Links</h2>
            <span class="text-xs text-slate-400 font-mono">Real-Time Coordination</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-slate-400 uppercase bg-card/30 border-b border-border">
                <tr>
                  <th class="px-4 py-3">Mission ID</th>
                  <th class="px-4 py-3">Agency & Target Zone</th>
                  <th class="px-4 py-3">Objective & Telemetry Feeds</th>
                  <th class="px-4 py-3">Assigned Volunteer Lead & Hospitality Site</th>
                  <th class="px-4 py-3">Priority</th>
                  <th class="px-4 py-3">Operational State</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">${rowsHtml}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};
